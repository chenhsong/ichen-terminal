import { Injectable } from "@angular/core";
import { Observable, Subject, timer } from "rxjs";
import { map, tap, retryWhen, delayWhen } from "rxjs/operators";
import { webSocket, WebSocketSubject, WebSocketSubjectConfig } from "rxjs/webSocket";
import { Config } from "../app.config";

export const enum NetworkState
{
	Offline = 0, Online = 1, Connecting = 2, Error = 9
}

@Injectable()
export class NetworkService<T>
{
	private webSocket: WebSocketSubject<T> | null = null;
	private isConnectionAlive = false;
	private reconnectInterval = 5000;

	// Observables
	private readonly connectionStream = new Subject<NetworkState>();
	private readonly dataStream = new Subject<T>();

	public get isInitialized() { return !!this.webSocket; }
	public get isConnected() { return this.isConnectionAlive; }
	public get onConnection() { return this.connectionStream as Observable<NetworkState>; }
	public get onData() { return this.dataStream as Observable<T>; }

	constructor()
	{
		const url = Config.url as string;

		console.debug(`Connecting WebSocket to [${url}]...`);

		const options: WebSocketSubjectConfig<T> = {
			url: url,
			openObserver: {
				next: ev =>
				{
					console.debug("WebSocket connection is open.");
					this.reconnectInterval = 5000;
					this.isConnectionAlive = true;
					this.connectionStream.next(NetworkState.Online);
				}
			},
			closeObserver: {
				next: ev =>
				{
					console.debug("WebSocket connection is closed.");
					this.isConnectionAlive = false;
					this.connectionStream.next(NetworkState.Offline);
				}
			}
		};

		this.webSocket = webSocket(options);

		this.webSocket.pipe(retryWhen(errors => errors.pipe(
			tap(err =>
			{
				console.error("Error in WebSocket connection!", err);
				this.connectionStream.next(NetworkState.Error);
			}),
			map(() =>
			{
				const interval = this.reconnectInterval;
				console.debug(`Waiting ${Math.round(interval / 100) / 10} seconds before reconnecting...`);
				return interval;
			}),
			delayWhen(interval => timer(interval)),
			tap(() =>
			{
				if (this.reconnectInterval < 60000) this.reconnectInterval *= 1.1;		// Progressively enlarge reconnection interval

				console.log("Reconnecting WebSocket...");
				this.connectionStream.next(NetworkState.Connecting);
			})
		))).subscribe(m =>
		{
			console.log("WebSocket message received", m);

			// Parse JSON message
			try {
				this.dataStream.next(m);
			} catch (err) {
				console.error(`Cannot parse JSON message (${err}):\n${m}`);
			}
		}, (err: unknown) =>
			{
				console.error("Error in WebSocket communications.", err);
				this.isConnectionAlive = false;
				this.connectionStream.next(NetworkState.Error);
			}, () =>
			{
				this.isConnectionAlive = false;
				this.connectionStream.next(NetworkState.Offline);
			});

		// Create a new WebSocket connection
		console.debug(`Started new WebSocket to [${url}]...`);

		this.connectionStream.next(NetworkState.Connecting);
	}

	public sendObject(obj: unknown)
	{
		if (Config.settings.TestingMode) return;
		if (!this.isInitialized) throw new Error("Connection not yet made.");
		if (!this.isConnected) return;

		console.log("Sending message", obj);
		this.webSocket!.next(obj as T);
	}
}
