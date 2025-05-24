

# 🛡️ What is AWS IAM?

**AWS IAM** is a **web service** that helps you **securely control access** to AWS services and resources. With IAM, you can:

* **Create and manage AWS users and groups**
* **Define permissions** to allow or deny their access to AWS resources

IAM enables **granular control**—you decide **who** can do **what**, **on which resources**, and **under what conditions**.

---

## 📦 Key Concepts in AWS IAM

### 1. **Users**

* Represents an individual person or application.
* IAM users are used for **long-term credentials** (username/password or access keys).
* Each user can have:

  * Password for AWS Console
  * Access keys for programmatic access (CLI, SDKs)

### 2. **Groups**

* A collection of IAM users.
* You can attach policies to a group; all users in that group get the permissions.
* Useful for **role-based access control**.

### 3. **Roles**

* Similar to a user but **intended for temporary access**.
* Used by:

  * AWS services (e.g., EC2 instance accessing S3)
  * Cross-account access
  * Federated users (SSO, Active Directory, etc.)
* Roles have **assume policies** (who can assume the role) and **permissions policies** (what the role can do).

### 4. **Policies**

* **JSON documents** that define permissions.
* Two main types:

  * **Identity-based policies**: Attached to users, groups, or roles.
  * **Resource-based policies**: Attached directly to resources (e.g., S3 buckets, Lambda functions).
* Permissions include:

  * **Actions** (e.g., `s3:PutObject`)
  * **Resources** (e.g., `arn:aws:s3:::my-bucket/*`)
  * **Conditions** (e.g., IP address, time of day)

---

## 🧠 How IAM Works (Behind the Scenes)

When someone (or something) makes a request:

1. IAM evaluates **who** made the request.
2. IAM **checks all applicable policies**.
3. IAM **grants or denies access** based on:

   * Explicit **deny** overrides everything.
   * If no **allow** is found → access is denied by default.
4. If permission is **granted**, AWS performs the requested action.

---

## 🧾 Types of Policies

* **Managed Policies**:

  * **AWS-managed** (predefined by AWS, e.g., `AmazonS3FullAccess`)
  * **Customer-managed** (you create and manage them)
* **Inline Policies**:

  * Embedded directly into a user, group, or role (not reusable)

---

## 🔐 IAM Best Practices

1. **Use IAM roles instead of users for applications.**
2. **Grant least privilege** – only allow what's absolutely necessary.
3. **Enable MFA** (Multi-Factor Authentication) for sensitive users.
4. **Use groups** for easier permission management.
5. **Rotate access keys** and credentials regularly.
6. **Use IAM Access Analyzer** to review policies and monitor external access.

---

## 🧭 Common Use Cases

* Allow an EC2 instance to upload files to an S3 bucket.
* Let a user manage only DynamoDB, but not other services.
* Grant cross-account access to AWS resources.
* Connect external identity providers (like Google Workspace or Azure AD).

---

## 💬 Example IAM Policy (Read-only S3 access)

```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Effect": "Allow",
      "Action": [
        "s3:GetObject",
        "s3:ListBucket"
      ],
      "Resource": [
        "arn:aws:s3:::example-bucket",
        "arn:aws:s3:::example-bucket/*"
      ]
    }
  ]
}
```

---

## 💬 Example IAM Policy (S3 full access)


```json
{
    "Version": "2012-10-17",
    "Statement": [
        {
            "Effect": "Allow",
            "Action": [
                "s3:*",
                "s3-object-lambda:*"
            ],
            "Resource": "*"
        }
    ]
}
```

---
---
---
---

# 👥 What is an IAM Group?

An **IAM Group** is a **collection of IAM users**. It’s used to **assign permissions to multiple users at once**, simplifying user management.

### Key Points:

* Groups **do not have credentials** or identities themselves.
* Users **inherit the permissions** of the group(s) they belong to.
* A user can belong to **multiple groups**.
* Groups can’t be nested (i.e., no groups within groups).

---

## ✅ Why Use IAM Groups?

Instead of assigning policies to users individually, you:

* Create a group (e.g., `Developers`, `Admins`, `ReadOnlyUsers`)
* Attach policies to that group
* Add users to the group

This follows the **principle of least privilege** and makes your IAM setup **cleaner and scalable**.

---

## 🔧 How to Create an IAM Group

### 🚀 Method 1: **AWS Management Console**

