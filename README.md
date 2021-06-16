# node-annonfiles

Annonfiles unofficial API for uploading and downloading files.

# Installation

Install the package globally for use it anywhere easier

```
npm install -g node-annonfiles
```

# Usage

```js
const { upload, getInfo, download } = require("node-annonfiles");

(async () => {
  try {
    // If you have not keyAcess let it empty
    const uploadFile = await upload("./file.txt", { token: "PUT_KEYACCESS" });
    console.log(uploadFile); // you will get same result on the top
    // functions download,getInfo = (id: string) => result json
  } catch (e) {
    console.log(e);
  }
})();
```

## CLI

### Upload files

```
node-annonfiles --upload file.txt
```

with keyaccess original of Annonfiles website

```
node-annonfiles --upload file.txt@{keyaccess}
```

Output

```json
Wait for uploading file.txt
{
    "status": true,
    "data": {
        "file": {
            "url": {
                "full": "https://anonfiles.com/D9KbB411u2/file_txt",
                "short": "https://anonfiles.com/D9KbB411u2"
            },
            "metadata": {
                "id": "D9KbB411u2",
                "name": "file.txt",
                "size": {
                    "bytes": 5,
                    "readable": "5 B"
                }
            }
        }
    }
}
```

- Make sure store the ID of any output for use it to get the direct download link.

### Download files

You should use ID of the file you already uploaded it, I used `D9KbB411u2` just for an example.

```
node-annonfiles --download D9KbB411u2
```

Output

```
Fetching direct link...
https://cdn-140.anonfiles.com/D9KbB411u2/d0db8fb0-1623874914/file.txt
```

### Get Info Files

Use ID for get the info of files.

```
node-annonfiles --get D9KbB411u2
```

Output

```json
Fetching File Metadata...
{
  "url": {
    "short": "https://anonfiles.com/D9KbB411u2",
    "full": "https://anonfiles.com/D9KbB411u2/file_txt"
  },
  "metadata": {
    "size": { "bytes": 5, "readable": "5 B" },
    "name": "file_txt",
    "id": "D9KbB411u2"
  }
}
```

# License

Copyright (c) 2021 CA1R71 Licensed under the Apcahe 2.0 license.
