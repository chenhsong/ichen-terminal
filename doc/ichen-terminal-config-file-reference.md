% iChen 4.1 Terminal Configuration Reference
% Chen Hsong
% 2016

iChen&reg; 4.1 Terminal Configuration Reference
=================================================

Copyright &copy; Chen Hsong Holdings Ltd.  All rights reserved.  
Document Version: 4.1  
Last Edited: 2018-01-23


Introduction
------------

The **Terminal** is an HTML-based interface for the iChen&reg; System 4.1.
It continuously shows the individual status of all connected machines in an
iChen&reg; network.

The display format of the iChen&reg; 4.1 **Terminal** is configurable via
a configuration file which is constructed in **JSON** format.


## Configuration File Format

### JSON

~~~~~~~ {.json}
{
	"url": "ws://x.x.x.x:port",        // IP address and port for iChen Server
	"filter": "All",                   // Type(s) of messages to receive (optional)
	"settings": { ... },               // System settings
	"canvas": { ... },                 // Custom background image (optional)
	"controllers": { ... },            // Display format of machines
	"textMaps": { ... } | "map.json"   // Text descriptions of ID's and/or codes (optional)
}
~~~~~~~

### Fields

|Field Name         |  JSON type |Optional|       Description          |
|:------------------|:----------:|:------:|:---------------------------|
|`url`              |`string`    |No      |IP address and communications port of the iChen&reg; 4.1 server.<br />Must be in the format "`ws://xxx.xxx.xxx.xxx:port`" (standard WebSocket URL format).<br />The default port used is 5788.|
|`filter`           |`string`    |Yes     |A *comma-delimited* string containing one or more of the `Filters` enum indicating the type(s) of messages that the **Terminal** is interested in receiving. If omitted, `All` is assumed.<br />See the [Enum Reference](code/enums.html#Filters) for details).|
|`settings`         |`Object`    |No      |System settings for the **Terminal**.<br />See [below](#Settings) for details.|
|`canvas`           |`Object`    |Yes     |Custom image to show on the **Terminal** (for instance, a factory floor plan).<br />See [below](#Canvas) for details.|
|`controllers`      |Object Dictionary|No |Display format of each individual machines.<br />See [below](#Controllers) for details.|
|`textMaps`         |Object Dictionary|Yes|Text descriptions of user-defined ID's and/or codes.<br />See [below](#TextMaps) for details.|


## Settings

### JSON

~~~~~~~ {.json}
{
	"AliveSendInterval": 5000,
	"ServerAliveTimeout": 60000,
	"SyncControllersListInterval": 300000,
	"ServerReconnectionInterval": 15000
}
~~~~~~~

### Fields

|Field Name                    |  JSON type |Optional|Default Value|       Description          |
|:-----------------------------|:----------:|:------:|:-----------:|:---------------------------|
|`AliveSendInterval`           |`number`    |Yes     |5000 (5sec)  |Send an [Alive](messages_reference.html#alivemessage) message to the iChen&reg; 4.1 server every this number of milliseconds, or zero to stop sending [Alive](messages_reference.html#alivemessage) messages.<br /><br />*WARNING:* If the iChen&reg; 4.1 server does not receive [Alive](messages_reference.html#alivemessage) messages after a time-out period (default to be 10 seconds), then the server may decide to terminate the connection or stop sending update messages.|
|`ServerAliveTimeout`          |`number`    |Yes     |60000 (1min) |The iChen&reg; 4.1 server sends an [Alive](messages_reference.html#alivemessage) message periodically (default 5 seconds). If [Alive](messages_reference.html#alivemessage) messages are not received after this time-out period (zero to disable), then the server may be assumed dead or hung.|
|`SyncControllersListInterval` |`number`    |Yes     |300000 (5min)|Send a [RequestControllersList](messages_reference.html#requestcontrollerslist) message to the iChen&reg; 4.1 server every this number of milliseconds, or zero to stop sending [RequestControllersList](messages_reference.html#requestcontrollerslist) messages. This is typically used to synchronize the list of connected controllers with the server's own list.|
|`ServerReconnectionInterval`  |`number`    |Yes     |15000 (15sec)|When the conenction to the iChen&reg; 4.1 server is broken, attempt to reconnect after this number of milliseconds.|


## Canvas

### JSON

~~~~~~~ {.json}
{
	"background": "floorplan.png",
	"width": 50,
	"height": 30
}
~~~~~~~

### Fields

|Field Name         |  JSON type |Optional|       Description          |
|:------------------|:----------:|:------:|:---------------------------|
|`background`       |`string`    |No      |Name of an image file to use for the **Terminal**'s background (e.g. a factory floor plan).|
|`width`            |`number`    |Yes     |Width of the image in characters spacing. This is to facilitate exact placement of individual machines on the image. If zero, then the image will completely fill the background.|
|`height`           |`number`    |Yes     |Height of the image in characters spacing. This is to facilitate exact placement of individual machines on the image. If zero, then the image will completely fill the background.|


## Controllers

### JSON

~~~~~~~ {.json}
{
	"default": { ... },   // Display format definitions for all machines

	"12345": { ... },     // Additional display format definitions for machine ID=12345
	"98765": { ... }      // Additional display format definitions for machine ID=98765
}
~~~~~~~

### Fields

|Field Name         |  JSON type |Optional|       Description          |
|:------------------|:----------:|:------:|:---------------------------|
|`default`          |`Object`    |No      |Display format definitions for all machines.<br />See [Machine Display Format](#MachineLayout) for details.|
|Any other key      |`Object`    |Yes     |Specific display format of any individual machine (based on ID number).<br />See [Individual Machine Display Format](#IndividualMachineLayout) for details.|


## Machine Display Format

### JSON

~~~~~~~ {.json}
{
	"maps": [ ... ],             // Value maps for the display box's frame

	"lines":                     // Configurations for each line in the display box
	[
		{
			"field": "variable", // A field out of the machine's state
			"filter": "...",     // A specific filter to apply to the field variable
			"class": "...",      // Formatting option(s)

			"showAlways": true,  // If true, always show this line even when the display box is closed
 
			"maps": [ ... ],     // Value maps

			"min": 0,            // Minimum value if field variable is a numeric range
			"max": 100,          // Maximum value if field variable is a numberic range
			"overlay": "..."     // Formatting option(s) to apply to the overlay bar (mainly to set colors)
		},
				:
				:
	]
}
~~~~~~~

### Fields

|Field Name         |  JSON type |Optional|       Description          |
|:------------------|:----------:|:------:|:---------------------------|
|`maps`             |`Array`     |Yes     |An array of *Value Maps* to control the formatting of the display box.<br />See [Value Map](#ValueMap) for details.|
|`lines`            |`Array`     |No      |An array of *line* configurations, each controlling the formatting of one line to display in the display box.|


### Line Configuration

|Field Name         |  JSON type |Optional|       Description          |
|:------------------|:----------:|:------:|:---------------------------|
|`field`            |`string`    |No      |A field out of the machine's [state](#State) to display as the text on this particular line.|
|`filter`           |`string`    |Yes     |Additional processing filter to apply to the field variable's value before display.<br />See [Display Filters](#DisplayFilters) for details.|
|`class`            |`string`    |Yes     |A *space-delimited* list of display formats for this particular line.<br />See [Display Formats](#Classes) for details.|
|`showAlways`       |`boolean`   |Yes     |When set to `true`, this particular line will always be visible, even when the display box is closed. Default to `false`.|
|`maps`             |`Array`     |Yes     |An array of *Value Maps* to control the formatting of the this particular line.<br />See [Value Map](#ValueMap) for details.|
|`min`, `max`       |`number`    |Yes     |If the field variable is numeric and falls within a range, setting `min` and `max` will display the current value as a bar graph.|
|`overlay`          |`string`    |Yes     |A *space-delimited* list of display formats for the overlay bar of the bar graph (mainly to set colors).<br />See [Display Formats](#Classes) for details.|


## Individual Machine Display Format

### Usage

When a machine's unique ID is present in the [Controllers](#Controllers) section,
it is possible to control precisely the placement/location and size of the
display box of that particular machine.
This is useful for accurately placing machines onto a floor plan background image.

### JSON

~~~~~~~ {.json}
{
	"x": 20,         // X-position
	"y": 30,         // Y-position
	"width": 15,     // Width of display box
	"size": 1.2      // Size multiplier
}
~~~~~~~

### Fields

|Field Name         |  JSON type |Optional|       Description          |
|:------------------|:----------:|:------:|:---------------------------|
|`x`, `y`           |`number`    |Yes     |The X,Y positions of the upper-left corner of the machine's display box, in number of characters.|
|`width`            |`number`    |Yes     |Width of the machine's display box, in number of characters.|
|`size`             |`number`    |Yes     |Magnifier of the display box (including text size, width, etc.). 1.0 = original size.|


## Text Maps

### Usage

*Text maps* are specified as an object dictionary, with property names being the unique
ID of the *text map*, and the values of the properties being object dictionaries specifying
each *text map*.

The property names of each *text map* object dictionary is the name of the user-defined ID codes.
The values of the properties are the texts in place of those codes.

The `textMaps` section may be a text map object dictionary or a text string representing the
name of a JSON file containing a text map object dictionary.

### Example

~~~~~~~ {.json}
{
	// JobModes text map
	"JobModes": {
		"ID01": "Idle",
		"ID02": "Processing",
		"ID03": "Scheduled Maintenance",
		"ID04": "Unscheduled Maintenance",
		"ID05": "Scheduled Down Time",
		"ID06": "Unscheduled Down Time"
	},

	// OperatorNames text map
	"OperatorNames": {
		"123": "Stephen",
		"456": "David",
		"999": "Big Brother",
		"007": "James Bond"
	}
}
~~~~~~~


## Display Filters

### Usage

*Display filters* are used to format values into text.

### Built-in Filters

|Filter Name        |Description                   |Usage                         |
|:------------------|:-----------------------------|------------------------------|
|`uppercase`        |Format as all-upper-case text.|`uppercase`                   |
|`lowercase`        |Format as all-lower-case text.|`lowercase`                   |
|`json`             |Format as **JSON**.           |`json`                        |
|`percent`          |Format a number as percentage.|`percent`                     |
|`date`             |Format a date.                |`date:'`*date format*`'`          |
|`textMap`          |Format user-defined ID codes to different text values specified in the [Text Maps](#TextMaps) section. This is particularly useful for displaying user-defined codes such as `JobModes`.|`textMap:'`*name of map*`'`|
|`flatten`          |Display an array as a text string.|`flatten:'`*field*`'`|


## Value Map

### Usage

A *Value Map* attempts to match the current value of a field variable with the a specified value.
When the current value of the specified field variable matches (or doesn't match, if `notValue` is
used, see below) the specified value, then the formatting options specified in `class` will be applied
to highlight the value (usually by changing colors).

### JSON

~~~~~~~ {.json}
{
	"field": "variable",  // A field out of the machine's state, or the default field of a display line if omitted
	"value": ...,         // Any valid value to match the field variable's current value
	"notValue": ...,      // Any valid value to dis-match the field variable's current value, ignored if value is set
	"class": "..."        // Formatting option(s)
}
~~~~~~~

### Fields

|Field Name         |  JSON type |Optional|       Description          |
|:------------------|:----------:|:------:|:---------------------------|
|`field`            |`string`    |Yes if line-level|A field out of the machine's [states](#States), or the default field of a display line if omitted. If this *value map* is specified on the controller level and not on a display line level, then this field must not be omitted.|
|`class`            |`string`    |No      |A *space-delimited* list of display formats to apply when the current value of the field variable matches the specified `value` (or doesn't match the specified `notValue`).<br />See [Display Formats](#Classes) for details.|
|`value`            |`string`    |Yes     |Any value to match the current value of the field variable specified.<br /><br />*WARNING:* `null` and `undefined` are considered valid values. If `notValue` is used, then this field be *omitted* instead of setting to `null` or `undefined`.|
|`notValue`         |`string`    |Yes     |Any value to dis-match the current value of the field variable specified (i.e. as long as the current value of the field variable specified does *not* match this value).<br /><br />*WARNING:* `null` and `undefined` are considered valid values. If `value` is used, then this field be *omitted* instead of setting to `null` or `undefined`.|


## Machine States

### Description

For each machine, a set of *states* is constantly kept for display, and
continuously updated by the iChen&reg; server.

### Field Variables

|Field Variable Name|  JSON type |Optional|       Description          |
|:------------------|:----------:|:------:|:---------------------------|
|`controllerId`     |`number`    |No      |Unique numeric ID of the machine.|
|`displayName`      |`string`    |No      |Display name of the machine.|
|`model`            |`string`    |No      |Model of the machine.|
|`controllerType`   |`number`    |No      |Model of the machine's computer controller.|
|`version`          |`string`    |No      |Version of the machine's communication protocol.|
|`IP`               |`string`    |No      |IP address and port number of the machine.|
|`opMode`         |`OpModes` enum|No      |Current operation mode (i.e. manual, semi-automatic etc.) of the machine.<br />See the [Enum Reference](code/enums.html#OpModes) for details).|
|`jobMode`       |`JobModes` enum|No      |Current user-defined job mode of the machine.<br />See the [Enum Reference](code/enums.html#JobModes) for details).|
|`jobCardId`        |`string`    |Yes     |Unique ID of the machine's currently-loaded job card, or `null` or omitted if none.|
|`lastCycleData`|Object Dictionary|Yes    |The last set of cycle data sent by the machine. Properties in the object dictionary are variable names, with the property values being the actual values of those variables.<br />See the [Cycle Data Reference](code/cycledata.html) for details).|
|`lastConnectionTime`|`Date`     |Yes     |The time when the machine was connected to the iChen&reg; server.|
|`operatorId`       |`number`    |Yes     |Unique numeric ID of the machine's current operator, or zero or omitted if none.|
|`moldId`           |`string`    |Yes     |Unique ID of the machine's currently-loaded mold data settings, or `null` or omitted if none.|
|`actionId`         |`number`    |Yes     |The last action of the machine, `null` or omitted if unknown.<br />See the [Action Codes Reference](code/actions.html) for details).|
|`alarm`            |`Object`    |Yes     |The last alarm (or rest of an alarm) on the machine, `null` or omitted if none.<br />See [Alarm](#Alarm) for details.|
|`alarms`      |Object Dictionary|Yes     |The current states of alarms on the machine. Properties in the object dictionary are alarm ID's, with the property values being the on/off status of those alarms. `null` or omitted if no alarms are recorded for the machine.|
|`activeAlarms`     |`Array`     |Yes     |An array (if any) of alarms that are currently active on the machine.<br />See [Alarm](#Alarm) for details.|


## Alarm

### Fields

|Field Name         |  JSON type |Optional|       Description          |
|:------------------|:----------:|:------:|:---------------------------|
|`timestamp`        |`Date`      |No      |Time that this alarm is received.|
|`key`              |`string`    |No      |Unique ID of the alarm.|
|`value`            |`number`    |No      |0 = off, 1 = on.|


## Display Formats

### Formats

|Format Name|Description|
|:----------|:----------|
|`color-transparent`|Set background to transparent.|
|`color-black`|Set background to black.|
|`color-blue`|Set background to blue.|
|`color-brown`|Set background to brown.|
|`color-cyan`|Set background to cyan.|
|`color-gray`|Set background to gray.|
|`color-green`|Set background to green.|
|`color-magenta`|Set background to magenta.|
|`color-orange`|Set background to orange.|
|`color-purple`|Set background to purple.|
|`color-red`|Set background to red.|
|`color-white`|Set background to white.|
|`color-yellow`|Set background to yellow.|
|`blink`|Background blinks for attention.|
|`text-invisible`|Make text invisible.|
|`text-black`|Set text to black.|
|`text-blue`|Set text to blue.|
|`text-brown`|Set text to brown.|
|`text-cyan`|Set text to cyan.|
|`text-gray`|Set text to gray.|
|`text-green`|Set text to green.|
|`text-magenta`|Set text to magenta.|
|`text-orange`|Set text to orange.|
|`text-purple`|Set text to purple.|
|`text-red`|Set text to red.|
|`text-white`|Set text to white.|
|`text-yellow`|Set text to yellow.|
|`text-regular`|Regular (i.e. non-bold and non-italics) text|
|`text-bold`|Make text **bold**.|
|`text-italics`|Make text *italics*.|
|`border-invisible`|Show no border.|
|`border-black`|Set border to black.|
|`border-blue`|Set border to blue.|
|`border-brown`|Set border to brown.|
|`border-cyan`|Set border to cyan.|
|`border-gray`|Set border to gray.|
|`border-green`|Set border to green.|
|`border-magenta`|Set border to magenta.|
|`border-orange`|Set border to orange.|
|`border-purple`|Set border to purple.|
|`border-red`|Set border to red.|
|`border-white`|Set border to white.|
|`border-yellow`|Set border to yellow.|
