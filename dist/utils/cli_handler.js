"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CLI_Handler = void 0;
var path_1 = require("path");
var CLI_Handler = function (args, _a) {
    var download = _a.download, upload = _a.upload, getInfo = _a.getInfo;
    try {
        var notifyByConsole_1 = function (_a) {
            var status = _a.status, data = _a.data;
            if (!status || !data)
                throw new Error("Invalid Data");
            console.log("* File URL -> " + data.file.url.full);
            console.log("* File ID -> " + data.file.metadata.id);
            console.log("* File Size -> " + data.file.metadata.size.readable);
        };
        var run_command = function (command, started) { return __awaiter(void 0, void 0, void 0, function () {
            var _a, version, file, key, target, ar, PATH, FileUploaded, id, _b, _c, _d, _e;
            return __generator(this, function (_f) {
                switch (_f.label) {
                    case 0:
                        console.log(command);
                        _a = command;
                        switch (_a) {
                            case "-v": return [3 /*break*/, 1];
                            case "--version": return [3 /*break*/, 1];
                            case "-u": return [3 /*break*/, 2];
                            case "--upload": return [3 /*break*/, 2];
                            case "-i": return [3 /*break*/, 5];
                            case "--info": return [3 /*break*/, 5];
                            case "-d": return [3 /*break*/, 5];
                            case "--download": return [3 /*break*/, 5];
                        }
                        return [3 /*break*/, 10];
                    case 1:
                        version = require("../../package.json").version;
                        console.log("v" + version);
                        return [3 /*break*/, 10];
                    case 2:
                        file = null;
                        key = null;
                        target = args[started + 1];
                        if (target.match(/@/)) {
                            ar = target.split(/@/);
                            if (ar) {
                                file = ar[0];
                                key = ar[1];
                            }
                        }
                        else
                            file = target;
                        if (!file) return [3 /*break*/, 4];
                        PATH = (0, path_1.resolve)(process.cwd(), file);
                        return [4 /*yield*/, upload({
                                file: PATH,
                                key: key,
                            })];
                    case 3:
                        FileUploaded = _f.sent();
                        notifyByConsole_1(FileUploaded);
                        _f.label = 4;
                    case 4: return [3 /*break*/, 10];
                    case 5:
                        id = args[started + 1];
                        if (!id) {
                            throw new Error("Id is required");
                        }
                        if (!(command.indexOf("d") !== -1)) return [3 /*break*/, 7];
                        _c = (_b = console).log;
                        _d = "* Direct download URL -> ";
                        return [4 /*yield*/, download(id)];
                    case 6:
                        _c.apply(_b, [_d + (_f.sent())]);
                        return [3 /*break*/, 9];
                    case 7:
                        _e = notifyByConsole_1;
                        return [4 /*yield*/, getInfo(id)];
                    case 8:
                        _e.apply(void 0, [_f.sent()]);
                        _f.label = 9;
                    case 9: return [3 /*break*/, 10];
                    case 10: return [2 /*return*/];
                }
            });
        }); };
        for (var i = 0; i < args.length; i++) {
            var arg = args[i];
            if (arg.match(/^(--?)/)) {
                run_command(arg, i);
            }
        }
    }
    catch (e) {
        console.error(e);
    }
};
exports.CLI_Handler = CLI_Handler;
