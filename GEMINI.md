# Project Guidelines: AWS Emulator Playground

## Docker Commands
- **Always use `docker compose`** (modern Compose V2 syntax with a space).
- **Never use `docker-compose`** (deprecated legacy V1 syntax with a hyphen).
- Applies to all terminal commands, scripts, code comments, and documentation.

## Path Conventions
- **Always use relative paths** (e.g. `./docker-compose.yml`, `./services/...`) in project files, documentation, and markdown links.
- **Never use or expose absolute host machine paths** (e.g. `C:\Users\<username>\`, `/home/<username>/`).
- Keeps the repository portable, clean, and leak-free for version control.
