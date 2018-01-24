import { Component, Input, ChangeDetectionStrategy, ChangeDetectorRef } from "@angular/core";
import DataStoreService from "../services/DataStoreService";
import { HTML } from "../config";
import BuildTemplate from "./controller-template";

@Component({
	selector: HTML.controller,
	template: BuildTemplate("state", "isCollapsed", "calcRatio"),
	changeDetection: ChangeDetectionStrategy.OnPush
})
export default class ControllerComponent
{
	@Input() public readonly state: IControllerState;

	public isCollapsed = (window.innerWidth < 600);

	constructor(cd: ChangeDetectorRef, dataStore: DataStoreService<number, IControllerState>)
	{
		dataStore.onChange
			.filter(id => this.state && (id <= 0 || this.state.controllerId === id))
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