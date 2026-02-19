# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Psynth Identity Service — a TypeScript authentication/identity service built with Fastify, PostgreSQL, and Drizzle ORM. Manages user accounts and session-based authentication.

## Commands

```bash
npm run build          # Compile TypeScript → /dist
npm run dev            # Watch mode (tsc --watch + nodemon)
npm start              # Production start (uses .env.production)
npm test               # Run all unit tests (vitest run)
npm run test:watch     # Run tests in watch mode
npm run coverage       # Test coverage report

# Database
npm run db:generate    # Generate Drizzle migration files
npm run db:migrate     # Run migrations (local)
npm run db:migrate:prod # Run migrations (production, uses .env.production)
npm run db:push        # Push schema directly (dev only)
npm run db:studio      # Open Drizzle Studio
npm run db:reset-local # Reset local database
```

Local dev requires a PostgreSQL instance (default: localhost:5432, db: psynth, user: postgres, password: password). Configure via `.env` or environment variables (`POSTGRESQL_HOST`, `POSTGRESQL_PORT`, etc.).

## Architecture

Clean Architecture with four layers:

- **`src/app/entities/`** — Domain entities (`AccountEntity`, `SessionEntity`) with business rules and validation
- **`src/app/use-cases/`** — Business logic orchestration (`CreateAccountUseCase`, `LoginUseCase`, `LogoutUseCase`). Use cases receive gateways via constructor injection.
- **`src/app/ports/`** — Gateway interfaces (`.d.ts` files) defining contracts for data persistence
- **`src/adapters/postgres-gateways/`** — Drizzle ORM implementations of gateway interfaces
- **`src/adapters/mappers/`** — Transform between DB rows, domain entities, and API response objects
- **`src/web-server/request-handlers/`** — Fastify route handlers that invoke use cases
- **`src/web-server/plugins/`** — Fastify plugins (auth, error handling, CORS)
- **`src/web-server/app-profile/`** — DI container (`AppProfile`) that wires gateways into use cases

### Key Patterns

**Dependency flow:** Request Handler → Use Case → Gateway (port) → Postgres adapter. Business logic never depends on infrastructure.

**DI via AppProfile:** `AppProfile` is attached to each Fastify request as `req.appProfile`. It constructs use cases with their gateway dependencies. This is the only place wiring happens.

**Error mapping:** Domain errors (`src/app/errors/`) are caught and mapped to HTTP status codes via `src/web-server/utils/error-mapper.ts`. The Fastify error handler plugin normalizes all error responses.

**Session auth:** HTTP-only `sid` cookie with sliding window expiry (auto-extends if >50% of 7-day lifetime elapsed). Session entity tracks IP, User-Agent, and revocation state.

**Entity IDs:** Accounts use nanoid with `account-` prefix. Sessions use 64-char random IDs.

## Configuration

Uses the `config` npm package with `config/default.js` and `config/production.js`. Environment variables override defaults. Server runs on port 3050. Drizzle config is in `drizzle.config.ts` and reads from `DOTENV_PATH` env var (defaults to `.env`).

## Database Schema

Defined in `src/db/schema.ts`. Two tables: `accounts` and `login_sessions`. Migrations output to `./drizzle/`.