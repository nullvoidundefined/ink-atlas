# P0: Launch Blockers

Everything required before the app can run locally or be deployed. Nothing else starts until these are done.

---

## 1. Install dependencies

```bash
pnpm install
```

---

## 2. Create Neon database with PostGIS

Create a new Neon project at https://neon.tech. After provisioning, enable the PostGIS extension:

```sql
CREATE EXTENSION IF NOT EXISTS postgis;
```

PostGIS cannot be added via migration. It must be enabled at the database level before migrations run.

Copy the connection string from the Neon dashboard.

---

## 3. Configure server environment variables

Copy `apps/server/.env.example` to `apps/server/.env` and fill in:

- `DATABASE_URL` -- Neon connection string from step 2
- `SESSION_SECRET` -- generate with: `openssl rand -hex 32`
- `CLIENT_URL` -- `http://localhost:3000` for local dev
- `CORS_ORIGIN` -- `http://localhost:3000` for local dev
- `NODE_ENV` -- `development`
- `PORT` -- `3001`

Optional (omit to disable silently):

- `RESEND_API_KEY` -- required for password-reset emails in production
- `RESEND_FROM_EMAIL` -- `noreply@inkatlas.com` in production
- `POSTHOG_API_KEY` -- server-side analytics
- `SENTRY_DSN` -- server error tracking

---

## 4. Configure web environment variables

Copy `apps/client/web/.env.example` to `apps/client/web/.env.local` and fill in:

- `NEXT_PUBLIC_API_URL` -- `http://localhost:3001`

Optional:

- `NEXT_PUBLIC_POSTHOG_KEY` -- client-side analytics
- `NEXT_PUBLIC_SENTRY_DSN` -- client error tracking

---

## 5. Run migrations

```bash
pnpm --filter @ink-atlas/server run migrate:up
```

Creates: `users`, `sessions`, `password_resets` tables plus the shared `set_updated_at` trigger.

---

## 6. Verify the server starts

```bash
pnpm --filter @ink-atlas/server run dev
```

Hit `http://localhost:3001/health` -- expect `{ "status": "ok" }`.
Hit `http://localhost:3001/health/ready` -- expect `{ "status": "ok", "db": "connected" }`.

---

## 7. Verify the web client starts

```bash
pnpm --filter @ink-atlas/web run dev
```

Hit `http://localhost:3000` -- expect the coming soon page.

---

## 8. Run the test suite

```bash
pnpm test
```

All tests should pass on a clean install. If anything is red, fix it before building features.
