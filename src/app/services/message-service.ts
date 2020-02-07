import { Injectable } from "@angular/core";
import { KeyValue } from "@angular/common";
import { Dictionary, IControllerStatus, Languages, OpModes, JobModes } from "../interfaces";

//#region WebSocket message types

export type CommandMessageTypes = "Alive" | "RequestControllersList" | "Join" | "RequestMoldData" | "ReadMoldData" | "JobCardsList" | "OperatorInfo";
export type ValidMessageTypes = CommandMessageTypes | "ControllersList" | "JoinResponse" | "MoldData" | "CycleData" | "ControllerAction" | "ControllerStatus" | "RequestJobCardsList" | "LoginOperator";
export type DeprecatedMessageTypes = "Preferences" | "SystemMessage" | "UpdateControllerInfo" | "UpdateLanguage";

export interface IMessageBase
{
	sequence: number;
	priority?: number;
	$type: ValidMessageTypes | DeprecatedMessageTypes;
}

export type ICommandMessage = IAliveMessage | IRequestControllersListMessage | IJoinMessage | IRequestMoldDataMessage | IReadMoldDataMessage | IJobCardsListMessage | IOperatorInfoMessage;
export type IDeprecatedMessage = IPreferencesMessage | ISystemMessageMessage | IUpdateControllerInfoMessage | IUpdateLanguageMessage;
export type IResponseMessage = IAliveMessage | IControllersListMessage | IJoinResponseMessage | IMoldDataMessage | ICycleDataMessage | IControllerActionMessage | IControllerStatusMessage | IRequestJobCardsListMessage | ILoginOperatorMessage;
export type IMessage = ICommandMessage | IResponseMessage | IDeprecatedMessage;

export interface IDataDictionaryMessage<T> extends IMessageBase
{
	data: Dictionary<T>;
}
export interface IControllerSpecificMessage extends IMessageBase
{
	controllerId: number;
}
export interface IAliveMessage extends IMessageBase
{
	$type: "Alive";
}
export interface IRequestControllersListMessage extends IMessageBase
{
	$type: "RequestControllersList";
}
export interface IControllersListMessage extends IDataDictionaryMessage<IControllerStatus>
{
	$type: "ControllersList";
}
export interface IJoinMessage extends IMessageBase
{
	$type: "Join";
	language: Languages;
	version: string;
	orgId?: string;
	password: string;
	filter?: string;
}
export interface IJoinResponseMessage extends IMessageBase
{
	$type: "JoinResponse";
	result: number;
	level: number;
	message: string;
}
export interface IRequestMoldDataMessage extends IControllerSpecificMessage
{
	$type: "RequestMoldData";
}
export interface IReadMoldDataMessage extends IControllerSpecificMessage
{
	$type: "ReadMoldData";
	field: string;
}
export interface IDictionaryMessage extends IDataDictionaryMessage<number>, IControllerSpecificMessage
{
	timestamp: Date;
	jobCardId?: string;
	moldId?: string;
	operatorId: number;
}
export interface ICycleDataMessage extends IDictionaryMessage
{
	$type: "CycleData";
}
export interface IMoldDataMessage extends IDictionaryMessage
{
	$type: "MoldData";
}
export interface IPreferencesMessage extends IDataDictionaryMessage<unknown>
{
	$type: "Preferences";
}
export interface ISystemMessageMessage extends IMessageBase
{
	$type: "SystemMessage";
	message: string;
}
export interface IControllerActionMessage extends IControllerSpecificMessage
{
	$type: "ControllerAction";
	timestamp: Date;
	actionId: number;
}
export interface IUpdateControllerInfoMessage extends IControllerSpecificMessage
{
	$type: "UpdateControllerInfo";
	displayName: string;
}
export interface IControllerStatusMessage extends IControllerSpecificMessage
{
	$type: "ControllerStatus";
	timestamp: Date;
	displayName?: string;
	isDisconnected?: boolean;
	opMode?: OpModes;
	jobMode?: JobModes;
	jobCardId?: string | null;
	alarm?: KeyValue<string, boolean>;
	audit?: KeyValue<string, number>;
	operatorId?: number;
	operatorName?: string | null;
	moldId?: string | null;
	controller?: IControllerStatus;
}
export interface IUpdateLanguageMessage extends IMessageBase
{
	$type: "UpdateLanguage";
	language: Languages;
}
export interface IJobCard
{
	jobCardId: string;
	moldId: string;
	progress: number;
	total: number;
}
export interface IRequestJobCardsListMessage extends IControllerSpecificMessage
{
	$type: "RequestJobCardsList";
}
export interface IJobCardsListMessage extends IDataDictionaryMessage<IJobCard>, IControllerSpecificMessage
{
	$type: "JobCardsList";
}
export interface ILoginOperatorMessage extends IControllerSpecificMessage
{
	$type: "LoginOperator";
	password: string;
}
export interface IOperatorInfoMessage extends IControllerSpecificMessage
{
	$type: "OperatorInfo";
	operatorId: number;
	name: string;
	password: string;
	level: number;
}
//#endregion

