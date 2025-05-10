# What is Serverless? | Serverless Vs Monolith | AWS Lambda

"Serverless" in AWS is a **cloud computing execution model** where the cloud provider (AWS) **automatically manages the infrastructure** required to run your applications. In a serverless setup, developers focus only on writing code, and AWS takes care of **provisioning, scaling, and maintaining servers**.

Let’s explore this in detail:

---

## 🧠 What is Serverless in AWS?

**Serverless computing** means you don’t manage servers directly. Instead, you write your logic in small, event-driven functions or services, and AWS executes them on your behalf.

### 🔑 Key AWS Serverless Services:

1. **AWS Lambda** – Run backend logic/functions in response to events (e.g., HTTP request, file upload).
2. **Amazon API Gateway** – Create and manage REST/HTTP APIs that trigger Lambda.
3. **Amazon DynamoDB** – A serverless NoSQL database.
4. **Amazon S3** – Stores files and can trigger Lambda on upload.
5. **AWS Step Functions** – Coordinate multiple AWS services/functions into workflows.

---

### 🧩 Example Use Case (Serverless):

Let’s say you want to build an image processing app:

- A user uploads a photo to **S3**.
- The upload triggers a **Lambda function**.
- The Lambda processes the image (e.g., resizes it).
- The processed image is stored back in **S3**.
- Results are logged in **DynamoDB**.

Here, you **never set up any server** – AWS runs everything as needed.

---

## 🖥️ What is Amazon EC2?

**Amazon EC2 (Elastic Compute Cloud)** is AWS’s **Infrastructure-as-a-Service (IaaS)** offering. You create **virtual machines (EC2 instances)** and control:

- The OS (Linux, Windows, etc.)
- Installed software
- Networking
- Scaling
- Security patches

You must **manually manage** things like:

- Server uptime
- Load balancing
- Auto-scaling
- Deployment

---

## 🔍 Serverless vs EC2 – Key Differences

| Feature                | Serverless (e.g., AWS Lambda)         | EC2 (Virtual Servers)                      |
| ---------------------- | ------------------------------------- | ------------------------------------------ |
| **Provisioning**       | No provisioning; AWS handles it       | You provision VMs manually                 |
| **Scaling**            | Auto-scales instantly based on events | Manual or Auto Scaling Groups required     |
| **Billing**            | Pay per execution time & requests     | Pay per hour/second regardless of usage    |
| **Startup Time**       | Near-instant (cold starts possible)   | Slower (boot time for instance)            |
| **Management**         | Zero server management                | You manage OS, patches, scaling, etc.      |
| **Use Case Fit**       | Event-driven, microservices, APIs     | Long-running apps, legacy systems, full OS |
| **Execution Duration** | Max 15 minutes per Lambda             | Long-running processes are supported       |

---

## 🤔 When to Use What?

### ✅ Choose **Serverless** when:

- You have **event-driven workloads** (e.g., APIs, file uploads).
- You want to **minimize operations overhead**.
- You want **cost-effective short execution** (sporadic traffic).
- You're building **microservices** or quick backends.

### ✅ Choose **EC2** when:

- You need **full control over the OS** and environment.
- You're running a **stateful application** or long processes.
- You're dealing with **legacy apps** not designed for serverless.
- You want to run a **web server, database, or container orchestration** manually.

---

## 🚀 Summary:

- **Serverless** = No infrastructure management, auto-scaling, event-driven, cost-efficient.
- **EC2** = Full control over a virtual machine, more flexibility, more responsibility.

---

---

# 🔄 How Serverless Autoscaling Works (in AWS Lambda)

Serverless **autoscaling** is one of its biggest advantages — and it's **completely handled by AWS behind the scenes**. Let’s break down how it works and how it's different from traditional autoscaling like with EC2.

### 🔧 AWS Lambda Autoscaling Logic:

- **Trigger-based Execution**: Each time an event happens (e.g. HTTP request, file upload, etc.), Lambda automatically spins up a **new instance of the function** to handle that event.
- **No Pre-Provisioning**: You don't need to specify how many servers or threads to run.
- **Parallel Execution**: Lambda can **handle thousands of concurrent executions**, spawning more "workers" as needed — _automatically_.
- **Managed by AWS**: AWS handles:

  - Provisioning new resources
  - Load balancing requests
  - Retiring idle instances

### Example:

If your app suddenly receives **10,000 HTTP requests at once**, Lambda will automatically create **10,000 parallel executions** (within your account’s concurrency limits) without any setup from you.

---

## 🧱 Core Components Involved

### 1. **Concurrency Limit**

- By default, AWS allows **1,000 concurrent Lambda executions** per region.
- You can request to **increase this limit**.
- Each execution is isolated and runs independently.

### 2. **Cold Starts**

