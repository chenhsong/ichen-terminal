import { Component, Input, ChangeDetectionStrategy, ChangeDetectorRef } from "@angular/core";
import { filter } from "rxjs/operators";
import { DataStoreService } from "../services/data-store-service";
import { HTML } from "../app.config";
import { buildTemplate } from "./controller-template";

@Component({
	selector: HTML.controller,
	template: buildTemplate("state", "isCollapsed", "calcRatio"),
	changeDetection: ChangeDetectionStrategy.OnPush
})
export class ControllerComponent
{
	@Input() public readonly state!: IControllerState;

	public isCollapsed = (window.innerWidth < 600);

	constructor(cd: ChangeDetectorRef, dataStore: DataStoreService<number, IControllerState>)
	{
		dataStore.onChange
			.pipe(filter(id => this.state && (id <= 0 || this.state.controllerId === id)))
			.subscribe(id => cd.markForCheck());
	}

	public onClick(event: MouseEvent)
	{
		this.isCollapsed = !this.isCollapsed;
		event.preventDefault();
	}

	public calcRatio(value: number, max: number = 100, min: number = 0)
	{
		return Math.max(Math.min((value - min) * 100 / (max - min), 100), 0);
	}
}
