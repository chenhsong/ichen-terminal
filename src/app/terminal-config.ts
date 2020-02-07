import { Dictionary, DictionaryWithDefault } from "./interfaces";

export interface IConfig
{
	url?: string | number;
	orgId?: string;
	password?: string;
	filter?: string;
	settings: {
		TestingMode?: boolean;
		RefreshInterval: number;
		AliveSendInterval: number;
		ServerAliveTimeout: number;
		SyncControllersListInterval: number;
		ServerReconnectionInterval: number;
	};
	canvas?: {
		width?: number;
		height?: number;
		background: string;
	};
	controllers: {
		default: IControllerLinesConfig;
		[id: number]: IControllerDisplayConfig;
	};
	textMaps: string | Dictionary<DictionaryWithDefault<ITextMap>>;
}

export interface IControllerDisplayConfig
{
	x?: number;
	y?: number;
	size?: number;
	width?: number;
}

export interface IControllerLinesConfig extends IHasClassMaps
{
	lines: ILineConfig[];
}

export interface ILineConfig extends ITextConfig, IHasClassMaps, IMinMaxConfig
{
	showAlways?: boolean;
}

export interface IMinMaxConfig
{
	min?: number | string;
	max?: number | string;
	overlay?: string;
}

export interface ITextConfig
{
	field: string;
	filter?: string;
	class?: string;
}

export type ITextMap = Dictionary<string>;

export interface IClassMapBase
{
	field?: string;
	class: string | null;
}

export interface IClassMapValueBase extends IClassMapBase { value: unknown; }

export interface IClassMapNegatedValueBase extends IClassMapBase { notValue: unknown; }

export type IClassMap = IClassMapValueBase | IClassMapNegatedValueBase;

export interface IHasClassMaps { maps?: IClassMap | IClassMap[]; }
