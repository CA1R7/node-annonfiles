#!/usr/bin/env node
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var api_calls_1 = require("./utils/api_calls");
var cli_handler_1 = require("./utils/cli_handler");
// Annonfiles API Handler Calls
var APIAnnon = new api_calls_1.AnnonfilesAPIHandler();
// CLI handler
(0, cli_handler_1.CLI_Handler)(process.argv, APIAnnon);
// export it as default
exports.default = APIAnnon;
