# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project layout

All runnable code lives inside `ocmi-timesheets/`. Run every command from that directory.

```
ocmi-timesheets/
  api/          # Hono (Node) REST API — port 3000
  web/          # React 19 + Vite SPA — port 4200
  packages/
    shared/     # @ocmi-timesheets/shared — types, Zod schemas, business logic
  prisma/       # Prisma schema + migrations (PostgreSQL)
```

## Setup and dev commands

```bash
cd ocmi-timesheets

# 1. Start the database (requires Docker daemon running)
docker compose up -d

# 2. Install dependencies
npm install

# 3. Database setup (first time or after new migrations)
npx prisma migrate deploy
npx prisma generate

# 4. Run API and web in separate terminals
npx nx serve api   # http://localhost:3000
npx nx dev web     # http://localhost:4200
```

## Testing

```bash
# Run all tests for a project
npx nx test api
npx nx test web
npx nx test shared

# Run a single test file
npx nx test api --testFile=src/routes/approval-lock.integration.test.ts
```

The API uses **Jest + SWC** for integration tests (hits the real database — no mocks).  
The `web` and `shared` packages use **Vitest**.

## Architecture

### Shared package (`@ocmi-timesheets/shared`)
The single source of truth for types and validation. Both API routes and the web client import from here:
- **Zod schemas** (`CreateTimeEntrySchema`, `UpdateTimeEntrySchema`, etc.) — used for request validation on the API side.
- **Business logic** — `getWeekStart(date)` normalises any date to its Monday (UTC); `calculateWeeklySummary(totalHours, hourlyRate)` applies the 40-hour rule (overtime at 1.5×).

### API (`api/`)
Hono app with five route groups registered in `src/app.ts`:

| Route prefix         | File                        | Purpose                          |
|----------------------|-----------------------------|----------------------------------|
| `/health`            | `routes/health.ts`          | Liveness check                   |
| `/employees`         | `routes/employees.ts`       | CRUD + soft-deactivate           |
| `/time-entries`      | `routes/time-entries.ts`    | CRUD — blocked when week APPROVED |
| `/reports`           | `routes/reports.ts`         | Weekly pay summary               |
| `/weekly-timesheets` | `routes/weekly-timesheets.ts` | Approve / reject a week        |

The approval-lock invariant is enforced in every mutating time-entry route: before writing, the route checks for a `WeeklyTimesheet` with `status = 'APPROVED'` for the affected week(s) and returns **409** if found.

### Frontend (`web/`)
React 19 SPA. The Vite dev server proxies `/api/*` → `http://localhost:3000`, so all `fetch` calls use the `/api` prefix (e.g. `/api/employees`).

API calls are organised in `src/lib/`:
- `employeeApi.ts`, `timeEntryApi.ts`, `weeklyApi.ts` — each file owns one resource.

Pages live in `src/pages/` (`Employees/`, `TimeEntries/`, `WeeklySummary/`).

### Database (Prisma + PostgreSQL)
Three models: `Employee`, `TimeEntry`, `WeeklyTimesheet`.  
`WeeklyTimesheet` has a unique constraint on `(employeeId, weekStart)` and is created on first approval via `upsert`.  
Weeks are identified by their **Monday date** (UTC), computed with `getWeekStart`.
