# Advanced AWS S3 topics
---

## 🔁 1. Bucket Versioning

* **Purpose**: Preserve, store, and retrieve every version of every object in a bucket.
* **Use Case**: Protect against accidental deletes/overwrites.
* **Behavior**:

  * When enabled, **every PUT, POST, DELETE creates a new version**.
  * You can retrieve/restore older versions or delete a specific version.
* **Enabling**: Once turned on, you can’t disable—only suspend.
* **Versions**:

  * Each object gets a `versionId`.
  * Delete becomes a **"delete marker"**, not actual deletion.

---

## 🏷️ 2. Object and Bucket Tags

* **Purpose**: Add metadata (key-value pairs) to buckets/objects.
* **Use Case**:

  * Cost allocation
  * Lifecycle policies
  * Access control
* **Max Tags**: 10 per object or bucket.
* **Example**:

  ```json
  {"Key": "env", "Value": "production"}
  ```

---

## 🔍 3. AWS CloudTrail – Data Events

* **Purpose**: Log detailed **object-level API activity** (like `GetObject`, `PutObject`, etc.).
* **Types**:

  * **Management Events**: e.g., bucket creation
  * **Data Events**: e.g., object upload/download
* **Use Case**:

  * Audit access to sensitive data
  * Troubleshoot unexpected behavior
* **Important**: Data events incur extra cost and are disabled by default.

---

## 📢 4. Event Notifications

* **Purpose**: Notify when certain actions happen (like `PUT`, `DELETE`, etc.)
* **Destinations**:

  * **SNS** (Simple Notification Service)
  * **SQS** (Simple Queue Service)
  * **Lambda** (trigger code)
* **Use Case**: Trigger image processing after upload, or log deletion events.
* **Granularity**: You can set filters by prefix or suffix (`images/` or `.jpg`).

---

## 🔐 5. Access Control List (ACL)

* **Purpose**: Legacy way of controlling access to buckets and objects.
* **Use Cases**:

  * Share with other AWS accounts
  * Grant public read (e.g., static website)
* **Grants Permissions To**:

  * AWS accounts
  * Predefined groups (like `AllUsers`)
* **Permissions**:

  * READ, WRITE, FULL\_CONTROL
* ⚠️ **Note**: AWS recommends using **Bucket Policies or IAM** over ACLs.

---

## 🌐 6. Cross-Origin Resource Sharing (CORS)

* **Purpose**: Allow browser-based clients from different domains to access S3.
* **Use Case**: A frontend app on `domainA.com` accessing S3 on `bucketB`.
* **Configuration**: Set CORS rules in bucket.

  ```xml
  <CORSRule>
      <AllowedOrigin>https://example.com</AllowedOrigin>
      <AllowedMethod>GET</AllowedMethod>
      <AllowedHeader>*</AllowedHeader>
  </CORSRule>
  ```

---

## 📦 7. Management Features

### 🔁 a. Lifecycle Rules

* **Purpose**: Automate transition and deletion of objects.
* **Actions**:

  * Transition to cheaper storage:

    * S3 Standard → S3 Glacier
  * Expire/delete after a set time
* **Use Case**:

  * Archive logs after 30 days
  * Delete temp files after 7 days

### 📄 b. Replication Rules

* **Purpose**: Automatically replicate objects between buckets (same/different regions).
* **Types**:

  * **Same-region replication (SRR)**
  * **Cross-region replication (CRR)**
* **Use Case**:

  * Backup
  * Compliance (data locality)
* **Requirements**:

  * Versioning must be enabled
  * IAM permissions must allow replication

### 📋 c. Inventory

* **Purpose**: Generate a report (CSV/ORC/Parquet) listing objects in your bucket.
* **Includes**:

  * Size
  * Last modified
  * Storage class
  * Encryption status
* **Use Case**:

  * Audit
  * Cost analysis
  * Security review

---

## 💸 8. S3 Pricing Breakdown

S3 pricing is based on multiple factors:

| **Component**             | **Details**                                                   |
| ------------------------- | ------------------------------------------------------------- |
| **Storage class**         | Standard, Infrequent Access, Glacier, Deep Archive            |
| **Requests**              | PUT, GET, LIST, DELETE – priced per 1,000 requests            |
| **Data Transfer**         | - **Free** within same region<br>- **Charged** across regions |
| **Lifecycle transitions** | Charged per transition                                        |
| **Replication**           | Charged for storage & requests on destination bucket          |
| **Inventory, Analytics**  | Extra cost based on output frequency and storage              |

### Example Classes:

| Storage Class      | Use Case                             | Retrieval Time | Cost     |
| ------------------ | ------------------------------------ | -------------- | -------- |
| Standard           | Frequent access                      | Instant        | High     |
| Infrequent Access  | Less accessed (30+ days)             | Instant        | Lower    |
| Glacier            | Archival (retrieved in minutes)      | Minutes-hours  | Low      |
| Glacier Deep Arch. | Long-term archive (retrieved rarely) | Hours          | Very Low |

---

Would you like a visual cheat sheet or Markdown-formatted notes of this?
