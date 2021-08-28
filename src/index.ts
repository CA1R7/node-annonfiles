#!/usr/bin/env node
import { AnnonfilesAPIHandler } from "./utils/api_calls";
import { CLI_Handler } from "./utils/cli_handler";

// Annonfiles API Handler Calls
const APIAnnon = new AnnonfilesAPIHandler();

// CLI handler
CLI_Handler(process.argv, APIAnnon);

// export it as default
export default APIAnnon;