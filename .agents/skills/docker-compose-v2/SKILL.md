---
name: docker-compose-v2
description: >-
  Use this skill whenever working with Docker, executing container commands,
  managing containerized services, or generating commands for running multi-container stacks.
  Enforces using modern Docker Compose V2 syntax ("docker compose") instead of deprecated V1 ("docker-compose").
---

# Docker Compose V2 Command Guideline

When interacting with Docker or managing container services in this project, **always use modern Docker Compose V2 syntax (`docker compose`)** with a space, and **never use the legacy hyphenated syntax (`docker-compose`)**.

## Enforcement Guidelines

1. **CLI Execution & Terminal Commands:**
   - **Always use:** `docker compose <subcommand>`
     - `docker compose up -d`
     - `docker compose up -d --build`
     - `docker compose down`
     - `docker compose ps`
     - `docker compose logs -f [service]`
     - `docker compose restart [service]`
     - `docker compose exec [service] [cmd]`
   - **Never use:** `docker-compose ...`

2. **Rationale:**
   - Docker Compose V1 (`docker-compose` Python/standalone binary) is deprecated.
   - The environment and runtime setups (including Kiri and the official Docker CLI) use Docker Compose V2 as a native CLI plugin (`docker compose`).
   - Using the legacy hyphenated command causes `command not found` or argument-parsing errors on machines that only have the modern plugin installed.

3. **Documentation & User Assistance:**
   - Ensure all markdown files, guides, scripts, and suggested terminal commands adhere strictly to `docker compose`.
