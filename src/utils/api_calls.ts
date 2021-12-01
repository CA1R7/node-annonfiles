import { createReadStream, existsSync } from "fs";
import { parseDocument } from "htmlparser2";
import * as request from "request";
import cheerio from "cheerio";

export interface ResponseType {
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

export interface UploadOptions {
  key?: string | null;
}

export type ProtocolsProxies = "http" | "https" | "socks4" | "socks5";

export interface DownloadOptions {
  proxy?: string | null;
  protocol?: ProtocolsProxies | null;
}

const check = <P>(target: keyof P, object: P): boolean => {
  return !(target in object);
};

export class AnnonFilesAPIHandler {
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

  public upload(file: string, options?: UploadOptions): PromiseLike<ResponseType> {
    return new Promise((resolve, reject) => {
      if (!file) {
        return reject("File is not provided");
      }
      // Query url of keyaccess
      const keyQueryURL: string | null =
        options && !check<UploadOptions>("key", options) ? `?token=${options.key}` : null;
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

  public getInfo(id: string): PromiseLike<ResponseType> {
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

  public download(id: string, options?: DownloadOptions): PromiseLike<string> {
    if (!id) throw new Error("Id not found (required)");
    return new Promise((resolve, reject) => {
      // using proxy for passing cloudflare protector.
      let requestEdited =
        options && options.proxy
          ? request.defaults({
              proxy: `${options.protocol ?? "http"}://${options.proxy}`,
            })
          : request;
      requestEdited.get(`${this.client}/${id}`, (error, _response, body) => {
        if (error || !body) {
          return reject(String(error ?? "Failed to request the content"));
        }
        try {
          const dom_content = parseDocument(body); // body must be a DOM content.
          if (!dom_content) {
            // check the content if fine.
            throw new Error("An error occurred load the content");
          }
          const DOMContentParsed = cheerio.load(dom_content as unknown as string);
          const tempLink = DOMContentParsed("#download-url").attr("href"); // get direct "download_url".
          if (!tempLink) {
            throw new Error("An error occurred while parsing HTML or maybe cloudflare rejected the request.");
          } else {
            resolve(tempLink);
          }
        } catch (e) {
          return reject(String(e));
        }
      });
    });
  }
}
