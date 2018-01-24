import { Component, Input, Output, ChangeDetectionStrategy } from "@angular/core";
import { Observable } from "rxjs/Rx";
import { HTML, CSS } from "../config";

@Component({
	selector: HTML.controllersList,
	template: `
		<${HTML.controller} *ngFor="let ctrl of controllersList|async; trackBy:trackByController"
			id="${HTML.controllerId}-{{ctrl.controllerId}}"
			class="${CSS.controller}"
			[ngStyle]="ctrl|controllerStyles"
			[state]="ctrl">
		</${HTML.controller}>
	`,
	changeDetection: ChangeDetectionStrategy.OnPush
})
export default class ControllersListComponent
{
	@Input() public readonly controllersList: Observable<IControllerState[]>;

	// Do not regenerate list excessively
	public trackByController(index: number, ctrl: IControllerState) { return ctrl.controllerId; }
}