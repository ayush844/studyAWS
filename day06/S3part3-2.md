

## 🧹 What is `DeleteObjectCommand`?

`DeleteObjectCommand` is used to **delete a specific file (object)** from an S3 bucket.

> ✅ It **permanently removes the file** from the specified bucket and key.

---

## 🔐 Permissions Required

To use it, the IAM role or user must have the `s3:DeleteObject` permission for the bucket.

---

## 🔧 Updated Full Example Code with `DeleteObjectCommand`

```js
require('dotenv').config();

const {
    S3Client,
    GetObjectCommand,
    PutObjectCommand,
    ListObjectsV2Command,
    DeleteObjectCommand
} = require("@aws-sdk/client-s3");

const { getSignedUrl } = require('@aws-sdk/s3-request-presigner');

const s3Client = new S3Client({
    region: 'ap-south-1',
    credentials: {
        accessKeyId: process.env.ACCESS_KEY_ID,
        secretAccessKey: process.env.SECRET__ACCESS_KEY
    }
});

// Generate a pre-signed URL for GET
async function getObjectUrl(key) {
    const command = new GetObjectCommand({
        Bucket: 'ayush-prvt-bkt',
        Key: key
    });

    const url = await getSignedUrl(s3Client, command);
    return url;
}

// Generate a pre-signed URL for PUT
async function putObject(filename, contentType) {
    const command = new PutObjectCommand({
        Bucket: 'ayush-prvt-bkt',
        Key: `uploads/user-uploads/${filename}`,
        ContentType: contentType
    });

    const url = await getSignedUrl(s3Client, command, { expiresIn: 3600 }); // 1 hour
    return url;
}

// List files in a given prefix (folder)
async function listObjects(prefix) {
    const command = new ListObjectsV2Command({
        Bucket: 'ayush-prvt-bkt',
        Prefix: prefix
    });

    const response = await s3Client.send(command);
    const files = response.Contents?.map(obj => obj.Key) || [];
    return files;
}

// Delete a file (object) from the bucket
async function deleteObject(key) {
    const command = new DeleteObjectCommand({
        Bucket: 'ayush-prvt-bkt',
        Key: key
    });

    const response = await s3Client.send(command);
    console.log(`Deleted object: ${key}`);
    return response;
}

// Test all operations
async function init() {
    const filename = `myimage-${Date.now()}.png`;

    // Generate PUT URL
    const putUrl = await putObject(filename, 'image/png');
    console.log("PUT URL:", putUrl);

    // List all files
    const uploadedFiles = await listObjects('uploads/user-uploads/');
    console.log("Files in folder:", uploadedFiles);

    // Generate GET URL for first file
    if (uploadedFiles.length > 0) {
        const getUrl = await getObjectUrl(uploadedFiles[0]);
        console.log("GET URL for first file:", getUrl);
    }

    // Delete the first file (for demonstration)
    if (uploadedFiles.length > 0) {
        await deleteObject(uploadedFiles[0]);
    }
}

init();
```

---

## 📌 Summary of All Operations

| Function                    | Purpose                                           |
| --------------------------- | ------------------------------------------------- |
| `getObjectUrl(key)`         | Generates a pre-signed URL to **download** a file |
| `putObject(filename, type)` | Generates a pre-signed URL to **upload** a file   |
| `listObjects(prefix)`       | Lists all files under a "folder" (prefix)         |
| `deleteObject(key)`         | Deletes a specific file from the bucket           |

---

## 🛡️ Reminder: IAM Policy Required

Your IAM user or role should have permissions like:

```json
{
  "Effect": "Allow",
  "Action": [
    "s3:GetObject",
    "s3:PutObject",
    "s3:ListBucket",
    "s3:DeleteObject"
  ],
  "Resource": [
    "arn:aws:s3:::ayush-prvt-bkt",
    "arn:aws:s3:::ayush-prvt-bkt/*"
  ]
}
```

---

Let me know if you’d like to:

* Delete multiple files at once
* Confirm before deletion
* Add logging for operations
