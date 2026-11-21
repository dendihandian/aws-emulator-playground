# AWS Emulator Playground

Welcome to **AWS Emulator Playground** — a modular local development environment designed for testing, prototyping, and interacting with official AWS APIs offline without needing an active AWS account or deploying cloud resources.

Based on the official AWS documentation:
[Getting started with Docker - AWS Emulator](https://docs.aws.amazon.com/emulator/latest/userguide/getting-started-docker.html).

---

## Services in this Playground

```text
aws-emulator-playground/
├── docker-compose.yml                  <-- Orchestrates all services
├── .env.example
├── README.md
└── services/
    ├── aws-emulator/                   <-- Official AWS API Emulator runtime
    │   ├── Dockerfile
    │   └── data/                       <-- Auto-generated ca.pem, config, credentials
    │
    └── dynamodb-app/                   <-- React + Node Web App to manage DynamoDB
        ├── Dockerfile
        ├── server.js                   <-- Express + AWS SDK v3 client backend
        ├── package.json
        └── src/                        <-- React 18 single-page application
```

---

## Allocated Docker Resources

This playground configures explicit resource limits and reservations in `docker-compose.yml` to ensure predictable local execution and prevent runaway memory usage:

| Service | CPU Reservation | CPU Limit | Memory Reservation | Memory Limit | Purpose & Rationale |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **`aws-emulator`** | `0.5` | `2.0` | `512 MB` | **`2.0 GB`** | Matches official AWS documentation (`--memory=2g`). Stores emulated state (DynamoDB tables, items, S3 objects, SQS messages) purely in RAM. |
| **`dynamodb-app`** | `0.2` | `1.0` | `128 MB` | **`512 MB`** | Lightweight Node.js/Express API server and static React 18 dashboard assets. |
| **Total Stack** | **`~0.7`** | **`3.0`** | **`~640 MB`** | **`~2.5 GB`** | Recommended minimum host/WSL free memory: at least 4 GB. |

> **Customization:** If you are running on a machine with limited memory, you can adjust these allocations under the `deploy.resources` section in [docker-compose.yml](./docker-compose.yml).

---

## Quick Start

### 1. Build and Start the Entire Stack

From the root directory, run:

```cmd
docker compose up -d --build
```

This starts both:
1. **AWS Emulator** listening on `https://127.0.0.1:9297`
2. **DynamoDB Web Studio** listening on `http://localhost:3000`

---

### 2. Open the DynamoDB Web App

Open your browser and navigate to:

👉 **[http://localhost:3000](http://localhost:3000)**

#### Features in the Web App:
- **Status Indicator:** Shows live connection status and latency to the AWS Emulator.
- **⚡ Seed Sample Data:** 1-click button to create a `Products` table pre-populated with 5 records.
- **Table Management:** Create new tables (Partition Key, Sort Key, on-demand billing), delete tables.
- **Record Management:** Browse table items, filter records, insert new items (via visual form or raw JSON), view full item JSON, and delete items.

---

### 3. Verify Status & Logs via Terminal

```cmd
# Check container status
docker compose ps

# Stream AWS Emulator logs
docker compose logs -f aws-emulator

# Stream DynamoDB Web App logs
docker compose logs -f dynamodb-app
```

---

## Interacting with the Emulator from Host (CLI & SDKs)

When `aws-emulator` boots, it generates credentials and a self-signed TLS CA certificate in `./services/aws-emulator/data/9297/`.

### Windows (Command Prompt / `cmd`)
```cmd
set AWS_ENDPOINT_URL=https://127.0.0.1:9297
set AWS_DEFAULT_REGION=us-east-1
set AWS_SHARED_CREDENTIALS_FILE=%CD%\services\aws-emulator\data\9297\emulator_credentials
set AWS_CONFIG_FILE=%CD%\services\aws-emulator\data\9297\config
set AWS_CA_BUNDLE=%CD%\services\aws-emulator\data\9297\ca.pem
set AWS_EC2_METADATA_DISABLED=true
set AWS_DISABLE_HOST_PREFIX_INJECTION=true

# Test with AWS CLI
aws dynamodb list-tables
```

### Windows (PowerShell)
```powershell
$env:AWS_ENDPOINT_URL="https://127.0.0.1:9297"
$env:AWS_DEFAULT_REGION="us-east-1"
$env:AWS_SHARED_CREDENTIALS_FILE="$PWD\services\aws-emulator\data\9297\emulator_credentials"
$env:AWS_CONFIG_FILE="$PWD\services\aws-emulator\data\9297\config"
$env:AWS_CA_BUNDLE="$PWD\services\aws-emulator\data\9297\ca.pem"
$env:AWS_EC2_METADATA_DISABLED="true"
$env:AWS_DISABLE_HOST_PREFIX_INJECTION="true"

# Test with AWS CLI
aws dynamodb list-tables
```

---

## Stopping the Playground

```cmd
docker compose down
```

> **Note:** The AWS Emulator keeps all emulated resources (DynamoDB tables, items, S3 buckets, etc.) in memory. Stopping or restarting the container resets the state and generates fresh credentials and certificates.
