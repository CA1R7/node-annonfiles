const path = require("path");
const cli = require("./cli");
const cheerio = require("cheerio");
const { post, get } = require("request");
const { parseDocument } = require("htmlparser2");
const { createReadStream, existsSync } = require("fs");

class Init {
  constructor() {
    this.endpoint = "https://api.anonfiles.com";
    this.endpoint2 = "https://anonfiles.com";
    this.initializeCommands();
  }
  async initializeCommands() {
    const cli_options = await cli();
    const CLICommandsFunctions = ["upload", "download", "get"];
    CLICommandsFunctions.forEach(async (CLICommand) => {
      if (Object.hasOwnProperty.call(cli_options, CLICommand)) {
        switch (CLICommand) {
          case "upload":
            let upload_answer = cli_options.upload;
            let [fileName, token] = upload_answer.match(/@/) ? upload_answer.split(/@/) : [upload_answer, undefined];
            console.log(await this.upload(fileName, { token }));
            break;
          case "download":
          case "get":
            let id = cli_options[CLICommand];
            if (!id) throw new Error("Please, provide A File ID");
            console.log(CLICommand === "download" ? await this.download(id) : await this.getInfo(id));
            break;
        }
      }
    });
  }
  /**
   * @author redoan
   */
  download(fileId) {
    return new Promise((resolve, reject) => {
      console.log("Fetching direct link...");
      get(`${this.endpoint2}/${fileId}`, (err, _res, body) => {
        if (err) reject(String(err));
        const DOM = parseDocument(body);
        const $ = cheerio.load(DOM);
        const tempLink = $("a[id=download-url]").attr("href");
        resolve(tempLink);
      });
    });
  }
  /**
   * @author redoan
   */
  getInfo(fileId) {
    return new Promise((resolve, reject) => {
      console.log("Fetching File Metadata...");
      get(`${this.endpoint}/v2/file/${fileId}/info`, (err, _res, body) => {
        if (err) reject(`An Error Ocuured: ${err.message}`);
        try {
          const { file } = JSON.parse(body).data;
          if (file) {
            resolve(file);
          } else throw new Error("Invalid data");
        } catch (e) {
          reject(e); // catching error of parsing JSON
        }
      });
    });
  }
  upload(fileName, { token }) {
    return new Promise((resolve, reject) => {
      if (!fileName) reject("No filename on upload function");
      let file = path.resolve(process.cwd(), fileName);
      if (existsSync(file)) {
        console.log(`Wait for uploading ${fileName} ${token ? `| Token: ${token}` : ""}`);
        post(
          {
            url: `${this.endpoint}/upload${token ? `?token=${token}` : ""}`,
            formData: {
              file: createReadStream(file),
            },
          },
          function (error, _response, body) {
            if (error) reject(String(error));
            resolve(body);
          },
        );
      } else reject(`invalid file '${file}'`);
    });
  }
}

module.exports = { Init };