1. **Log in** to the [AWS Console](https://console.aws.amazon.com/iam/)
2. Go to **IAM > User groups**
3. Click **“Create group”**
4. Enter a **Group name** (e.g., `DevTeam`)
5. **Attach policies** (optional for now)

   * You can search for and attach AWS managed policies like `AmazonS3ReadOnlyAccess`
6. Click **“Create group”**

To **add users**:

* Go to the group → Click **“Add users to group”**
* Select the users and add them

---

### 🖥️ Method 2: **AWS CLI**

**Create a group:**

```bash
aws iam create-group --group-name DevTeam
```

**Attach a policy:**

```bash
aws iam attach-group-policy \
  --group-name DevTeam \
  --policy-arn arn:aws:iam::aws:policy/AmazonS3ReadOnlyAccess
```

**Add a user to the group:**

```bash
aws iam add-user-to-group \
  --user-name ayush \
  --group-name DevTeam
```

---

### 📃 Optional: Add an Inline Policy

You can also create **custom policies** and attach them to the group if AWS-managed policies don't meet your needs.

---

## 🧠 Best Practices for IAM Groups

1. **Use role-based group names** like `BillingTeam`, `S3Managers`, `LambdaDevs`.
2. Avoid assigning permissions directly to users—always prefer **group-level permissions**.
3. Regularly **review group membership** and attached policies.
4. **Document** your permission strategy for team clarity and audits.

---
---
---
---

# 🧾 What is an IAM Policy?

An **IAM Policy** is a **JSON document** that defines **permissions**. It tells AWS:

> “This user/group/role is allowed or denied to perform these actions on these resources under these conditions.”

### 🔑 Key Elements of a Policy:

* **Version**: Always `"2012-10-17"` for now.
* **Statement**: Array of permission rules.
* Each `Statement` has:

  * `Effect`: `Allow` or `Deny`
  * `Action`: The AWS service actions (e.g., `s3:PutObject`)
  * `Resource`: The resources affected (ARN format)
  * `Condition` (optional): Further restrict access (e.g., IP address, tags)

---

## ✅ Types of IAM Policies

| Type                  | Description                                                 |
| --------------------- | ----------------------------------------------------------- |
| **Managed Policies**  | Standalone policies attached to users, groups, or roles     |
| - AWS-managed         | Pre-built by AWS (e.g., `AmazonS3FullAccess`)               |
| - Customer-managed    | Created by you                                              |
| **Inline Policies**   | Embedded directly in a user, group, or role (non-reusable)  |
| **Resource Policies** | Attached to AWS resources directly (e.g., S3 Bucket Policy) |

---

## 🛠️ How to Create a Custom Policy

### 🚀 Method 1: **AWS Console**

1. Go to **IAM > Policies**
2. Click **“Create policy”**
3. Choose **Visual editor** or **JSON**

#### Example: Allow S3 Read Access

```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Effect": "Allow",
      "Action": [
        "s3:GetObject",
        "s3:ListBucket"
      ],
      "Resource": [
        "arn:aws:s3:::my-bucket",
        "arn:aws:s3:::my-bucket/*"
      ]
    }
  ]
}
```

4. Click **Next**, give it a **name** (e.g., `S3ReadOnlyPolicy`), and **create** the policy.

---

### 🖥️ Method 2: **AWS CLI**

**Create a policy from a JSON file**:

```bash
aws iam create-policy \
  --policy-name S3ReadOnlyPolicy \
  --policy-document file://s3-read-only-policy.json
```

**Example JSON file (`s3-read-only-policy.json`)**:

```json
{
  "Version": "2012-10-17",
  "Statement": [{
    "Effect": "Allow",
    "Action": ["s3:GetObject", "s3:ListBucket"],
    "Resource": [
      "arn:aws:s3:::my-bucket",
      "arn:aws:s3:::my-bucket/*"
    ]
  }]
}
```

---

### 📎 Attaching the Policy

You can attach this policy to:

* A **user**

```bash
aws iam attach-user-policy \
  --user-name ayush \
  --policy-arn arn:aws:iam::<account-id>:policy/S3ReadOnlyPolicy
```

* A **group**

```bash
aws iam attach-group-policy \
  --group-name DevTeam \
  --policy-arn arn:aws:iam::<account-id>:policy/S3ReadOnlyPolicy
```

* A **role**

```bash
aws iam attach-role-policy \
  --role-name EC2S3AccessRole \
  --policy-arn arn:aws:iam::<account-id>:policy/S3ReadOnlyPolicy
```

---

## 🧠 Tips for Writing Good Policies

1. **Follow least privilege**: Only grant what’s needed.
2. **Use wildcards carefully**: Avoid `"*"` unless necessary.
3. **Use condition keys** to add fine-grained control.
4. **Group actions logically** (e.g., read vs. write actions).
5. **Test with IAM Policy Simulator**: [IAM Simulator](https://policysim.aws.amazon.com/)

---

## 💡 Example Use Cases

| Policy Purpose      | Actions                                | Resource                      |
| ------------------- | -------------------------------------- | ----------------------------- |
| Read-only to S3     | `s3:GetObject`, `s3:ListBucket`        | S3 bucket and objects         |
| Full access to EC2  | `ec2:*`                                | All EC2 resources             |
| Lambda invoke only  | `lambda:InvokeFunction`                | A specific Lambda ARN         |
| DynamoDB read/write | `dynamodb:GetItem`, `dynamodb:PutItem` | A specific DynamoDB table ARN |

---

Let me know if you’d like a **real custom policy** example for your LMS, Tradezy, or Vibez app use case—I'll tailor it exactly to that.

