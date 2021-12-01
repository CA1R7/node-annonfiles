#!/usr/bin/env node
import { AnnonFilesAPIHandler } from "./utils/api_calls";
import { cli_handler } from "./utils/cli_handler";

// Annonfiles API Handler Calls
const annonfiles = new AnnonFilesAPIHandler();

// CLI handler
cli_handler(process.argv, annonfiles);

// upload function (File)
export const upload = annonfiles.upload;
// download function (ID, options)
export const download = annonfiles.download;
// info function (ID)
export const getInfo = annonfiles.getInfo;
