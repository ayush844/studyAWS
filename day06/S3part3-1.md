

## 📄 What is `ListObjectsV2Command`?

`ListObjectsV2Command` is an AWS S3 operation used to **list the objects (files) in a specific bucket and optionally inside a folder (prefix)**.

> ✅ It **returns metadata** about objects like keys (names), size, last modified date, etc.

You **do NOT generate a pre-signed URL** for this — it is a regular S3 API call, **not a file access operation**.

---

## 🔍 Use Case

You use `ListObjectsV2Command` when you want to:

* See all files inside a folder like `uploads/user-uploads/`
* Show file lists to users (e.g., in a dashboard)
* Build file explorers or galleries

---

## 🧑‍💻 Example Updated Code

Here’s your updated code including `ListObjectsV2Command`:

```js
require('dotenv').config();

const { 
    S3Client, 
    GetObjectCommand, 
    PutObjectCommand, 
    ListObjectsV2Command 
} = require("@aws-sdk/client-s3");

const { getSignedUrl } = require('@aws-sdk/s3-request-presigner');

const s3Client = new S3Client({
    region: 'ap-south-1',
    credentials: {
        accessKeyId: process.env.ACCESS_KEY_ID,
        secretAccessKey: process.env.SECRET__ACCESS_KEY
    }
});

// Generate a GET pre-signed URL
async function getObjectUrl(key) {
    const command = new GetObjectCommand({
        Bucket: 'ayush-prvt-bkt',
        Key: key
    });

    const url = await getSignedUrl(s3Client, command);
    return url;
}

// Generate a PUT pre-signed URL
async function putObject(filename, contentType) {
    const command = new PutObjectCommand({
        Bucket: 'ayush-prvt-bkt',
        Key: `uploads/user-uploads/${filename}`,
        ContentType: contentType
    });

    const url = await getSignedUrl(s3Client, command, { expiresIn: 3600 }); // 1 hour
    return url;
}

// List objects in a prefix/folder
async function listObjects(prefix) {
    const command = new ListObjectsV2Command({
        Bucket: 'ayush-prvt-bkt',
        Prefix: prefix // like "uploads/user-uploads/"
    });

    const response = await s3Client.send(command);

    // Print object keys (filenames)
    const files = response.Contents?.map(obj => obj.Key) || [];
    return files;
}

// Test the functions
async function init() {
    const filename = `myimage-${Date.now()}.png`;

    console.log("PUT URL:", await putObject(filename, 'image/png'));

    const uploadedFiles = await listObjects('uploads/user-uploads/');
    console.log("Files in uploads/user-uploads/ folder:");
    console.log(uploadedFiles);

    // Optional: get a GET URL for one of the uploaded files
    if (uploadedFiles.length > 0) {
        console.log("GET URL for first file:", await getObjectUrl(uploadedFiles[0]));
    }
}

init();
```

---

## 📦 Example Output

```bash
PUT URL: https://ayush-prvt-bkt.s3.ap-south-1.amazonaws.com/uploads/user-uploads/myimage-1750820456178.png?...
Files in uploads/user-uploads/ folder:
[
  'uploads/user-uploads/myimage-1750819242059.png',
  'uploads/user-uploads/myimage-1750820456178.png'
]
GET URL for first file: https://ayush-prvt-bkt.s3.ap-south-1.amazonaws.com/uploads/user-uploads/myimage-1750819242059.png?...
```

---

## 📝 Notes

* `Prefix` acts like a **folder filter**. If you don’t pass it, it lists everything in the bucket.
* `ListObjectsV2` returns **max 1000 files** by default. You can paginate using `ContinuationToken`.
* You don’t need pre-signed URLs for listing — your backend IAM role/user must have `s3:ListBucket` permission.

---

Let me know if you'd like to:

* Filter by file type (e.g., only `.png`)
* Show file sizes or timestamps
* Paginate long file lists
