var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
System.register("services/DataStoreService", ["@angular/core", "rxjs/Rx"], function (exports_1, context_1) {
    "use strict";
    var __moduleName = context_1 && context_1.id;
    var core_1, Rx_1, DataStoreService;
    return {
        setters: [
            function (core_1_1) {
                core_1 = core_1_1;
            },
            function (Rx_1_1) {
                Rx_1 = Rx_1_1;
            }
        ],
        execute: function () {
            DataStoreService = (function () {
                function DataStoreService() {
                    this.dataStore = new Map();
                    this.changesSubject = new Rx_1.Subject();
                }
                DataStoreService.prototype.getMap = function () { return this.dataStore; };
                // Mimic Map
                DataStoreService.prototype.has = function (id) { return !!this.dataStore.has(id.toString()); };
                DataStoreService.prototype.get = function (id) { return this.dataStore.get(id.toString()); };
                DataStoreService.prototype.set = function (id, value) {
                    this.dataStore.set(id.toString(), value);
                    if (typeof id !== "string")
                        this.raiseChangeEvent(id);
                };
                DataStoreService.prototype.delete = function (id) {
                    this.dataStore.delete(id.toString());
                    if (typeof id !== "string")
                        this.raiseChangeEvent(id);
                };
                Object.defineProperty(DataStoreService.prototype, "size", {
                    get: function () { return this.dataStore.size; },
                    enumerable: true,
                    configurable: true
                });
                DataStoreService.prototype.keys = function () { return this.dataStore.keys(); };
                DataStoreService.prototype.values = function () { return this.dataStore.values(); };
                Object.defineProperty(DataStoreService.prototype, "onChange", {
                    // Changes detection
                    get: function () { return this.changesSubject; },
                    enumerable: true,
                    configurable: true
                });
                DataStoreService.prototype.raiseChangeEvent = function (id) { this.changesSubject.next(id); };
                DataStoreService = __decorate([
                    core_1.Injectable()
                ], DataStoreService);
                return DataStoreService;
            }());
            exports_1("default", DataStoreService);
        }
    };
});
// Constants
System.register("config", [], function (exports_2, context_2) {
    "use strict";
    var __moduleName = context_2 && context_2.id;
    function getCurrentLang() { return currLang; }
    exports_2("getCurrentLang", getCurrentLang);
    var appClassPrefix, controllerClassPrefix, langKey, Constants, HTML, CSS, currLang, cfg;
    return {
        setters: [],
        execute: function () {// Constants
            appClassPrefix = "terminal";
            controllerClassPrefix = "ctrl";
            langKey = "lang";
            exports_2("Constants", Constants = {
                actionIdField: "actionId",
                actionFilter: "Actions",
                defaultLang: "en"
            });
            exports_2("HTML", HTML = {
                defaultWebSocketPort: 5788,
                password: "password",
                app: "terminal",
                controllersList: appClassPrefix + "-controllers",
                controller: appClassPrefix + "-controller",
                controllerId: "CONTROLLER",
                btnChangeSettings: "btnChangeSettings",
                imgLoading: "imgLoading"
            });
            exports_2("CSS", CSS = {
                imagesUrl: "images",
                imgLoading: "loading.gif",
                serverStatus: appClassPrefix + "-server-status",
                serverStatusOnLine: appClassPrefix + "-server-online",
                serverStatusDenied: appClassPrefix + "-server-denied",
                serverStatusOffLine: appClassPrefix + "-server-offline",
                serverStatusConnecting: appClassPrefix + "-server-connecting",
                serverStatusError: appClassPrefix + "-server-error",
                controller: controllerClassPrefix,
                controllerCollapsed: controllerClassPrefix + "-collapsed",
                controllerFrame: controllerClassPrefix + "-frame",
                controllerItem: controllerClassPrefix + "-item",
                controllerItemSeparator: controllerClassPrefix + "-item-separator",
                controllerMinMaxItem: controllerClassPrefix + "-item-min-max",
                controllerItemMinMaxBar: controllerClassPrefix + "-item-min-max-bar"
            });
            // Read language from local storage
            currLang = Constants.defaultLang;
            if (localStorage) {
                var lang = localStorage.getItem(langKey);
                if (!!lang)
                    currLang = lang;
                console.log("Current language = " + currLang);
            }
            cfg = Config;
            exports_2("Config", cfg);
        }
    };
});
System.register("services/NetworkService", ["@angular/core", "rxjs/Rx", "@angular/websocket", "config"], function (exports_3, context_3) {
    "use strict";
    var __moduleName = context_3 && context_3.id;
    var core_2, Rx_2, websocket_1, config_1, NetworkState, NetworkService;
    return {
        setters: [
            function (core_2_1) {
                core_2 = core_2_1;
            },
            function (Rx_2_1) {
                Rx_2 = Rx_2_1;
            },
            function (websocket_1_1) {
                websocket_1 = websocket_1_1;
            },
            function (config_1_1) {
                config_1 = config_1_1;
            }
        ],
        execute: function () {
            (function (NetworkState) {
                NetworkState[NetworkState["Offline"] = 0] = "Offline";
                NetworkState[NetworkState["Online"] = 1] = "Online";
                NetworkState[NetworkState["Connecting"] = 2] = "Connecting";
                NetworkState[NetworkState["Error"] = 9] = "Error";
            })(NetworkState || (NetworkState = {}));
            exports_3("NetworkState", NetworkState);
            NetworkService = (function () {
                function NetworkService() {
                    this.webSocketInProgress = null;
                    this.isConnectionAlive = false;
                    this.reconnectionInterval = 0;
                    this.lastConnectionAttemptTime = 0;
                    // Observables
                    this.connectionStream = new Rx_2.Subject();
                    this.dataStream = new Rx_2.Subject();
                    // Default reconnection interval = 15s
                    this.reconnectionInterval = config_1.Config.settings.ServerReconnectionInterval || 15000;
                }
                Object.defineProperty(NetworkService.prototype, "isInitialized", {
                    get: function () { return !!this.webSocket; },
                    enumerable: true,
                    configurable: true
                });
                Object.defineProperty(NetworkService.prototype, "isConnected", {
                    get: function () { return this.isConnectionAlive; },
                    enumerable: true,
                    configurable: true
                });
                Object.defineProperty(NetworkService.prototype, "onConnection", {
                    get: function () { return this.connectionStream; },
                    enumerable: true,
                    configurable: true
                });
                Object.defineProperty(NetworkService.prototype, "onData", {
                    get: function () { return this.dataStream; },
                    enumerable: true,
                    configurable: true
                });
                NetworkService.prototype.reconnect = function (url) {
                    var _this = this;
                    if (this.webSocket) {
                        try {
                            this.webSocket.close(true);
                        }
                        catch (ex) {
                            console.error("Error closing WebSocket connection.", ex);
                        }
                        this.isConnectionAlive = false;
                    }
                    // Create a new WebSocket connection
                    var ws = new websocket_1.$WebSocket(url);
                    // Connect the WebSocket
                    this.connectionStream.next(NetworkState.Connecting);
                    ws.connect();
                    // Wire up events
                    ws.onOpen(function () {
                        _this.isConnectionAlive = true;
                        // Prepare the messages stream
                        ws.getDataStream().map(function (m) {
                            // Parse JSON message
                            try {
                                return JSON.parse(m.data);
                            }
                            catch (err) {
                                console.error("Cannot parse JSON message (" + err + "):\n" + m.data);
                                return null;
                            }
                        }).filter(function (m) { return !!m; })
                            .subscribe(function (x) { return _this.dataStream.next(x); });
                        // Reset reconnection interval
                        _this.reconnectionInterval = config_1.Config.settings.ServerReconnectionInterval;
                        _this.lastConnectionAttemptTime = 0;
                        _this.webSocketInProgress = null;
                        _this.webSocket = ws;
                        _this.connectionStream.next(NetworkState.Online);
                    });
                    ws.onError(function (err) {
                        _this.isConnectionAlive = false;
                        if (_this.webSocketInProgress === ws) {
                            _this.lastConnectionAttemptTime = Date.now();
                            _this.webSocketInProgress = null;
                            console.error("Cannot establish WebSocket connection to [" + url + "].", err);
                        }
                        else {
                            console.error("Error in WebSocket communications.", err);
                        }
                        _this.connectionStream.next(NetworkState.Error);
                    });
                    ws.onClose(function () {
                        _this.isConnectionAlive = false;
                        _this.connectionStream.next(NetworkState.Offline);
                    });
                    this.webSocketInProgress = ws;
                };
                NetworkService.prototype.refresh = function () {
                    // Is it attempting to connect?
                    if (this.webSocketInProgress)
                        return;
                    // Check if reconnection is needed
                    var needReconnection = false;
                    if (!this.webSocket) {
                        needReconnection = true;
                    }
                    else {
                        // Check WebSocket state
                        switch (this.webSocket.getReadyState()) {
                            case 0: break; // Opening
                            case 1: break; // Open
                            default:
                                needReconnection = true;
                                break;
                        }
                    }
                    if (needReconnection) {
                        // Only reconnect after an interval
                        if (this.lastConnectionAttemptTime && Date.now() - this.lastConnectionAttemptTime < this.reconnectionInterval)
                            return;
                        // Expand the reconnection interval by 10% each time
                        this.reconnectionInterval *= 1.1;
                        try {
                            if (this.webSocket) {
                                console.log("WebSocket connection is broken! Reconnecting WebSocket...");
                            }
                            else {
                                console.log("Establishing WebSocket connection to [" + config_1.Config.url + "]...");
                            }
                            this.reconnect(config_1.Config.url);
                        }
                        catch (ex) {
                            console.error("Cannot reconnect WebSocket!", ex);
                        }
                    }
                };
                NetworkService.prototype.terminate = function () {
                    if (config_1.Config.settings.TestingMode)
                        return;
                    if (!this.isInitialized)
                        throw "Connection not yet made.";
                    this.webSocket.close(true);
                };
                NetworkService.prototype.sendObject = function (obj) {
                    if (config_1.Config.settings.TestingMode)
                        return;
                    if (!this.isConnectionAlive)
                        return;
                    if (!this.isInitialized)
                        throw "Connection not yet made.";
                    console.log(this.webSocket.getReadyState(), "Sending message", obj);
                    this.webSocket.send(JSON.stringify(obj)).subscribe();
                };
                NetworkService = __decorate([
                    core_2.Injectable(),
                    __metadata("design:paramtypes", [])
                ], NetworkService);
                return NetworkService;
            }());
            exports_3("NetworkService", NetworkService);
        }
    };
});
System.register("services/MessageService", ["@angular/core"], function (exports_4, context_4) {
    "use strict";
    var __moduleName = context_4 && context_4.id;
    var core_3, MessageService;
    return {
        setters: [
            function (core_3_1) {
                core_3 = core_3_1;
            }
        ],
        execute: function () {
            MessageService = (function () {
                function MessageService() {
                    this.seq = 0;
                }
                Object.defineProperty(MessageService.prototype, "nextSequenceNumber", {
                    get: function () { return ++this.seq; },
                    enumerable: true,
                    configurable: true
                });
                MessageService.prototype.create = function (type, params, priority) {
                    var msg = { $type: type, sequence: this.nextSequenceNumber, priority: priority || 0 };
                    switch (msg.$type) {
                        case "Alive": {
                            msg.priority = (params === undefined || params === null) ? -10 : (params || 0); // Default value = -10
                            break;
                        }
                        case "Join": {
                            msg.language = params.language;
                            msg.version = params.version;
                            if (params.orgId)
                                msg.orgId = params.orgId;
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
                            var list = params.jobCards;
                            msg.controllerId = params.controllerId;
                            msg.data = {};
                            list.forEach(function (jc) { return msg.data[jc.jobCardId] = jc; });
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
                };
                MessageService = __decorate([
                    core_3.Injectable()
                ], MessageService);
                return MessageService;
            }());
            exports_4("MessageService", MessageService);
        }
    };
});
System.register("utils/dictionaryToMap", [], function (exports_5, context_5) {
    "use strict";
    var __moduleName = context_5 && context_5.id;
    function default_1(dict) {
        var map = new Map();
        for (var key in dict) {
            if (!dict.hasOwnProperty(key))
                continue;
            map.set(key, dict[key]);
        }
        return map;
    }
    exports_5("default", default_1);
    return {
        setters: [],
        execute: function () {
        }
    };
});
System.register("utils/mixin", [], function (exports_6, context_6) {
    "use strict";
    var __moduleName = context_6 && context_6.id;
    function default_2(src, dest) {
        for (var prop in src) {
            if (!src.hasOwnProperty(prop))
                continue;
            dest[prop] = src[prop];
        }
    }
    exports_6("default", default_2);
    return {
        setters: [],
        execute: function () {
        }
    };
});
System.register("utils/mixinDictionaryToMap", ["utils/mixin"], function (exports_7, context_7) {
    "use strict";
    var __moduleName = context_7 && context_7.id;
    function default_3(dict, map) {
        for (var id in dict) {
            if (!dict.hasOwnProperty(id))
                continue;
            var obj = dict[id];
            if (!map.has(id))
                map.set(id, {});
            // Mixin new status
            mixin_1.default(obj, map.get(id));
        }
    }
    exports_7("default", default_3);
    var mixin_1;
    return {
        setters: [
            function (mixin_1_1) {
                mixin_1 = mixin_1_1;
            }
        ],
        execute: function () {
        }
    };
});
System.register("utils/formatStateVariable", [], function (exports_8, context_8) {
    "use strict";
    var __moduleName = context_8 && context_8.id;
    function default_4(field, mapField) {
        var fullfield = mapField || field;
        if (!fullfield)
            throw new Error("formatStateVariable: One of field or mapField must be non-null.");
        if (fullfield.startsWith("!"))
            return fullfield.substring(1);
        return fullfield = "state." + fullfield;
    }
    exports_8("default", default_4);
    return {
        setters: [],
        execute: function () {
        }
    };
});
System.register("utils/createClassesMap", ["utils/formatStateVariable"], function (exports_9, context_9) {
    "use strict";
    var __moduleName = context_9 && context_9.id;
    // Build a classes map for ngClass
    function default_5(field, maps, fixedClasses) {
        var mapObj = {};
        var mapsList = (maps instanceof Array) ? maps : [maps];
        mapsList.forEach(function (map) {
            if (!map.class)
                return;
            map.class.split(/\s/).forEach(function (cls) {
                // If it is "value", then ===; if it is "notValue", then !==
                var negated = !map.hasOwnProperty("value");
                var value = !negated ? map.value : map.notValue;
                var valuesList = Array.isArray(value) ? value : [value];
                var expressions = valuesList.map(function (val) {
                    if (typeof val === "string")
                        val = JSON.stringify(val);
                    return "" + formatStateVariable_1.default(field, map.field) + (negated ? "!=" : "==") + val;
                });
                if (negated)
                    expressions = ["(" + expressions.join("&&") + ")"];
                if (!(cls in mapObj))
                    mapObj[cls] = [];
                (_a = mapObj[cls]).push.apply(_a, expressions);
                var _a;
            });
        });
        // Add all the standard classes
        if (fixedClasses)
            fixedClasses.filter(function (cls) { return !!cls; }).forEach(function (cls) { return mapObj[cls] = ["true"]; });
        // Merge classes with the same expressions
        var reverseMapObj = {};
        for (var cls in mapObj) {
            var expr = mapObj[cls].join("||");
            reverseMapObj[expr] = reverseMapObj[expr] || [];
            reverseMapObj[expr].push(cls);
        }
        var classes = [];
        for (var expr in reverseMapObj) {
            classes.push("\"" + reverseMapObj[expr].join(" ") + "\":" + expr);
        }
        return classes.join(", ");
    }
    exports_9("default", default_5);
    var formatStateVariable_1;
    return {
        setters: [
            function (formatStateVariable_1_1) {
                formatStateVariable_1 = formatStateVariable_1_1;
            }
        ],
        execute: function () {
        }
    };
});
System.register("utils/utils", ["utils/dictionaryToMap", "utils/mixin", "utils/mixinDictionaryToMap", "utils/formatStateVariable", "utils/createClassesMap"], function (exports_10, context_10) {
    "use strict";
    var __moduleName = context_10 && context_10.id;
    var dictionaryToMap_1, mixin_2, mixinDictionaryToMap_1, formatStateVariable_2, createClassesMap_1;
    return {
        setters: [
            function (dictionaryToMap_1_1) {
                dictionaryToMap_1 = dictionaryToMap_1_1;
            },
            function (mixin_2_1) {
                mixin_2 = mixin_2_1;
            },
            function (mixinDictionaryToMap_1_1) {
                mixinDictionaryToMap_1 = mixinDictionaryToMap_1_1;
            },
            function (formatStateVariable_2_1) {
                formatStateVariable_2 = formatStateVariable_2_1;
            },
            function (createClassesMap_1_1) {
                createClassesMap_1 = createClassesMap_1_1;
            }
        ],
        execute: function () {
            exports_10("dictionaryToMap", dictionaryToMap_1.default);
            exports_10("mixin", mixin_2.default);
            exports_10("mixinDictionaryToMap", mixinDictionaryToMap_1.default);
            exports_10("formatStateVariable", formatStateVariable_2.default);
            exports_10("createClassesMap", createClassesMap_1.default);
        }
    };
});
System.register("app", ["@angular/core", "@angular/http", "rxjs/Rx", "services/DataStoreService", "services/NetworkService", "services/MessageService", "utils/utils", "config"], function (exports_11, context_11) {
    "use strict";
    var __moduleName = context_11 && context_11.id;
    var core_4, http_1, Rx_3, DataStoreService_1, NetworkService_1, MessageService_1, utils_1, config_2, CachedAliveMessage, AppComponent;
    return {
        setters: [
            function (core_4_1) {
                core_4 = core_4_1;
            },
            function (http_1_1) {
                http_1 = http_1_1;
            },
            function (Rx_3_1) {
                Rx_3 = Rx_3_1;
            },
            function (DataStoreService_1_1) {
                DataStoreService_1 = DataStoreService_1_1;
            },
            function (NetworkService_1_1) {
                NetworkService_1 = NetworkService_1_1;
            },
            function (MessageService_1_1) {
                MessageService_1 = MessageService_1_1;
            },
            function (utils_1_1) {
                utils_1 = utils_1_1;
            },
            function (config_2_1) {
                config_2 = config_2_1;
            }
        ],
        execute: function () {
            core_4.enableProdMode();
            AppComponent = (function () {
                function AppComponent(http, network, message, dataStore) {
                    var _this = this;
                    this.network = network;
                    this.message = message;
                    this.dataStore = dataStore;
                    this.isInitialized = false;
                    this.accessLevel = 0;
                    this.lastAliveTime = 0;
                    this.lastServerTickTime = 0;
                    this.lastSyncControllersListTime = Date.now();
                    this.layoutThreshold = 600;
                    this.controllersList = new Rx_3.Subject();
                    this.serverStatus = config_2.CSS.serverStatusOffLine;
                    this.joinHandle = null;
                    if (!config_2.Config.filter)
                        config_2.Config.filter = "Status, Alarms, Audit, Cycle, Actions";
                    CachedAliveMessage = this.message.create("Alive");
                    // Check if actionId is ever referred
                    var usesAction = false;
                    var maps = config_2.Config.controllers.default.maps;
                    if (maps) {
                        maps = Array.isArray(maps) ? maps : [maps];
                        usesAction = maps.some(function (map) { return map.field === config_2.Constants.actionIdField; });
                    }
                    if (!usesAction) {
                        var lines = config_2.Config.controllers.default.lines;
                        if (lines)
                            usesAction = lines.some(function (line) { return line.field === config_2.Constants.actionIdField; });
                        if (!usesAction) {
                            for (var _i = 0, lines_1 = lines; _i < lines_1.length; _i++) {
                                var line = lines_1[_i];
                                var maps_1 = config_2.Config.controllers.default.maps;
                                if (maps_1) {
                                    maps_1 = Array.isArray(maps_1) ? maps_1 : [maps_1];
                                    if (maps_1.some(function (map) { return map.field === config_2.Constants.actionIdField; })) {
                                        usesAction = true;
                                        break;
                                    }
                                }
                            }
                        }
                    }
                    console.log("Uses Actions = " + usesAction);
                    // If no actionId referred, remove Actions from filter
                    if (!usesAction) {
                        config_2.Config.filter = config_2.Config.filter.split(",").map(function (f) { return f.trim(); }).filter(function (f) { return f !== config_2.Constants.actionFilter; }).join(", ");
                    }
                    console.log("Filters = " + config_2.Config.filter);
                    // Load text maps if necessary
                    if (typeof config_2.Config.textMaps === "string") {
                        http.get(config_2.Config.textMaps).map(function (r) { return r.json(); }).subscribe(function (json) {
                            config_2.Config.textMaps = json;
                            console.log("Text maps loaded.", config_2.Config.textMaps);
                        }, console.error.bind(console));
                    }
                    // Monitor network state
                    this.network.onConnection.subscribe(function (state) { return _this.monitorNetwork(state); });
                    // Process messages
                    this.network.onData
                        .do(function (msg) { return console.log(msg); })
                        .subscribe(function (msg) { return _this.processMessage(msg); }, console.error.bind(console));
                    // Start refresh loop - default to every 1s
                    setInterval(function () { return _this.refresh(); }, config_2.Config.settings.RefreshInterval || 1000);
                }
                AppComponent.prototype.onChangeSettings = function () {
                    if (!localStorage)
                        return;
                    // Prompt for new password
                    var pwd = prompt("New password:");
                    if (pwd) {
                        localStorage.setItem(config_2.HTML.password, pwd);
                        location.reload(true);
                    }
                };
                // Refresh loop
                AppComponent.prototype.refresh = function () {
                    // Refresh the network
                    this.network.refresh();
                    var now = Date.now();
                    // Send an ALIVE message once every while
                    if (config_2.Config.settings.AliveSendInterval && (!this.lastAliveTime || now - this.lastAliveTime > config_2.Config.settings.AliveSendInterval)) {
                        this.lastAliveTime = now;
                        CachedAliveMessage.sequence = this.message.nextSequenceNumber;
                        this.network.sendObject(CachedAliveMessage);
                    }
                    // Send a REQ_CNTRLER_LIST message once every while
                    if (config_2.Config.settings.SyncControllersListInterval && (now - this.lastSyncControllersListTime) > config_2.Config.settings.SyncControllersListInterval) {
                        this.lastSyncControllersListTime = now;
                        this.network.sendObject(this.message.create("RequestControllersList"));
                    }
                    // Check if server is alive
                    if (config_2.Config.settings.ServerAliveTimeout && this.lastServerTickTime && now - this.lastServerTickTime > config_2.Config.settings.ServerAliveTimeout) {
                        this.network.terminate();
                        this.lastServerTickTime = 0;
                    }
                };
                // Monitor the state of the WebSocket connection
                AppComponent.prototype.monitorNetwork = function (state) {
                    var _this = this;
                    switch (state) {
                        case NetworkService_1.NetworkState.Online: {
                            console.log("iChen server is on-line.");
                            console.log("Logging on to iChen server...");
                            // Loop send JOIN
                            if (this.joinHandle !== null)
                                clearInterval(this.joinHandle);
                            this.joinHandle = setInterval(function () {
                                _this.network.sendObject(_this.message.create("Join", {
                                    language: "EN",
                                    version: "1.0.0",
                                    orgId: config_2.Config.orgId || null,
                                    password: config_2.Config.password || null,
                                    filter: config_2.Config.filter
                                }));
                            }, 1000);
                            this.serverStatus = config_2.CSS.serverStatusOnLine;
                            break;
                        }
                        case NetworkService_1.NetworkState.Connecting: {
                            this.serverStatus = config_2.CSS.serverStatusConnecting;
                            break;
                        }
                        case NetworkService_1.NetworkState.Error: {
                            this.serverStatus = config_2.CSS.serverStatusError;
                            break;
                        }
                        case NetworkService_1.NetworkState.Offline: {
                            console.warn("Connection to iChen server is dead!");
                            this.serverStatus = config_2.CSS.serverStatusOffLine;
                            break;
                        }
                    }
                };
                // When the list of controllers change, update it
                AppComponent.prototype.updateControllersList = function () {
                    // Create array from cache
                    var arr = Array.from(this.dataStore.values());
                    this.controllersList.next(arr.sort(function (a, b) { return a.displayName === b.displayName ? 0 : a.displayName < b.displayName ? -1 : 1; }));
                    console.log(this.dataStore.size + " controller(s) connected.");
                };
                // Process incoming message
                AppComponent.prototype.processMessage = function (msg) {
                    var now = Date.now();
                    switch (msg.$type) {
                        case "Alive": {
                            this.lastServerTickTime = now;
                            break;
                        }
                        // Response to JOIN
                        case "JoinResponse": {
                            if (this.joinHandle !== null) {
                                clearInterval(this.joinHandle);
                                this.joinHandle = null;
                            }
                            // Check if successful
                            msg.result = msg.result || 0;
                            msg.level = msg.level || 0;
                            if (msg.result < 100) {
                                switch (msg.result) {
                                    case 99:
                                        alert("Each computer IP can only open one Terminal connection to the iChen Server. There is already an active Terminal for this computer, so connection to the iChen Server is denied.");
                                        break;
                                    default:
                                        alert("Connection to the iChen Server is denied. Result code = " + msg.result + ".");
                                        break;
                                }
                                this.serverStatus = config_2.CSS.serverStatusDenied;
                                break;
                            }
                            this.accessLevel = msg.level;
                            console.log("Successfully logged on to iChen server. Access level = " + msg.level + ".");
                            if (msg.message)
                                console.log(msg.message);
                            // Send the REQ_CNTRLER_LIST request
                            this.lastSyncControllersListTime = now;
                            this.network.sendObject(this.message.create("RequestControllersList"));
                            break;
                        }
                        // New controllers List
                        case "ControllersList": {
                            // Update the list of controllers into the cache
                            utils_1.mixinDictionaryToMap(msg.data, this.dataStore.getMap());
                            // Delete any missing controller from the cache
                            for (var id in Array.from(this.dataStore.keys())) {
                                if (!msg.data.hasOwnProperty(id))
                                    this.dataStore.delete(id);
                            }
                            this.updateControllersList();
                            // Now the controllers list is obtained, consider the system initialized
                            this.isInitialized = true;
                            break;
                        }
                        // Update controller status
                        case "ControllerStatus": {
                            if (!this.isInitialized)
                                break;
                            var id = msg.controllerId;
                            // Is there a controller object attached?
                            if (msg.controller) {
                                var ctrl = msg.controller;
                                // Add it into the controllers list if not already there
                                if (!this.dataStore.has(id)) {
                                    var state = {};
                                    this.dataStore.set(id, state);
                                    console.log("Controller " + ctrl.displayName + " [" + id + "] has joined.");
                                }
                                utils_1.mixin(ctrl, this.dataStore.get(id));
                                this.updateControllersList();
                            }
                            // Update status info
                            if (!this.dataStore.has(id)) {
                                console.error("No such controller: [" + id + "]");
                            }
                            else {
                                var ctrl = this.dataStore.get(id);
                                ctrl.lastMessageTime = new Date(now);
                                // Is a controller disconnected?
                                if (msg.isDisconnected) {
                                    ctrl.jobMode = "Offline";
                                    ctrl.opMode = "Offline";
                                    ctrl.operatorId = 0;
                                    ctrl.moldId = null;
                                    ctrl.jobCardId = null;
                                    this.dataStore.raiseChangeEvent(msg.controllerId);
                                    break;
                                }
                                // Skip prior messages arriving out-of-order
                                if (ctrl.lastMessageTimeStamp && msg.timestamp < ctrl.lastMessageTimeStamp)
                                    break;
                                ctrl.lastMessageTimeStamp = msg.timestamp;
                                if (msg.displayName)
                                    ctrl.displayName = msg.displayName;
                                if (msg.opMode) {
                                    ctrl.opMode = msg.opMode;
                                    ctrl.lastOpModeChangedTime = msg.timestamp;
                                }
                                if (msg.jobMode) {
                                    ctrl.jobMode = msg.jobMode;
                                    ctrl.lastJobModeChangedTime = msg.timestamp;
                                }
                                if (msg.jobCardId) {
                                    ctrl.jobCardId = msg.jobCardId || null;
                                    ctrl.lastJobCardChangedTIme = msg.timestamp;
                                }
                                if (msg.operatorId !== undefined) {
                                    ctrl.operatorId = msg.operatorId || 0;
                                    ctrl.lastOperatorChangedTime = msg.timestamp;
                                }
                                if (msg.moldId !== undefined) {
                                    ctrl.moldId = msg.moldId || null;
                                    ctrl.lastMoldChangedTime = msg.timestamp;
                                }
                                if (msg.alarm) {
                                    var alarm_1 = msg.alarm;
                                    // Update alarm cache
                                    if (!ctrl.alarms)
                                        ctrl.alarms = {};
                                    ctrl.alarms[alarm_1.key] = !!alarm_1.value;
                                    // Check the events stack
                                    ctrl.activeAlarms = ctrl.activeAlarms ? ctrl.activeAlarms.slice() : [];
                                    var index = ctrl.activeAlarms.findIndex(function (kv) { return kv.key === alarm_1.key; });
                                    // Delete the original one if present
                                    if (index != undefined)
                                        ctrl.activeAlarms.splice(index, 1);
                                    if (alarm_1.value) {
                                        var alm = { key: alarm_1.key, value: alarm_1.value, timestamp: msg.timestamp };
                                        // Push it onto the stack
                                        if (ctrl.activeAlarms) {
                                            ctrl.activeAlarms.unshift(alm);
                                        }
                                        else {
                                            ctrl.activeAlarms = [alm];
                                        }
                                        // New alarm - show it
                                        ctrl.alarm = alm;
                                    }
                                    else {
                                        // Set the alarm to the latest active one
                                        ctrl.alarm = (ctrl.activeAlarms && ctrl.activeAlarms.length) ? ctrl.activeAlarms[0] : null;
                                    }
                                }
                                this.dataStore.raiseChangeEvent(msg.controllerId);
                            }
                            break;
                        }
                        // Update controller action
                        case "ControllerAction": {
                            if (!this.isInitialized)
                                break;
                            var id = msg.controllerId;
                            if (!this.dataStore.has(id)) {
                                console.error("No such controller: [" + id + "]");
                            }
                            else {
                                var ctrl = this.dataStore.get(id);
                                ctrl.actionId = msg.actionId;
                                ctrl.lastMessageTime = new Date(now);
                                // Skip prior messages arriving out-of-order
                                if (ctrl.lastMessageTimeStamp && msg.timestamp < ctrl.lastMessageTimeStamp)
                                    break;
                                ctrl.lastActionTime = ctrl.lastMessageTimeStamp = msg.timestamp;
                                this.dataStore.raiseChangeEvent(msg.controllerId);
                            }
                            break;
                        }
                        // Cycle data
                        case "CycleData": {
                            if (!this.isInitialized)
                                break;
                            var id = msg.controllerId;
                            if (!this.dataStore.has(id)) {
                                console.error("No such controller: [" + id + "]");
                            }
                            else {
                                var ctrl = this.dataStore.get(id);
                                ctrl.lastCycleData = msg.data;
                                ctrl.lastMessageTime = new Date(now);
                                ctrl.lastCycleDataTime = ctrl.lastMessageTimeStamp = msg.timestamp;
                                this.dataStore.raiseChangeEvent(msg.controllerId);
                            }
                            break;
                        }
                    }
                };
                AppComponent = __decorate([
                    core_4.Component({
                        selector: config_2.HTML.app,
                        template: "\n\t\t<div class=\"" + config_2.CSS.serverStatus + " {{serverStatus}}\"\n\t\t     style=\"width:" + (config_2.Config.canvas && config_2.Config.canvas.width ? config_2.Config.canvas.width + "em" : "100%") + ";\">\n\n\t\t\t<span id=\"" + config_2.HTML.btnChangeSettings + "\" (click)=\"onChangeSettings()\">&bull; &bull; &bull;</span>\n\n\t\t\t<img id=\"" + config_2.HTML.imgLoading + "\"\n\t\t       *ngIf=\"serverStatus=='" + config_2.CSS.serverStatusConnecting + "'\"\n\t\t       src=\"" + config_2.CSS.imagesUrl + "/" + config_2.CSS.imgLoading + "\" />\n\t\t</div>\n\n\t\t<" + config_2.HTML.controllersList + "\n\t\t\t[ngStyle]=\"null|canvasStyles\"\n\t\t\t[controllersList]=\"controllersList\">\n\t\t</" + config_2.HTML.controllersList + ">\n\t"
                    }),
                    __metadata("design:paramtypes", [http_1.Http, NetworkService_1.NetworkService, MessageService_1.MessageService, DataStoreService_1.default])
                ], AppComponent);
                return AppComponent;
            }());
            exports_11("default", AppComponent);
        }
    };
});
System.register("services/canvas-styles.pipe", ["@angular/core", "config"], function (exports_12, context_12) {
    "use strict";
    var __moduleName = context_12 && context_12.id;
    var core_5, config_3, CanvasStylesPipe;
    return {
        setters: [
            function (core_5_1) {
                core_5 = core_5_1;
            },
            function (config_3_1) {
                config_3 = config_3_1;
            }
        ],
        execute: function () {
            CanvasStylesPipe = (function () {
                function CanvasStylesPipe() {
                }
                CanvasStylesPipe.prototype.transform = function (value) {
                    if (!config_3.Config.canvas)
                        return null;
                    if (!config_3.Config.canvas.background)
                        return null;
                    var canvas = config_3.Config.canvas;
                    var r = {
                        background: "url(" + config_3.CSS.imagesUrl + "/" + canvas.background + ") no-repeat",
                        backgroundSize: "100% 100%"
                    };
                    if (canvas.width && canvas.height) {
                        r.width = canvas.width + "em";
                        r.height = canvas.height + "em";
                    }
                    return r;
                };
                CanvasStylesPipe = __decorate([
                    core_5.Pipe({ name: "canvasStyles" })
                ], CanvasStylesPipe);
                return CanvasStylesPipe;
            }());
            exports_12("default", CanvasStylesPipe);
        }
    };
});
System.register("services/controller-frame-styles.pipe", ["@angular/core", "config"], function (exports_13, context_13) {
    "use strict";
    var __moduleName = context_13 && context_13.id;
    var core_6, config_4, ControllerFrameStylesPipe;
    return {
        setters: [
            function (core_6_1) {
                core_6 = core_6_1;
            },
            function (config_4_1) {
                config_4 = config_4_1;
            }
        ],
        execute: function () {
            ControllerFrameStylesPipe = (function () {
                function ControllerFrameStylesPipe() {
                }
                ControllerFrameStylesPipe.prototype.transform = function (state) {
                    if (!state)
                        return null;
                    if (!(state.controllerId in config_4.Config.controllers))
                        return null;
                    var cfg = config_4.Config.controllers[state.controllerId];
                    var map = {};
                    if (cfg.size !== undefined)
                        map["font-size"] = cfg.size * 100 + "%";
                    if (cfg.width !== undefined)
                        map["width"] = cfg.width + "em";
                    return map;
                };
                ControllerFrameStylesPipe = __decorate([
                    core_6.Pipe({ name: "controllerFrameStyles" })
                ], ControllerFrameStylesPipe);
                return ControllerFrameStylesPipe;
            }());
            exports_13("default", ControllerFrameStylesPipe);
        }
    };
});
System.register("services/controller-styles.pipe", ["@angular/core", "config"], function (exports_14, context_14) {
    "use strict";
    var __moduleName = context_14 && context_14.id;
    var core_7, config_5, ControllerStylesPipe;
    return {
        setters: [
            function (core_7_1) {
                core_7 = core_7_1;
            },
            function (config_5_1) {
                config_5 = config_5_1;
            }
        ],
        execute: function () {
            ControllerStylesPipe = (function () {
                function ControllerStylesPipe() {
                }
                ControllerStylesPipe.prototype.transform = function (state) {
                    if (!state)
                        return null;
                    if (!(state.controllerId in config_5.Config.controllers))
                        return null;
                    var cfg = config_5.Config.controllers[state.controllerId];
                    var map = {};
                    if (cfg.x !== undefined && cfg.y !== undefined) {
                        map.position = "absolute";
                        map.margin = "0";
                        map.left = cfg.x + "em";
                        map.top = cfg.y + "em";
                    }
                    return map;
                };
                ControllerStylesPipe = __decorate([
                    core_7.Pipe({ name: "controllerStyles" })
                ], ControllerStylesPipe);
                return ControllerStylesPipe;
            }());
            exports_14("default", ControllerStylesPipe);
        }
    };
});
System.register("services/flatten.pipe", ["@angular/core"], function (exports_15, context_15) {
    "use strict";
    var __moduleName = context_15 && context_15.id;
    var core_8, FlattenPipe;
    return {
        setters: [
            function (core_8_1) {
                core_8 = core_8_1;
            }
        ],
        execute: function () {
            FlattenPipe = (function () {
                function FlattenPipe() {
                }
                FlattenPipe.prototype.transform = function (value, field) {
                    if (value === null || value === undefined)
                        return "";
                    if (!Array.isArray(value))
                        return value.toString();
                    if (!!field) {
                        return value.filter(function (x) { return x !== null && x !== undefined; }).map(function (x) { return (typeof x === "object") ? x[field] : x; }).join(",");
                    }
                    else {
                        return value.filter(function (x) { return x !== null && x !== undefined; }).join(",");
                    }
                };
                FlattenPipe = __decorate([
                    core_8.Pipe({ name: "flatten" })
                ], FlattenPipe);
                return FlattenPipe;
            }());
            exports_15("default", FlattenPipe);
        }
    };
});
System.register("services/text-map.pipe", ["@angular/core", "config"], function (exports_16, context_16) {
    "use strict";
    var __moduleName = context_16 && context_16.id;
    var core_9, config_6, TextMapPipe;
    return {
        setters: [
            function (core_9_1) {
                core_9 = core_9_1;
            },
            function (config_6_1) {
                config_6 = config_6_1;
            }
        ],
        execute: function () {
            TextMapPipe = (function () {
                function TextMapPipe() {
                }
                TextMapPipe.prototype.transform = function (value, id) {
                    value = (value === null || value === undefined) ? "" : value.toString();
                    var maps = config_6.Config.textMaps;
                    if (!maps)
                        return value;
                    if (typeof maps === "string") {
                        return value;
                    }
                    else {
                        var maplang = maps[config_6.getCurrentLang()] || maps[config_6.Constants.defaultLang];
                        var map = maplang[id || "default"];
                        if (!map)
                            return value;
                        if (!map.hasOwnProperty(value))
                            return value;
                        return map[value];
                    }
                };
                TextMapPipe = __decorate([
                    core_9.Pipe({ name: "textMap" })
                ], TextMapPipe);
                return TextMapPipe;
            }());
            exports_16("default", TextMapPipe);
        }
    };
});
System.register("services/decimal.pipe", ["@angular/core"], function (exports_17, context_17) {
    "use strict";
    var __moduleName = context_17 && context_17.id;
    var core_10, DecimalPipe;
    return {
        setters: [
            function (core_10_1) {
                core_10 = core_10_1;
            }
        ],
        execute: function () {
            DecimalPipe = (function () {
                function DecimalPipe() {
                }
                DecimalPipe.prototype.transform = function (value, scale) {
                    if (scale === undefined)
                        return value.toString();
                    value /= Math.pow(10, scale);
                    return value.toString();
                };
                DecimalPipe = __decorate([
                    core_10.Pipe({ name: "decimal" })
                ], DecimalPipe);
                return DecimalPipe;
            }());
            exports_17("default", DecimalPipe);
        }
    };
});
System.register("views/controller-template", ["config", "utils/utils"], function (exports_18, context_18) {
    "use strict";
    var __moduleName = context_18 && context_18.id;
    // Build the template for the main display box
    // Template = <div ctrl-frame><div line></div><div line></div>...</div>
    function buildTemplate(stateProperty, isCollapsedProperty, calcRatioFunc) {
        var classes = null;
        if (config_7.Config.controllers.default.maps) {
            // If the frame has a class map, build the classes
            classes = utils_2.createClassesMap(null, config_7.Config.controllers.default.maps) || null;
        }
        classes = [classes, "\"" + config_7.CSS.controllerCollapsed + "\":" + isCollapsedProperty].join(", ");
        // Generate the tag
        var tpl = "\n\t\t<div (click)='onClick($event)'\n\t\t     class=\"" + config_7.CSS.controllerFrame + "\"\n\t\t     [ngClass]='{" + classes + "}'\n\t\t     [ngStyle]=\"" + stateProperty + "|controllerFrameStyles\">\n\t";
        for (var _i = 0, _a = config_7.Config.controllers.default.lines; _i < _a.length; _i++) {
            var line = _a[_i];
            tpl += buildLineTemplate(stateProperty, isCollapsedProperty, calcRatioFunc, line);
        }
        tpl += "<div class=\"" + config_7.CSS.controllerItem + " " + config_7.CSS.controllerItemSeparator + "\"></div>";
        tpl += "\n\t\t</div>\n\t";
        console.debug(tpl);
        return tpl;
    }
    exports_18("default", buildTemplate);
    // Build the template for one line
    function buildLineTemplate(stateProperty, isCollapsedProperty, calcRatioFunc, line) {
        var field = utils_2.formatStateVariable(line.field);
        // Create a class name from the field expression - replace non-text/digit characters to dashes
        var fieldClass = line.field.replace(/[^A-Za-z0-9\-_]/g, "-").replace("--", "-");
        var id = config_7.HTML.controllerId + "-{{" + stateProperty + ".controllerId}}-" + fieldClass;
        // Template
        var tpl;
        var textlink = field;
        if (line.filter)
            textlink += "|" + line.filter;
        textlink = "{{" + textlink + "}}";
        // Add classes map (if any)
        var extra_classes = [
            config_7.CSS.controllerItem,
            config_7.CSS.controllerItem + "-" + fieldClass,
            line.class
        ].filter(function (cls) { return !!cls; });
        var collapse = line.showAlways ? "" : "*ngIf='!" + isCollapsedProperty + "'";
        if (line.maps && line.maps) {
            // If the line has a class map, construct the ngClass object
            var classes = utils_2.createClassesMap(line.field, line.maps);
            tpl = "<div id=\"" + id + "\" " + collapse + " class=\"" + extra_classes.join(" ") + "\" [ngClass]='{" + classes + "}'>";
        }
        else {
            // Otherwise just simple classes added to the wrapping div
            tpl = "<div id=\"" + id + "\" " + collapse + " class=\"" + extra_classes.join(" ") + "\">";
        }
        // Min-max (if any)
        if (line.max && line.min) {
            var min = (typeof line.min === "string") ? stateProperty + "." + line.min : line.min.toString();
            var max = (typeof line.max === "string") ? stateProperty + "." + line.max : line.max.toString();
            var minmaxbarclasses = [config_7.CSS.controllerItemMinMaxBar, line.overlay].filter(function (cls) { return !!cls; }).join(" ");
            tpl += "<div class=\"" + minmaxbarclasses + "\"\n\t\t\t\t\t\t\t\t *ngIf=\"" + field + "!=null && " + field + "!=undefined\"\n\t\t\t\t\t\t\t\t [ngStyle]=\"{width:" + calcRatioFunc + "(" + field + "," + max + "," + min + ")+'%'}\">\n\t\t\t\t\t\t</div>";
            tpl += "<div class=\"" + config_7.CSS.controllerMinMaxItem + "\">" + textlink + "</div>";
        }
        else {
            // Text info
            tpl += textlink;
        }
        // End template
        tpl += "</div>\n";
        return tpl;
    }
    var config_7, utils_2;
    return {
        setters: [
            function (config_7_1) {
                config_7 = config_7_1;
            },
            function (utils_2_1) {
                utils_2 = utils_2_1;
            }
        ],
        execute: function () {
        }
    };
});
System.register("views/controller", ["@angular/core", "services/DataStoreService", "config", "views/controller-template"], function (exports_19, context_19) {
    "use strict";
    var __moduleName = context_19 && context_19.id;
    var core_11, DataStoreService_2, config_8, controller_template_1, ControllerComponent;
    return {
        setters: [
            function (core_11_1) {
                core_11 = core_11_1;
            },
            function (DataStoreService_2_1) {
                DataStoreService_2 = DataStoreService_2_1;
            },
            function (config_8_1) {
                config_8 = config_8_1;
            },
            function (controller_template_1_1) {
                controller_template_1 = controller_template_1_1;
            }
        ],
        execute: function () {
            ControllerComponent = (function () {
                function ControllerComponent(cd, dataStore) {
                    var _this = this;
                    this.isCollapsed = (window.innerWidth < 600);
                    dataStore.onChange
                        .filter(function (id) { return _this.state && (id <= 0 || _this.state.controllerId === id); })
                        .subscribe(function (id) { return cd.markForCheck(); });
                }
                ControllerComponent.prototype.onClick = function (event) {
                    this.isCollapsed = !this.isCollapsed;
                    event.preventDefault();
                };
                ControllerComponent.prototype.calcRatio = function (value, max, min) {
                    if (max === void 0) { max = 100; }
                    if (min === void 0) { min = 0; }
                    return Math.max(Math.min((value - min) * 100 / (max - min), 100), 0);
                };
                __decorate([
                    core_11.Input(),
                    __metadata("design:type", Object)
                ], ControllerComponent.prototype, "state", void 0);
                ControllerComponent = __decorate([
                    core_11.Component({
                        selector: config_8.HTML.controller,
                        template: controller_template_1.default("state", "isCollapsed", "calcRatio"),
                        changeDetection: core_11.ChangeDetectionStrategy.OnPush
                    }),
                    __metadata("design:paramtypes", [core_11.ChangeDetectorRef, DataStoreService_2.default])
                ], ControllerComponent);
                return ControllerComponent;
            }());
            exports_19("default", ControllerComponent);
        }
    };
});
System.register("views/controllers", ["@angular/core", "rxjs/Rx", "config"], function (exports_20, context_20) {
    "use strict";
    var __moduleName = context_20 && context_20.id;
    var core_12, Rx_4, config_9, ControllersListComponent;
    return {
        setters: [
            function (core_12_1) {
                core_12 = core_12_1;
            },
            function (Rx_4_1) {
                Rx_4 = Rx_4_1;
            },
            function (config_9_1) {
                config_9 = config_9_1;
            }
        ],
        execute: function () {
            ControllersListComponent = (function () {
                function ControllersListComponent() {
                }
                // Do not regenerate list excessively
                ControllersListComponent.prototype.trackByController = function (index, ctrl) { return ctrl.controllerId; };
                __decorate([
                    core_12.Input(),
                    __metadata("design:type", Rx_4.Observable)
                ], ControllersListComponent.prototype, "controllersList", void 0);
                ControllersListComponent = __decorate([
                    core_12.Component({
                        selector: config_9.HTML.controllersList,
                        template: "\n\t\t<" + config_9.HTML.controller + " *ngFor=\"let ctrl of controllersList|async; trackBy:trackByController\"\n\t\t\tid=\"" + config_9.HTML.controllerId + "-{{ctrl.controllerId}}\"\n\t\t\tclass=\"" + config_9.CSS.controller + "\"\n\t\t\t[ngStyle]=\"ctrl|controllerStyles\"\n\t\t\t[state]=\"ctrl\">\n\t\t</" + config_9.HTML.controller + ">\n\t",
                        changeDetection: core_12.ChangeDetectionStrategy.OnPush
                    })
                ], ControllersListComponent);
                return ControllersListComponent;
            }());
            exports_20("default", ControllersListComponent);
        }
    };
});
System.register("module", ["@angular/core", "@angular/platform-browser", "@angular/http", "services/DataStoreService", "services/NetworkService", "services/MessageService", "services/canvas-styles.pipe", "services/controller-frame-styles.pipe", "services/controller-styles.pipe", "services/flatten.pipe", "services/text-map.pipe", "services/decimal.pipe", "app", "views/controller", "views/controllers"], function (exports_21, context_21) {
    "use strict";
    var __moduleName = context_21 && context_21.id;
    var core_13, platform_browser_1, http_2, DataStoreService_3, NetworkService_2, MessageService_2, canvas_styles_pipe_1, controller_frame_styles_pipe_1, controller_styles_pipe_1, flatten_pipe_1, text_map_pipe_1, decimal_pipe_1, app_1, controller_1, controllers_1, AppModule;
    return {
        setters: [
            function (core_13_1) {
                core_13 = core_13_1;
            },
            function (platform_browser_1_1) {
                platform_browser_1 = platform_browser_1_1;
            },
            function (http_2_1) {
                http_2 = http_2_1;
            },
            function (DataStoreService_3_1) {
                DataStoreService_3 = DataStoreService_3_1;
            },
            function (NetworkService_2_1) {
                NetworkService_2 = NetworkService_2_1;
            },
            function (MessageService_2_1) {
                MessageService_2 = MessageService_2_1;
            },
            function (canvas_styles_pipe_1_1) {
                canvas_styles_pipe_1 = canvas_styles_pipe_1_1;
            },
            function (controller_frame_styles_pipe_1_1) {
                controller_frame_styles_pipe_1 = controller_frame_styles_pipe_1_1;
            },
            function (controller_styles_pipe_1_1) {
                controller_styles_pipe_1 = controller_styles_pipe_1_1;
            },
            function (flatten_pipe_1_1) {
                flatten_pipe_1 = flatten_pipe_1_1;
            },
            function (text_map_pipe_1_1) {
                text_map_pipe_1 = text_map_pipe_1_1;
            },
            function (decimal_pipe_1_1) {
                decimal_pipe_1 = decimal_pipe_1_1;
            },
            function (app_1_1) {
                app_1 = app_1_1;
            },
            function (controller_1_1) {
                controller_1 = controller_1_1;
            },
            function (controllers_1_1) {
                controllers_1 = controllers_1_1;
            }
        ],
        execute: function () {
            AppModule = (function () {
                function AppModule() {
                }
                AppModule = __decorate([
                    core_13.NgModule({
                        imports: [platform_browser_1.BrowserModule, http_2.HttpModule],
                        declarations: [
                            // Components
                            app_1.default,
                            controller_1.default,
                            controllers_1.default,
                            // Pipes
                            canvas_styles_pipe_1.default,
                            controller_frame_styles_pipe_1.default,
                            controller_styles_pipe_1.default,
                            flatten_pipe_1.default,
                            text_map_pipe_1.default,
                            decimal_pipe_1.default
                        ],
                        providers: [
                            DataStoreService_3.default,
                            NetworkService_2.NetworkService,
                            MessageService_2.MessageService
                        ],
                        bootstrap: [app_1.default]
                    })
                ], AppModule);
                return AppModule;
            }());
            exports_21("default", AppModule);
        }
    };
});
System.register("main", ["@angular/platform-browser-dynamic", "module", "config"], function (exports_22, context_22) {
    "use strict";
    var __moduleName = context_22 && context_22.id;
    var platform_browser_dynamic_1, module_1, config_10;
    return {
        setters: [
            function (platform_browser_dynamic_1_1) {
                platform_browser_dynamic_1 = platform_browser_dynamic_1_1;
            },
            function (module_1_1) {
                module_1 = module_1_1;
            },
            function (config_10_1) {
                config_10 = config_10_1;
            }
        ],
        execute: function () {
            // Get WebSocket URL
            if (!config_10.Config.url) {
                // Default to same host at default port
                config_10.Config.url = "ws://" + location.hostname + ":" + config_10.HTML.defaultWebSocketPort;
            }
            else if (typeof config_10.Config.url === "number") {
                config_10.Config.url = "ws://" + location.hostname + ":" + config_10.Config.url;
            }
            // Bootstrap the main app component
            if (config_10.Config.url && config_10.Config.password) {
                platform_browser_dynamic_1.platformBrowserDynamic().bootstrapModule(module_1.default);
            }
            else {
                document.body.textContent = "AN ERROR HAS OCCURRED.";
            }
        }
    };
});
//# sourceMappingURL=script.js.map