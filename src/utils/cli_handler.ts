import { resolve } from "path";
import { AnnonFilesAPIHandler, DownloadOptions, ResponseType, ProtocolsProxies } from "./api_calls";

export const cli_handler = (args: string[], { download, upload, getInfo }: AnnonFilesAPIHandler) => {
  try {
    const notifyByConsole = ({ status, data }: ResponseType) => {
      if (!status || !data) {
        throw new Error("Invalid Data");
      }
      console.log("* File URL -> " + data.file.url.full);
      console.log("* File ID -> " + data.file.metadata.id);
      console.log("* File Size -> " + data.file.metadata.size.readable);
    };
    const run_command = async (command: string, started: number) => {
      switch (command) {
        case "-h":
        case "--help":
          console.log(
            `Use these commands below:\n  -u, --upload  - for uploading files, Also If you want to use key acces do e.g. -u file@keyacceshere\n  -d, --download  - for get direct download link, Also if you want to use proxy do e.g. -d ID@proxyhttphere\n  -i, --info  - for get info about ID`,
          );
          break;
        case "-v":
        case "--version":
          const { version } = require("../../package.json");
          console.log(`v${version}`);
          break;
        case "-u":
        case "--upload":
          const target: string = args[started + 1];

          let file: string | null = null;
          let key: string | null = null;

          if (target.match(/@/)) {
            const targetCommand = target.split(/@/);
            if (targetCommand) {
              file = targetCommand[0]; // file
              key = targetCommand[1]; // key access
            }
          } else {
            file = target;
          }

          if (file) {
            // double check if the file vallid
            const PATH = resolve(process.cwd(), file);
            const file_uploaded = await upload(PATH, {
              key: key,
            });
            notifyByConsole(file_uploaded);
          }
          break;
        case "-i":
        case "--info":
        case "-d":
        case "--download":
          let id = args[started + 1],
            proxy: string | undefined,
            protocol: ProtocolsProxies | null = null;

          if (!id) {
            throw new Error("Id is required");
          }
          // get proxy e.g. XXXXX@00.00.00.00
          if (id.match(/@/)) {
            let [pid, iproxy] = id.split(/@/g);
            id = pid;
            if (iproxy.match(/\:\/\//g)) {
              protocol = iproxy.split(/\:\/\//g)[0] as ProtocolsProxies;
              proxy = iproxy.replace(/(\w+)+\:\/\/|\/(.*)+$/g, "").trim();
            } else {
              proxy = iproxy;
            }
          }

          if (command.indexOf("d") !== -1) {
            console.log(
              `${proxy ? `[${proxy}] ` : ""}* Direct download URL -> ${await download(
                id,
                proxy ? { proxy, protocol } : undefined,
              )}`,
            );
          } else {
            notifyByConsole(await getInfo(id));
          }
          break;
      }
    };
    for (let i = 0; i < args.length; i++) {
      const arg = args[i];
      if (arg.match(/^(--?)/)) {
        run_command(arg, i);
      }
    }
  } catch (e) {
    console.error(e);
  }
};
