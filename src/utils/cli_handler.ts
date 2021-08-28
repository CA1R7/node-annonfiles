import { resolve } from "path";
import { AnnonfilesAPIHandler, AnnonResponseType } from "./api_calls";

export const CLI_Handler = (args: string[], { download, upload, getInfo }: AnnonfilesAPIHandler) => {
  try {
    const notifyByConsole = ({ status, data }: AnnonResponseType) => {
      if (!status || !data) throw new Error("Invalid Data");
      console.log("* File URL -> " + data.file.url.full);
      console.log("* File ID -> " + data.file.metadata.id);
      console.log("* File Size -> " + data.file.metadata.size.readable);
    };
    const run_command = async (command: string, started: number) => {
      switch (command) {
        case "-v":
        case "--version":
          const { version } = require("../../package.json");
          console.log(`v${version}`);
          break;
        case "-u":
        case "--upload":
          let file: string | null = null;
          let key: string | null = null;
          const target: string = args[started + 1];
          if (target.match(/@/)) {
            const ar = target.split(/@/);
            if (ar) {
              file = ar[0];
              key = ar[1];
            }
          } else file = target;

          if (file) {
            // double check if file vallid
            const PATH = resolve(process.cwd(), file); // path
            const FileUploaded = await upload({
              file: PATH,
              key: key,
            });
            notifyByConsole(FileUploaded);
          }
          break;
        case "-i":
        case "--info":
        case "-d":
        case "--download":
          const id = args[started + 1];
          if (!id) {
            throw new Error("Id is required");
          }
          if (command.indexOf("d") !== -1) {
            console.log("* Direct download URL -> " + (await download(id)));
          } else notifyByConsole(await getInfo(id));
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
