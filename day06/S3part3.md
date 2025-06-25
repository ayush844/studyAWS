

# 🧠 What is a PUT Pre-Signed URL?

A **pre-signed URL for PUT** lets someone **upload** a file to a specific location in your S3 bucket **without needing AWS credentials**, but only for a limited time and under certain conditions.

> ✅ It gives **temporary permission** to upload a file to a specific key in a private bucket.

---

## ✅ When to Use It?

* You have a **private S3 bucket**.
* A user (e.g., from a frontend app) wants to **upload a file**.
* You want to avoid routing the file through your backend for performance reasons.
* You don’t want to expose your AWS credentials.

---

## ⚙️ How it Works

1. Your **backend** generates a **pre-signed PUT URL** for a specific file key (e.g., `uploads/image.jpg`).
2. This URL includes:

   * The target S3 bucket
   * Object key (file path)
   * Expiry time
   * A signature proving permission
3. Your **frontend** or client uses this URL to upload a file using **HTTP PUT**.

---

## 🧑‍💻 Code Example (Node.js with AWS SDK v3)

```js
import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";

const s3Client = new S3Client({
  region: "ap-south-1",
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY,
    secretAccessKey: process.env.AWS_SECRET_KEY
  }
});

async function generatePresignedPutUrl(bucketName, key) {
  const command = new PutObjectCommand({
    Bucket: bucketName,
    Key: key,
    ContentType: "image/png" // optional but recommended
  });

  const url = await getSignedUrl(s3Client, command, { expiresIn: 300 }); // valid for 5 minutes
  return url;
}

// Usage
generatePresignedPutUrl("ayush-prvt-bkt", "uploads/myimage.png").then(console.log);
```

---

## 🚀 Uploading Using the URL (Frontend Example)

Once the frontend gets the URL, it uploads like this:

```js
const file = document.querySelector("input[type='file']").files[0];

fetch(PRESIGNED_PUT_URL, {
  method: "PUT",
  headers: {
    "Content-Type": file.type
  },
  body: file
}).then(response => {
  if (response.ok) {
    console.log("Upload successful!");
  } else {
    console.error("Upload failed!");
  }
});
```

---

## 🔒 Security

* The PUT pre-signed URL is only valid for the **specific key** and **duration**.
* It **does not allow listing** or accessing other files.
* You can optionally restrict file size/type using \[presigned POST]\(more complex).

---

## ❗Important Notes

| Aspect                 | PUT Pre-signed URL                                 |
| ---------------------- | -------------------------------------------------- |
| HTTP Method            | `PUT`                                              |
| Use Case               | Upload file                                        |
| URL Includes           | Bucket, Key, Expiry, Signature                     |
| Requires Content-Type? | Optional, but match it if included                 |
| Backend Involvement    | Only to generate the URL                           |
| Object Becomes Public? | ❌ Not unless bucket or object is explicitly public |

---

## 📦 Example Pre-Signed PUT URL

```
https://ayush-prvt-bkt.s3.ap-south-1.amazonaws.com/uploads/myimage.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Credential=...&X-Amz-Date=...&X-Amz-Expires=300&X-Amz-SignedHeaders=host&X-Amz-Signature=...
```

> Uploading a file via `PUT` to this URL will store it as `uploads/myimage.png` in your bucket.

---

Let me know if you'd also like:

* A **React frontend example**
* A version with **file size limits**
* A **POST** pre-signed URL (for form uploads)
