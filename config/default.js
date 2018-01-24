var Config = {
	"urlXXX": "ws://112.120.195.62:5788",
	"filter": "Status, Alarms, Audit, Cycle, Actions",
	"settings": {
		"TestingMode": false,
		"RefreshInterval": 1000,
		"AliveSendInterval": 5000,
		"ServerAliveTimeout": 60000,
		"SyncControllersListInterval": 60000,
		"ServerReconnectionInterval": 5000
	},
	"controllers": {
		"default": {
			"maps": [
				{
					"value": "Unknown",
					"class": "border-red color-black",
					"field": "opMode"
				},
				{
					"value": null,
					"class": "border-red color-black",
					"field": "opMode"
				},
				{
					"value": "Manual",
					"class": "color-red",
					"field": "opMode"
				},
				{
					"value": "SemiAutomatic",
					"class": "color-yellow",
					"field": "opMode"
				},
				{
					"value": "Automatic",
					"class": "color-green",
					"field": "opMode"
				},
				{
					"value": "Others",
					"class": "color-white",
					"field": "opMode"
				},
				{
					"value": "Offline",
					"class": "border-gray color-gray",
					"field": "opMode"
				}
			],
			"lines": [
				{
					"field": "displayName",
					"showAlways": true,
					"class": "color-blue text-white text-bold",
					"maps": null
				},
				{
					"field": "model",
					"class": "text-italics",
					"maps": null
				},
				{
					"field": "actionId",
					"filter": "textMap:'Actions'",
					"showAlways": true,
					"maps": null
				},
				{
					"field": "operatorId",
					"maps": [
						{
							"value": 0,
							"class": "color-gray text-invisible"
						},
						{
							"value": null,
							"class": "color-gray text-invisible"
						}
					]
				},
				{
					"field": "jobMode",
					"filter": "textMap:'JobModes'",
					"maps": [
						{
							"value": "ID01",
							"class": "color-purple"
						},
						{
							"value": "Unknown",
							"class": "color-black"
						},
						{
							"value": null,
							"class": "color-black"
						},
						{
							"value": "Offline",
							"class": "color-gray"
						}
					]
				},
				{
					"field": "alarms?.AL099",
					"class": "text-bold",
					"maps": [
						{
							"value": true,
							"class": "color-red text-white"
						},
						{
							"value": false,
							"class": "text-invisible"
						}
					]
				},
				{
					"field": "lastCycleData?.Z_QDGODCNT",
					"showAlways": true,
					"min": 1000,
					"max": 8000,
					"overlay": "color-purple",
					"maps": null
				},
				{
					"field": "alarm?.key",
					"maps": [
						{
							"notValue": null,
							"class": "color-red text-bold blink"
						}
					]
				},
				{
					"field": "activeAlarms",
					"filter": "flatten:'key'",
					"maps": null
				}
			]
		}
	},
	"textMaps": "text-maps.json"
}