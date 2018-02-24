import { Inject, Injectable, ChangeDetectorRef } from "@angular/core";
import { Observable, Subject } from "rxjs/Rx";

@Injectable()
export class DataStoreService<K, T>
{
	private dataStore = new Map<string, T>();
	private changesSubject = new Subject<K>();

	public getMap() { return this.dataStore; }

	// Mimic Map
	public has(id: K | string): boolean { return !!this.dataStore.has(id.toString()); }
	public get(id: K | string) { return this.dataStore.get(id.toString()); }
	public set(id: K | string, value: T)
	{
		this.dataStore.set(id.toString(), value);
		if (typeof id !== "string") this.raiseChangeEvent(id);
	}
	public delete(id: K | string)
	{
		this.dataStore.delete(id.toString());
		if (typeof id !== "string") this.raiseChangeEvent(id);
	}
	public get size(): number { return this.dataStore.size; }
	public keys() { return this.dataStore.keys(); }
	public values() { return this.dataStore.values(); }

	// Changes detection
	public get onChange() { return this.changesSubject as Observable<K>; }

	public raiseChangeEvent(id: K) { this.changesSubject.next(id); }
}