function throwParamError(msg: string) { throw new Error(`Invalid parameters for ${msg}`); }

@Injectable()
export class MessageService
{
	private seq = 0;

	public get nextSequenceNumber() { return ++this.seq; }

	public create(type: "Alive", priority?: number): IAliveMessage;
	public create(type: "Join", params: { language: Languages; version: string; orgId?: string; password: string; filter?: string; }, priority?: number): IJoinMessage;
	public create(type: "RequestControllersList", priority?: number): IRequestControllersListMessage;
	public create(type: "RequestMoldData", controllerId: number, priority?: number): IRequestMoldDataMessage;
	public create(type: "ReadMoldData", params: { controllerId: number; field: string; }, priority?: number): IReadMoldDataMessage;
	public create(type: "JobCardsList", params: { controllerId: number; jobCards: IJobCard[]; }, priority?: number): IJobCardsListMessage;
	public create(type: "OperatorInfo", params: { controllerId: number; operatorId: number; name: string; password: string; level: number; }, priority?: number): IOperatorInfoMessage;
	public create(type: CommandMessageTypes, params?: Dictionary<any> | number, priority?: number): ICommandMessage
	{
		const msg = {
			$type: type,
			sequence: this.nextSequenceNumber,
			priority: priority || 0
		} as ICommandMessage;

		switch (type) {
			case "Alive": {
				msg.priority = (typeof params === "number") ? params : -10;		// Default value = -10
				break;
			}

			case "Join": {
				if (!params || typeof params !== "object") throw throwParamError(type);

				const jmsg = msg as IJoinMessage;
				jmsg.language = params.language;
				jmsg.version = params.version;
				if (params.orgId) jmsg.orgId = params.orgId;
				jmsg.password = params.password;
				jmsg.filter = params.filter;
				break;
			}

			case "RequestControllersList":
				break;

			case "RequestMoldData": {
				if (!params || typeof params !== "object") throw throwParamError(type);

				const rmsg = msg as IRequestMoldDataMessage;
				rmsg.controllerId = params.controllerId;
				break;
			}

			case "ReadMoldData": {
				if (!params || typeof params !== "object") throw throwParamError(type);

				const rmsg = msg as IReadMoldDataMessage;
				rmsg.controllerId = params.controllerId;
				rmsg.field = params.field;
				break;
			}

			case "JobCardsList": {
				if (!params || typeof params !== "object") throw throwParamError(type);

				const jcmsg = msg as IJobCardsListMessage;
				const list = params.jobCards as IJobCard[];
				jcmsg.controllerId = params.controllerId;
				jcmsg.data = {};
				for (const jc of list) jcmsg.data[jc.jobCardId] = jc;
				break;
			}

			case "OperatorInfo": {
				if (!params || typeof params !== "object") throw throwParamError(type);

				const omsg = msg as IOperatorInfoMessage;
				omsg.controllerId = params.controllerId;
				omsg.operatorId = params.operatorId;
				omsg.name = params.name;
				omsg.password = params.password;
				omsg.level = params.level;
				break;
			}
		}

		return msg;
	}
}
