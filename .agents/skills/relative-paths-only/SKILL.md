---
name: relative-paths-only
description: >-
  Use this skill whenever creating or editing documentation, markdown files, configuration files,
  or code in this project. Enforces using project-relative paths (e.g. "./docker-compose.yml", "./services/...")
  and strictly forbids leaking or hardcoding absolute host/machine paths (e.g. "C:/Users/the_username/", "/home/user/").
---

# Relative Paths Only Guideline

When creating, updating, or referencing files in this project (especially documentation such as `README.md`, code comments, configuration files, and links), **always use relative paths** and **never hardcode or leak absolute host machine paths**.

## Enforcement Rules

1. **Documentation Links & Markdown:**
   - **Always use relative paths:** e.g., `[docker-compose.yml](./docker-compose.yml)` or `[Dockerfile](./services/aws-emulator/Dockerfile)`.
   - **Never use absolute file URIs or machine paths:** e.g., do NOT write `file:///c:/Users/the_username/...`, `C:\Users\the_username\...`, or `/home/<user>/...`.

2. **Portability & Privacy:**
   - Relative paths keep the repository completely portable across different operating systems, team member machines, and CI/CD environments.
   - Prevents leaking personal user directory names or local file system structures into public version control.

3. **Scripts & Terminal Commands:**
   - Prefer relative paths (`./services/aws-emulator/data/...` or `.\services\...`) or dynamic environment variables (`%CD%`, `$PWD`) rather than hardcoded user home directories.
