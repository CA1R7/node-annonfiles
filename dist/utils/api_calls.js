"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AnnonfilesAPIHandler = void 0;
var fs_1 = require("fs");
var htmlparser2_1 = require("htmlparser2");
var request = __importStar(require("request"));
var cheerio_1 = __importDefault(require("cheerio"));
var check = function (target, object) {
    return !(target in object);
};
var AnnonfilesAPIHandler = /** @class */ (function () {
    function AnnonfilesAPIHandler() {
        this.endpoint = "https://api.anonfiles.com";
        this.client = "https://anonfiles.com";
        // bind all function
        this.upload = this.upload.bind(this);
        this.getInfo = this.getInfo.bind(this);
        this.download = this.download.bind(this);
    }
    AnnonfilesAPIHandler.prototype.upload = function (options) {
        var _this = this;
        return new Promise(function (resolve, reject) {
            if (check("file", options) || !options.file) {
                return reject("File property required on options");
            }
            var file = options.file;
            // Query url of keyaccess
            var keyQueryURL = !check("key", options) ? "?token=" + options.key : null;
            if (!(0, fs_1.existsSync)(file)) {
                // check the file if already exists.
                return reject("File not found");
            }
            request.post({
                url: _this.endpoint + "/upload" + (keyQueryURL !== null && keyQueryURL !== void 0 ? keyQueryURL : ""),
                formData: {
                    file: (0, fs_1.createReadStream)(file),
                },
            }, function (error, _response, body) {
                if (error || !body) {
                    return reject(String(error !== null && error !== void 0 ? error : "Failed to request the content"));
                }
                resolve(JSON.parse(body));
            });
        });
    };
    AnnonfilesAPIHandler.prototype.getInfo = function (id) {
        var _this = this;
        return new Promise(function (resolve, reject) {
            request.get(_this.endpoint + "/v2/file/" + id + "/info", function (error, _response, body) {
                if (error || !body) {
                    return reject(String(error !== null && error !== void 0 ? error : "Failed to request the content"));
                }
                try {
                    var DataParsed = JSON.parse(body);
                    if (DataParsed)
                        return resolve(DataParsed);
                    else
                        return reject("Failed to fetch data");
                }
                catch (e) {
                    return reject(String(e));
                }
            });
        });
    };
    AnnonfilesAPIHandler.prototype.download = function (id) {
        var _this = this;
        if (!id)
            throw new Error("Id not found (required)");
        return new Promise(function (resolve, reject) {
            request.get(_this.client + "/" + id, function (error, _response, body) {
                if (error || !body) {
                    return reject(String(error !== null && error !== void 0 ? error : "Failed to request the content"));
                }
                try {
                    var dom_content = (0, htmlparser2_1.parseDocument)(body); // body must be a DOM content.
                    var DOMContentParsed = cheerio_1.default.load(dom_content);
                    var tempLink = DOMContentParsed("#download-url").attr("href"); // get direct "download_url"
                    if (!tempLink)
                        return reject("An error occurred while parsing HTML");
                    else
                        resolve(tempLink);
                }
                catch (e) {
                    return reject(String(e));
                }
            });
        });
    };
    return AnnonfilesAPIHandler;
}());
exports.AnnonfilesAPIHandler = AnnonfilesAPIHandler;