- The first time a function is invoked (or after inactivity), AWS creates a **new container**, which causes a small delay (cold start).
- After the first call, AWS **keeps containers warm** for a short period for faster re-use.

### 3. **Burst Capacity**

- AWS allows your function to burst **beyond 1,000 concurrent requests** in certain regions, gradually increasing throughput.
- After the burst, requests are throttled unless you increase concurrency limits.

---

## 🚀 How Is This Different From EC2 Autoscaling?

| Feature             | Serverless (Lambda)                      | EC2 Autoscaling                           |
| ------------------- | ---------------------------------------- | ----------------------------------------- |
| Scaling Trigger     | Events (e.g., HTTP request, file upload) | Metrics (CPU, memory, custom alarms)      |
| Scaling Time        | Instant (milliseconds)                   | Slower (minutes – new instance startup)   |
| Scaling Granularity | Per-request                              | Per-instance                              |
| Management          | Fully managed                            | Requires setup: Auto Scaling Groups, AMIs |
| Limits              | Concurrency limits (soft/hard)           | Based on instance type and count          |

---

## ✅ Benefits of Serverless Autoscaling

- **No load balancers or instance pools** to manage
- **Pay per execution**, not per server uptime
- Scales **to zero** when idle (zero cost at rest)
- Instant scale **up and down**

---

## 📌 TL;DR:

Serverless autoscaling in AWS (like with Lambda) works by:

- Spawning **new instances per event/request** automatically
- Running them **in parallel**
- Scaling **up instantly** with demand, and **scaling down to zero** when idle
- Requiring **no manual configuration or servers**

---

---

# 🧱 What is a Monolith?

A **monolith (monolithic architecture)** is a traditional way of building software where **the entire application is built and deployed as a single unit**.

### 🔧 Characteristics:

- One large codebase for all functionality (e.g., authentication, payment, UI rendering, business logic).
- A single deployable artifact (like a WAR, JAR, or full Node.js app).
- Runs on a **single server or cluster of servers**, often using EC2 or virtual machines.

### 🖼️ Example:

Imagine an e-commerce app where:

- Product catalog
- User authentication
- Payment gateway
- Order processing

…all exist within **one codebase and service**, running on the same server.

---

## 📦 What is Serverless (in contrast)?

**Serverless architecture** is a **microservice-like, event-driven approach** where the application is split into **independent, small functions or services** that each do one task, and scale independently.

Instead of building one giant service, you build:

- A login function
- A payment handler function
- A send-email function
- Each one **deployed independently**, often as **AWS Lambda functions**

---

## 🔍 Monolith vs Serverless – Side-by-Side Comparison

| Feature               | Monolith                                   | Serverless                                    |
| --------------------- | ------------------------------------------ | --------------------------------------------- |
| **Architecture**      | Single large codebase                      | Collection of small, independent functions    |
| **Deployment**        | One unit                                   | Multiple independent deployments              |
| **Scaling**           | Scales entire app                          | Scales per function, on demand                |
| **Maintenance**       | One change affects full system             | Easy to update parts without touching whole   |
| **Startup Time**      | Long (heavy app)                           | Near-instant (function-level execution)       |
| **Development Speed** | Slower over time as complexity grows       | Faster iteration on individual functions      |
| **Cost**              | Pay for server uptime (even when idle)     | Pay per execution (cost-efficient)            |
| **Hosting**           | Often EC2, containers, VMs                 | Fully managed (e.g., AWS Lambda, API Gateway) |
| **Use Case**          | Best for tightly coupled or legacy systems | Best for modern, cloud-native apps            |

---

## 🔄 Real-World Example

### Monolithic:

A Django or Spring Boot app deployed to EC2 or Heroku with everything included: routes, templates, APIs, database layer.

### Serverless:

- `/login` route → handled by one Lambda function
- `/checkout` route → another function
- Each connected through **API Gateway**, and stores data in **DynamoDB or RDS**

---

## 🧠 Pros and Cons

### ✅ Monolith – Pros:

- Easier to get started for small apps
- Easier debugging and tracing (everything is in one place)
- Less complex deployment (at first)

### ❌ Monolith – Cons:

- Hard to scale specific parts
- Any change requires redeploying the whole app
- Tight coupling between modules

---

### ✅ Serverless – Pros:

- Auto-scaling, cost-efficient
- Independent deploys and development
- Great for microservices and event-driven workloads

### ❌ Serverless – Cons:

- Harder debugging across functions
- Cold starts can affect performance
- Needs more cloud-specific knowledge

---

## 🔚 Summary:

- A **monolith** is a single, all-in-one application, often hosted on servers like EC2.
- **Serverless** splits the app into tiny functions that scale individually and don’t need server management.
- **Monolith = traditional**; **Serverless = modern cloud-native**.
