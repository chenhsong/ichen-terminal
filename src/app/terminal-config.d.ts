// Configuration object

declare namespace Terminal
{
	interface IConfig
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

	interface IControllerDisplayConfig
	{
		x?: number;
		y?: number;
		size?: number;
		width?: number;
	}

	interface IControllerLinesConfig extends IHasClassMaps
	{
		lines: ILineConfig[];
	}

	interface ILineConfig extends ITextConfig, IHasClassMaps, IMinMaxConfig
	{
		showAlways?: boolean;
	}

	interface IMinMaxConfig
	{
		min?: number | string;
		max?: number | string;
		overlay?: string;
	}

	interface ITextConfig
	{
		field: string;
		filter?: string;
		class?: string;
	}

	type ITextMap = Dictionary<string>;

	interface IClassMapBase
	{
		field?: string;
		class: string | null;
	}

	interface IClassMapValueBase extends IClassMapBase { value: any; }

	interface IClassMapNegatedValueBase extends IClassMapBase { notValue: any; }

	type IClassMap = IClassMapValueBase | IClassMapNegatedValueBase;

	interface IHasClassMaps { maps?: IClassMap | IClassMap[]; }
}