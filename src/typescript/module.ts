import { NgModule } from "@angular/core";
import { BrowserModule } from "@angular/platform-browser";
import { HttpModule } from "@angular/http";

import DataStoreService from "./services/DataStoreService";
import { NetworkService } from "./services/NetworkService";
import { MessageService } from "./services/MessageService";

import CanvasStylesPipe from "./services/canvas-styles.pipe";
import ControllerFrameStylesPipe from "./services/controller-frame-styles.pipe";
import ControllerStylesPipe from "./services/controller-styles.pipe";
import FlattenPipe from "./services/flatten.pipe";
import TextMapPipe from "./services/text-map.pipe";
import DecimalPipe from "./services/decimal.pipe";

import AppComponent from "./app";
import ControllerComponent from "./views/controller";
import ControllersListComponent from "./views/controllers";

@NgModule({
	imports: [BrowserModule, HttpModule],

	declarations: [
		// Components
		AppComponent,
		ControllerComponent,
		ControllersListComponent,

		// Pipes
		CanvasStylesPipe,
		ControllerFrameStylesPipe,
		ControllerStylesPipe,
		FlattenPipe,
		TextMapPipe,
		DecimalPipe
	],

	providers: [
		DataStoreService,
		NetworkService,
		MessageService
	],

	bootstrap: [AppComponent]
})
export default class AppModule
{
}