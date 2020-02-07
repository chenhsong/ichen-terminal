// Enum types
export type Languages = "EN" | "B5" | "GB" | "FR" | "DE" | "IT" | "ES" | "PT" | "JA" | "Unknown";
export type ControllerTypes = "Ai01" | "Ai02" | "Ai11" | "Ai12" | "CPC60" | "MPC60" | "CDC2000" | "CDC3000" | "CDC2000WIN" | "SPS3300" | "NewAge" | "CBmold300" | "CBmold800" | "Unknown";
export type OpModes = "Manual" | "SemiAutomatic" | "Automatic" | "Others" | "Offline" | "Unknown";
export type JobModes = "ID01" | "ID02" | "ID03" | "ID04" | "ID05" | "ID06" | "ID07" | "ID08" | "ID09" | "ID10" | "ID11" | "ID12" | "ID13" | "ID14" | "ID15" | "Offline";

// Other types
export type PropertiesMap = { [prop: string]: string; };
export interface KeyValue<K, V> { key: K; value: V; }
export interface KeyValueWithTimestamp<K, V> extends KeyValue<K, V> { timestamp: Date }
export interface Dictionary<T> { [key: string]: T; }
export interface DictionaryWithDefault<T> extends Dictionary<T> { default: T; }

// Controller status
export interface IControllerStatus
{
	controllerId: number;
	displayName: string;
	controllerType: ControllerTypes;
	version: string;
	model: string;
	IP: string;
	opMode: OpModes;
	jobMode: JobModes;
	jobCardId: string | null;
	lastCycleData?: Dictionary<number>;
	lastConnectionTime?: string;
	moldId: string | null;
	operatorId: number;
	operatorName: string | null;
}

export interface IControllerState extends IControllerStatus
{
	// Cache of alarm status
	alarms?: Dictionary<boolean>;
	alarm?: KeyValueWithTimestamp<string, boolean> | null;
	activeAlarms?: KeyValueWithTimestamp<string, boolean>[];

	// Current action status
	actionId: number;

	// Timestamps
	lastMessageTime?: Date;
	lastMessageTimeStamp?: Date;
	lastOpModeChangedTime?: Date;
	lastJobModeChangedTime?: Date;
	lastCycleDataTime?: Date;
	lastJobCardChangedTIme?: Date;
	lastOperatorChangedTime?: Date;
	lastMoldChangedTime?: Date;
	lastActionTime?: Date;
}
