import { createReadStream, existsSync } from "fs";
import { parseDocument } from "htmlparser2";
import * as request from "request";
import cheerio from "cheerio";

export interface AnnonResponseType {
  status: boolean;
  data?: {
    file: {
      url: {
        full: string;
        short: string;
      };
      metadata: {
        id: string;
        name: string;
        size: {
          bytes: number;
          readable: string;
        };
      };
    };
  };
}

export interface OptionsAnnonFiles {
  file: string;
  key: string | null;
}

const check = <P>(target: string, object: P): boolean => {
  return !(target in object);
};

export class AnnonfilesAPIHandler {
  public endpoint: string;
  public client: string;
  constructor() {
    this.endpoint = "https://api.anonfiles.com";
    this.client = "https://anonfiles.com";
    // bind all function
    this.upload = this.upload.bind(this);
    this.getInfo = this.getInfo.bind(this);
    this.download = this.download.bind(this);
  }

  public upload(options: OptionsAnnonFiles): PromiseLike<AnnonResponseType> {
    return new Promise((resolve, reject) => {
      if (check<OptionsAnnonFiles>("file", options) || !options.file) {
        return reject("File property required on options");
      }
      const file: string = options.file;
      // Query url of keyaccess
      const keyQueryURL: string | null = !check<OptionsAnnonFiles>("key", options) ? `?token=${options.key}` : null;
      if (!existsSync(file)) {
        // check the file if already exists.
        return reject("File not found");
      }
      request.post(
        {
          url: `${this.endpoint}/upload${keyQueryURL ?? ""}`,
          formData: {
            file: createReadStream(file),
          },
        },
        (error, _response, body) => {
          if (error || !body) {
            return reject(String(error ?? "Failed to request the content"));
          }
          resolve(JSON.parse(body));
        },
      );
    });
  }

  public getInfo(id: string): PromiseLike<AnnonResponseType> {
    return new Promise((resolve, reject) => {
      request.get(`${this.endpoint}/v2/file/${id}/info`, (error, _response, body) => {
        if (error || !body) {
          return reject(String(error ?? "Failed to request the content"));
        }
        try {
          const DataParsed = JSON.parse(body);
          if (DataParsed) return resolve(DataParsed);
          else return reject("Failed to fetch data");
        } catch (e) {
          return reject(String(e));
        }
      });
    });
  }

  public download(id: string): PromiseLike<string> {
    if (!id) throw new Error("Id not found (required)");
    return new Promise((resolve, reject) => {
      request.get(`${this.client}/${id}`, (error, _response, body) => {
        if (error || !body) {
          return reject(String(error ?? "Failed to request the content"));
        }
        try {
          const dom_content = parseDocument(body); // body must be a DOM content.
          const DOMContentParsed = cheerio.load(dom_content);
          const tempLink = DOMContentParsed("#download-url").attr("href"); // get direct "download_url"
          if (!tempLink) return reject("An error occurred while parsing HTML");
          else resolve(tempLink);
        } catch (e) {
          return reject(String(e));
        }
      });
    });
  }
}
