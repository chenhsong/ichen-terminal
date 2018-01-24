import { Inject, Injectable } from "@angular/core";

// Enum types
export type CommandMessageTypes = "Alive" | "RequestControllersList" | "Join" | "RequestMoldData" | "JobCardsList" | "OperatorInfo";
export type ValidMessageTypes = CommandMessageTypes | "ControllersList" | "JoinResponse" | "MoldData" | "CycleData" | "ControllerAction" | "ControllerStatus" | "RequestJobCardsList" | "LoginOperator";
export type DeprecatedMessageTypes = "Preferences" | "SystemMessage" | "UpdateControllerInfo" | "UpdateLanguage";

// WebSocket message base
export interface IMessageBase
{
	sequence: number;
	priority?: number;
	$type: ValidMessageTypes | DeprecatedMessageTypes;
}

export type ICommandMessage = IAliveMessage | IRequestControllersListMessage | IJoinMessage | IRequestMoldDataMessage | IJobCardsListMessage | IOperatorInfoMessage;
export type IDeprecatedMessage = IPreferencesMessage | ISystemMessageMessage | IUpdateControllerInfoMessage | IUpdateLanguageMessage;
export type IResponseMessage = IAliveMessage | IControllersListMessage | IJoinResponseMessage | IMoldDataMessage | ICycleDataMessage | IControllerActionMessage | IControllerStatusMessage | IRequestJobCardsListMessage | ILoginOperatorMessage;
export type IMessage = ICommandMessage | IResponseMessage | IDeprecatedMessage;

// WebSocket messages
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
export interface IPreferencesMessage extends IDataDictionaryMessage<any>
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
	jobCardId?: string;
	alarm?: KeyValue<string, boolean>;
	audit?: KeyValue<string, number>;
	operatorId?: number;
	moldId?: string;
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

@Injectable()
export class MessageService
{
	private seq = 0;

	public get nextSequenceNumber() { return ++this.seq; }

	public create(type: "Alive", priority?: number): IAliveMessage;
	public create(type: "Join", params: { language: Languages; version: string; orgId?: string; password: string; filter?: string; }, priority?: number): IJoinMessage;
	public create(type: "RequestControllersList", priority?: number): IRequestControllersListMessage;
	public create(type: "RequestMoldData", controllerId: number, priority?: number): IRequestMoldDataMessage;
	public create(type: "JobCardsList", params: { controllerId: number; jobCards: IJobCard[]; }, priority?: number): IJobCardsListMessage;
	public create(type: "OperatorInfo", params: { controllerId: number; operatorId: number; name: string; password: string; level: number; }, priority?: number): IOperatorInfoMessage;
	public create(type: string, params?: any, priority?: number): ICommandMessage;
	public create(type: CommandMessageTypes, params?: any, priority?: number): ICommandMessage
	{
		const msg = { $type: type, sequence: this.nextSequenceNumber, priority: priority || 0 } as ICommandMessage;

		switch (msg.$type) {
			case "Alive": {
				msg.priority = (params === undefined || params === null) ? -10 : (params || 0);		// Default value = -10
				break;
			}
			case "Join": {
				msg.language = params.language;
				msg.version = params.version;
				if (params.orgId) msg.orgId = params.orgId;
				msg.password = params.password;
				msg.filter = params.filter;
				break;
			}
			case "RequestControllersList": break;
			case "RequestMoldData": {
				msg.controllerId = params;
				break;
			}
			case "JobCardsList": {
				const list = params.jobCards as IJobCard[];
				msg.controllerId = params.controllerId;
				msg.data = {};
				list.forEach(jc => msg.data[jc.jobCardId] = jc);
				break;
			}
			case "OperatorInfo": {
				msg.controllerId = params.controllerId;
				msg.operatorId = params.operatorId;
				msg.name = params.name;
				msg.password = params.password;
				msg.level = params.level;
				break;
			}
		}

		return msg;
	}
}