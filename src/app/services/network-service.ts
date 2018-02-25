import { Inject, Injectable } from "@angular/core";
import { Observable } from "rxjs/Observable";
import { Subject } from "rxjs/Subject";
import "rxjs/add/operator/filter";
import { $WebSocket, WebSocketConfig } from "angular2-websocket/angular2-websocket";
import { Config } from "../app.config";

export enum NetworkState
{
	Offline = 0, Online = 1, Connecting = 2, Error = 9
}

@Injectable()
export class NetworkService<T>
{
	private webSocket: $WebSocket | null = null;
	private webSocketInProgress: $WebSocket | null = null;
	private isConnectionAlive = false;
	private reconnectionInterval = 0;
	private lastConnectionAttemptTime = 0;

	// Observables
	private readonly connectionStream = new Subject<NetworkState>();
	private readonly dataStream = new Subject<T>();

	constructor()
	{
		// Default reconnection interval = 15s
		this.reconnectionInterval = Config.settings.ServerReconnectionInterval || 15000;
	}

	public get isInitialized() { return !!this.webSocket; }
	public get isConnected() { return this.isConnectionAlive; }
	public get onConnection() { return this.connectionStream as Observable<NetworkState>; }
	public get onData() { return this.dataStream as Observable<T>; }

	private reconnect(url: string)
	{
		if (this.webSocket) {
			try {
				this.webSocket.close(true);
			} catch (ex) {
				console.error("Error closing WebSocket connection.", ex);
			}

			this.isConnectionAlive = false;
		}

		// Create a new WebSocket connection
		const ws = new $WebSocket(url);

		// Connect the WebSocket
		this.connectionStream.next(NetworkState.Connecting);
		ws.connect();

		// Wire up events
		ws.onOpen(() =>
		{
			this.isConnectionAlive = true;

			// Prepare the messages stream
			ws.getDataStream().map(m =>
			{
				// Parse JSON message
				try {
					return JSON.parse(m.data) as T;
				} catch (err) {
					console.error(`Cannot parse JSON message (${err}):\n${m.data}`);
					return null;
				}
			}).filter(m => !!m)
				.subscribe(x => this.dataStream.next(x as T));

			// Reset reconnection interval
			this.reconnectionInterval = Config.settings.ServerReconnectionInterval;

			this.lastConnectionAttemptTime = 0;
			this.webSocketInProgress = null;
			this.webSocket = ws;

			this.connectionStream.next(NetworkState.Online);
		});
		ws.onError((err: any) =>
		{
			this.isConnectionAlive = false;
			if (this.webSocketInProgress === ws) {
				this.lastConnectionAttemptTime = Date.now();
				this.webSocketInProgress = null;
				console.error(`Cannot establish WebSocket connection to [${url}].`, err);
			} else {
				console.error("Error in WebSocket communications.", err);
			}
			this.connectionStream.next(NetworkState.Error);
		});
		ws.onClose(() =>
		{
			this.isConnectionAlive = false;
			this.connectionStream.next(NetworkState.Offline);
		});

		this.webSocketInProgress = ws;
	}

	public refresh()
	{
		// Is it attempting to connect?
		if (this.webSocketInProgress) return;

		// Check if reconnection is needed
		let needReconnection = false;

		if (!this.webSocket) {
			needReconnection = true;
		} else {
			// Check WebSocket state
			switch (this.webSocket.getReadyState()) {
				case 0: break;		// Opening
				case 1: break;		// Open
				default: needReconnection = true; break;
			}
		}

		if (needReconnection) {
			// Only reconnect after an interval
			if (this.lastConnectionAttemptTime && Date.now() - this.lastConnectionAttemptTime < this.reconnectionInterval) return;

			// Expand the reconnection interval by 10% each time
			this.reconnectionInterval *= 1.1;

			try {
				if (this.webSocket) {
					console.log("WebSocket connection is broken! Reconnecting WebSocket...");
				} else {
					console.log(`Establishing WebSocket connection to [${Config.url}]...`);
				}
				this.reconnect(Config.url as string);
			} catch (ex) {
				console.error("Cannot reconnect WebSocket!", ex);
			}
		}
	}

	public terminate()
	{
		if (Config.settings.TestingMode) return;
		if (!this.isInitialized) throw new Error("Connection not yet made.");
		this.webSocket!.close(true);
	}

	public sendObject(obj: {})
	{
		if (Config.settings.TestingMode) return;
		if (!this.isConnectionAlive) return;
		if (!this.isInitialized) throw new Error("Connection not yet made.");

		console.log(this.webSocket!.getReadyState(), "Sending message", obj);
		this.webSocket!.send(JSON.stringify(obj)).subscribe();
	}
}
