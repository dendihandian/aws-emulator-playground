# AWS Emulator Playground

Welcome to **AWS Emulator Playground** — a modular local development environment designed for testing, prototyping, and interacting with official AWS APIs offline without needing an active AWS account or deploying cloud resources.

Based on the official AWS documentation:
[Getting started with Docker - AWS Emulator](https://docs.aws.amazon.com/emulator/latest/userguide/getting-started-docker.html).

---

## Purpose & Architecture

This playground provides a containerized **AWS Emulator** runtime and a scalable structure to add companion services (backend APIs, worker services, Lambda handlers, web apps, etc.) that interact directly with the emulated AWS cloud locally.

### Project Structure

```text
aws-emulator-playground/
├── docker-compose.yml              <-- Orchestrates all services
├── .env.example                    <-- Default environment configurations
├── README.md
└── services/
    ├── aws-emulator/               <-- Core AWS API Emulator
    │   ├── Dockerfile
    │   └── data/                   <-- Auto-generated ca.pem, config, credentials
    └── [your-service-here]/        <-- Add companion services to interact with the emulator
```

---

## Quick Start

### 1. Build and Start the Stack

```cmd
docker-compose up -d --build
```
*(or `docker compose up -d --build`)*

### 2. Verify Status & Live Logs

```cmd
# Check container status
docker-compose ps

# Stream emulator logs
docker-compose logs -f aws-emulator
```

### 3. Verify Health Check Endpoint

```cmd
curl -k https://127.0.0.1:9297/__admin/health
```

---

## Interacting with the Emulator

### Method 1: From Your Host Machine (AWS CLI & SDKs)

When `aws-emulator` boots, it generates credentials and a self-signed TLS CA certificate in `./services/aws-emulator/data/9297/`.

#### Windows (Command Prompt / `cmd`)
```cmd
set AWS_ENDPOINT_URL=https://127.0.0.1:9297
set AWS_DEFAULT_REGION=us-east-1
set AWS_SHARED_CREDENTIALS_FILE=%CD%\services\aws-emulator\data\9297\emulator_credentials
set AWS_CONFIG_FILE=%CD%\services\aws-emulator\data\9297\config
set AWS_CA_BUNDLE=%CD%\services\aws-emulator\data\9297\ca.pem
set AWS_EC2_METADATA_DISABLED=true
set AWS_DISABLE_HOST_PREFIX_INJECTION=true

# Test with AWS CLI
aws s3 ls
```

#### Windows (PowerShell)
```powershell
$env:AWS_ENDPOINT_URL="https://127.0.0.1:9297"
$env:AWS_DEFAULT_REGION="us-east-1"
$env:AWS_SHARED_CREDENTIALS_FILE="$PWD\services\aws-emulator\data\9297\emulator_credentials"
$env:AWS_CONFIG_FILE="$PWD\services\aws-emulator\data\9297\config"
$env:AWS_CA_BUNDLE="$PWD\services\aws-emulator\data\9297\ca.pem"
$env:AWS_EC2_METADATA_DISABLED="true"
$env:AWS_DISABLE_HOST_PREFIX_INJECTION="true"

# Test with AWS CLI
aws s3 ls
```

---

### Method 2: Adding & Connecting Another Service

You can add your own service (e.g., `services/my-api/`) and attach it to `docker-compose.yml`.

Because the emulator generates TLS certificates explicitly bound to `127.0.0.1` and `localhost`, companion containers can either:

1. **Share the network namespace (`network_mode: service:aws-emulator`)** — *Recommended*:
   Allows your application to reach the emulator directly via `https://127.0.0.1:9297` with zero TLS hostname mismatch errors.

   ```yaml
   services:
     aws-emulator:
       # ... (defined in docker-compose.yml)

     my-app:
       build:
         context: ./services/my-app
         dockerfile: Dockerfile
       depends_on:
         - aws-emulator
       network_mode: service:aws-emulator
       environment:
         - AWS_ENDPOINT_URL=https://127.0.0.1:9297
         - AWS_DEFAULT_REGION=us-east-1
         - AWS_CA_BUNDLE=/home/emulator/.aws/emulator/9297/ca.pem
         - AWS_SHARED_CREDENTIALS_FILE=/home/emulator/.aws/emulator/9297/emulator_credentials
       volumes:
         - ./services/aws-emulator/data:/home/emulator/.aws/emulator:ro
   ```

---

## Stopping the Playground

```cmd
docker-compose down
```

> **Note:** The AWS Emulator keeps all emulated resources (S3 buckets, SQS queues, DynamoDB tables, etc.) in memory. Stopping or restarting the container resets the state and generates fresh credentials and certificates.
