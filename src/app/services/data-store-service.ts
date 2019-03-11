import { Injectable } from "@angular/core";
import { Observable, Subject } from "rxjs";

@Injectable()
export class DataStoreService<K, T>
{
	private dataStore = new Map<K, T>();
	private changesSubject = new Subject<K>();

	// Mimic Map
	public has(id: K) { return this.dataStore.has(id); }
	public get(id: K) { return this.dataStore.get(id); }
	public set(id: K, value: T)
	{
		this.dataStore.set(id, value);
		this.raiseChangeEvent(id);
		return this;
	}
	public delete(id: K)
	{
		const r = this.dataStore.delete(id);
		this.raiseChangeEvent(id);
		return r;
	}
	public get size() { return this.dataStore.size; }
	public keys() { return this.dataStore.keys(); }
	public values() { return this.dataStore.values(); }

	// Changes detection
	public get onChange(): Observable<K> { return this.changesSubject; }

	public raiseChangeEvent(id: K) { this.changesSubject.next(id); }
}
