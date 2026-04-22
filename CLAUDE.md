# InkAtlas

Express + Next.js monorepo for InkAtlas. This file is auto-loaded on every session and contains rules that apply to the whole repo.

---

## Non-Negotiable Rules

These apply to the whole repo with no exceptions.

### 1. Named exports only

Never `export default` anywhere in the codebase. Every file ends with an explicit named export statement.

Exceptions (Next.js requires default exports): `page.tsx`, `layout.tsx`, `loading.tsx`, `error.tsx`, `not-found.tsx`, `template.tsx`, `route.ts`. These are the only exceptions.

**Why:** Default exports make refactoring harder, break tree-shaking analysis, and produce worse error messages.

### 2. No em dashes

U+2014 is banned in every output: code, comments, commit messages, markdown, prompts, tests, docs. Use a period, comma, semicolon, colon, parens, or line break instead. En dashes and hyphens are fine.

Enforce this via a lefthook pre-commit hook (see Lefthook section below). The rule in CLAUDE.md is not enough -- it must be a git hook so it applies on every machine, not just in Claude sessions.

**Why:** Em dashes sneak in via LLM output. A git hook is the only reliable enforcement.

### 3. Alphabetical ordering everywhere

Type definitions, type keys, object keys, JSX props, destructured props, union type members, and imports within each group are all alphabetized. No exceptions.

**Why:** Removes decision fatigue, eliminates merge conflicts from arbitrary reordering, and makes scanning faster. Establish from commit one or you will spend time fighting inconsistency forever.

### 4. Test-first bug fixes

When fixing a bug: write a failing test that reproduces it, make it pass with the smallest change, commit test and fix together. A `fix:` commit that does not include a test file is blocked by lefthook.

**Why:** A bug fixed without a test will be re-introduced. The commit-msg hook makes this non-negotiable.

### 5. Architecture layers -- never skip

The four layers are: `routes` (wire handlers to paths) -> `handlers` (validate input, call services/repos, return HTTP) -> `services` (business logic, call repos + external APIs) -> `repositories` (parameterized SQL, return typed rows).

Handlers never run SQL. Repositories never call handlers. Services never parse HTTP requests. No shortcuts.

**Why:** The moment a handler runs a SQL query directly, the architecture degrades and tests become harder to write. Enforce from the first endpoint.

### 6. Parameterized SQL only

Never interpolate user input into SQL strings. Every query uses `$1`, `$2`, `$3` placeholders. Every query on user-owned data includes `user_id = $N` scoping in the WHERE clause.

```typescript
// WRONG
const result = await query(`SELECT * FROM artists WHERE city = '${city}'`);

// CORRECT
const result = await query('SELECT * FROM artists WHERE city = $1', [city]);
```

**Why:** SQL injection and multi-tenant data leakage are the two most common database bugs. Both are prevented by this single rule.

### 7. Shared types in packages/types/

Any TypeScript type used by two or more surfaces (server, web, any future surface) must be defined in `@repo/types` and imported from there. Never duplicate a type definition across workspaces. If a type starts in one workspace and a second workspace needs it, move it immediately.

**Why:** Type drift between surfaces causes diverged definitions and silent runtime bugs. One source of truth prevents this.

### 8. Test files in src/__tests__/, never beside source files

Every workspace keeps tests in `src/__tests__/` mirroring the source tree. No `Component.test.tsx` next to `Component.tsx`.

```
src/
├── handlers/
│   └── artists.ts
└── __tests__/
    └── handlers/
        └── artists.test.ts
```

**Why:** Co-located test files create noise in component directories and make it harder to see test coverage at a glance.

### 9. Every feature ships a complete checklist

When a user-facing feature ships, before closing the task:

- `docs/feature-list/features.md`: add a row with ship date and status.
- `docs/user-stories/`: create or update a `.md` file with acceptance criteria and an E2E test reference.
- `e2e/`: a Playwright spec covering the acceptance criteria must exist.
- Squash merge onto `main` with a single commit summarizing the whole feature.
- Delete shipped spec and plan files from `docs/superpowers/`.

**Why:** Without this checklist, test coverage drifts, the feature list becomes stale, and the next session has no context on what shipped.

### 10. Squash merge all feature branches

When a feature branch is ready to land on `main`, use `git merge --squash`. Never a regular merge or rebase. One commit per feature on `main`.

**Why:** Keeps main history readable. Work-in-progress commits do not belong on main.

### 11. fix: commits require a test file

If a commit subject starts with `fix:`, `bug:`, `bugfix:`, or `hotfix:`, at least one test file must be staged. Enforced by lefthook.

Infrastructure and config changes use `chore:`, not `fix:`. If a change requires a deploy to verify rather than a unit test, it is `chore:`.

- `chore:` examples: Dockerfile, Railway config, Next.js config, env var renames, dependency changes.
- `fix:` examples: SQL logic bugs, validation errors, rendering bugs with a reproducible test.

### 12. PostGIS from day one

The database is PostgreSQL + PostGIS. Geographic queries (proximity search, neighborhood filtering, bounding boxes) are native from the first migration. Never store lat/lng as plain floats and attempt to do math on them in application code.

The `point` or `geography` column type ships in the `artists` and `shops` tables from migration one. PostGIS is not a later addition.

**Why:** Adding PostGIS after the schema is established requires a migration to convert column types and rewrite all geo queries. Do it right from the start.

### 13. node-pg-migrate default values: bare strings, never double-quoted

```javascript
// WRONG -- produces DEFAULT '''active''' in Postgres (inserts 'active' with embedded quotes)
status: { type: 'varchar(20)', default: "'active'" }

// CORRECT -- produces DEFAULT 'active'
status: { type: 'varchar(20)', default: 'active' }

// CORRECT -- for functions/expressions
created_at: { type: 'timestamptz', default: pgm.func('NOW()') }
```

The `node-pg-migrate` builder API adds its own quoting. Passing a quoted string produces triple-quoted DDL and causes CHECK constraint failures on INSERT.

**Why:** The `node-pg-migrate` builder adds its own quoting. Passing a pre-quoted string produces triple-quoted DDL and causes CHECK constraint failures on INSERT. A lefthook pre-commit hook blocks this mechanically.

### 14. The set_updated_at trigger is created once and reused

In the users table migration, create a shared `set_updated_at()` trigger function. Every subsequent table reuses it rather than defining its own.

```javascript
// In the users migration (once):
pgm.sql(`
  CREATE OR REPLACE FUNCTION set_updated_at()
  RETURNS TRIGGER AS $$
  BEGIN NEW.updated_at = NOW(); RETURN NEW; END;
  $$ LANGUAGE plpgsql;
`);

// In every subsequent table migration:
pgm.sql(`
  CREATE TRIGGER set_updated_at
  BEFORE UPDATE ON artists
  FOR EACH ROW EXECUTE FUNCTION set_updated_at();
`);
```

### 15. Analytics events as typed constants -- no magic strings

All PostHog event names are defined in a typed constants object (e.g., `packages/constants/src/analytics.ts`) and imported from there. Never pass a raw string to `posthog.capture()`.

```typescript
// WRONG
posthog.capture('booking_link_clicked');

// CORRECT
import { ANALYTICS_EVENTS } from '@repo/constants';
posthog.capture(ANALYTICS_EVENTS.BOOKING_LINK_CLICKED);
```

**Why:** Magic strings cause silent tracking failures when names drift between the capture call and the analytics dashboard. Typed constants are caught by TypeScript and refactored safely.

### 16. PostHog events route through a reverse proxy

PostHog events must be routed through an `/analytics` (or similar opaque) path on the InkAtlas domain. Without this, 10-30% of events are silently dropped by ad blockers. The proxy path must be opaque -- never `/analytics`, `/tracking`, `/posthog`, or `/telemetry`, which are on every ad blocker list.

Use a path that matches the product's vocabulary. Suggested: `/atlas` or `/geo`.

**Why:** Without a reverse proxy, 10-30% of events are silently dropped by ad blockers. Early funnel data lost this way is unrecoverable.

### 17. Environment validation at startup

Every server validates required env vars before accepting any traffic:

```typescript
export function validateEnv(): void {
  const required = ['DATABASE_URL', 'SESSION_SECRET'];
  if (isProduction()) {
    required.push('CORS_ORIGIN', 'CLOUDFLARE_ACCOUNT_ID', 'R2_BUCKET_NAME', 'R2_ACCESS_KEY_ID', 'R2_SECRET_ACCESS_KEY');
  }
  for (const key of required) {
    if (!process.env[key]) {
      throw new Error(`Missing required environment variable: ${key}`);
    }
  }
}
```

Call `validateEnv()` at the top of `app.ts` before any middleware registration. A server that boots with missing env vars and then fails on the first request is harder to debug than one that fails immediately on startup.

### 18. Health endpoints on every API service

```typescript
// Fast liveness check. Always returns 200. Railway uses this.
app.get('/health', (_req, res) => {
  res.status(200).json({ status: 'ok' });
});

// Readiness check. Verifies DB connectivity. Used for smoke tests after deploy.
app.get('/health/ready', async (_req, res) => {
  try {
    await query('SELECT 1');
    res.status(200).json({ status: 'ok', db: 'connected' });
  } catch {
    res.status(503).json({ status: 'degraded', db: 'disconnected' });
  }
});
```

Register these before all application routes and before the `notFoundHandler`.

### 19. NODE_ENV must always be explicitly set

Every remote deployment has `NODE_ENV=production`. Never leave it unset or rely on a default. Set it in Railway env vars and CI environments. A server running without `NODE_ENV=production` in production has different behavior for CORS, SSL, cookie flags, and error messages.

### 20. SSL: never set rejectUnauthorized: false

Never use `rejectUnauthorized: false` in any database, Redis, or HTTPS client config. Never set `NODE_TLS_REJECT_UNAUTHORIZED=0`. The correct pattern for PostgreSQL in production:

```typescript
ssl: isProduction()
  ? { rejectUnauthorized: process.env.DATABASE_SSL_REJECT_UNAUTHORIZED !== 'false' }
  : false,
```

**Why:** `rejectUnauthorized: false` silently disables certificate validation in production. Easy to add as a temporary workaround, easy to forget, impossible to notice until it matters.

### 21. CORS: never use wildcard with credentials

Never `origin: '*'` with `credentials: true`. `CORS_ORIGIN` must be set to the exact Railway production URL. Never use a preview or ephemeral URL. Use the stable production domain.

### 22. CSRF: header-only pattern

All state-changing requests (POST, PUT, PATCH, DELETE) require `X-Requested-With: XMLHttpRequest`. The API fetch wrapper attaches this header automatically. A `csrfGuard` middleware rejects requests missing it on mutating methods. No token endpoint required.

### 23. Session cookies: correct SameSite and Secure flags

```typescript
res.cookie('sid', token, {
  httpOnly: true,
  maxAge: 7 * 24 * 60 * 60 * 1000,
  sameSite: isProduction() ? 'none' : 'lax',
  secure: isProduction(),
});
```

`SameSite: 'lax'` is the correct default when the frontend and backend share the same Railway domain. If ever running the client and server on separate domains (e.g., during testing), switch to `SameSite: 'none'` + `secure: true` or configure same-origin rewrites.

**Why:** The fix is trivial; finding it is not. Get it right from the start.

### 24. Per-component folder structure

Every component lives in its own folder: `ComponentName/ComponentName.tsx` plus `ComponentName.module.scss`. Never a flat `.tsx` directly under `components/`.

```
components/
├── ArtistCard/
│   ├── ArtistCard.tsx
│   └── ArtistCard.module.scss
└── MapPin/
    ├── MapPin.tsx
    └── MapPin.module.scss
```

### 25. displayName and data-test-id on every component

Every component sets `ComponentName.displayName = 'ComponentName'` immediately after the function definition. The outermost rendered DOM element has `data-test-id='component-name'` in kebab-case. List items append a unique identifier.

```tsx
function ArtistCard({ artistId, name }: ArtistCardProps) {
  return <div data-test-id={`artist-card-${artistId}`}>...</div>;
}
ArtistCard.displayName = 'ArtistCard';
export { ArtistCard };
```

### 26. TanStack Query for all server state

No raw `useEffect` + `fetch` in components. All API calls go through `useQuery` and `useMutation`. The only exception is background/service worker contexts that run outside React.

**Why:** Raw `useEffect` + `fetch` patterns cause race conditions, missing loading states, and cache inconsistency. Enforced from the first data-fetching component.

### 27. Cloudflare R2 for all image storage

All uploaded artist portfolio images are stored in Cloudflare R2, not in the database or on the server filesystem. File metadata (key, size, content type, upload date) is stored in the `gallery_images` table. The R2 key is the source of truth; the URL is derived from it.

```typescript
const key = `artists/${artistId}/${uuid()}.${ext}`;
await r2.send(new PutObjectCommand({ Bucket: process.env.R2_BUCKET_NAME, Key: key, Body: file }));
// Store key in DB, not the full URL
```

Never store full URLs in the database. URLs change (CDN migration, custom domains). Keys do not.

### 28. Sentry on both server and client from day one

Initialize Sentry in both `apps/server/src/app.ts` and `apps/client/web/src/app/layout.tsx` before any business logic. Sentry captures unhandled errors in production that would otherwise be invisible.

Server:
```typescript
Sentry.init({ dsn: process.env.SENTRY_DSN, environment: process.env.NODE_ENV });
```

Client:
```typescript
Sentry.init({ dsn: process.env.NEXT_PUBLIC_SENTRY_DSN, environment: process.env.NODE_ENV });
```

Set the Sentry user context in the `loadSession` middleware so every error is associated with a user ID. Clear user context on session destroy.

**Why:** Without Sentry, production errors leave no trail and must be reproduced from scratch.

### 29. Commit pnpm-lock.yaml with every package.json change

CI uses `--frozen-lockfile`. If `pnpm-lock.yaml` is not committed alongside `package.json`, the build fails. These two files are always committed together.

### 30. Build runs on pre-push

The pre-push hook runs `pnpm build`. A broken build never lands on `main`.

---

## Tooling Setup Checklist

The following must be configured from commit one. These are not "add later" tasks. A project that ships without them pays the setup cost in production bugs.

### ESLint

- `@typescript-eslint/eslint-plugin` with `strictTypeChecked` ruleset.
- `eslint-plugin-unused-imports` -- unused imports are an error, not a warning.
- `curly: 'error'` -- always use braces on if/else/for/while.
- `@typescript-eslint/no-explicit-any` -- no `any`, ever. Use `unknown` and narrow.
- `@typescript-eslint/naming-convention` -- camelCase for functions and variables, PascalCase for types and components.
- Lint warnings are build failures. CI must run `pnpm lint --max-warnings=0`.

### Prettier

```json
{
  "singleQuote": true,
  "jsxSingleQuote": true,
  "semi": true,
  "trailingComma": "all",
  "tabWidth": 2,
  "useTabs": false,
  "printWidth": 80,
  "arrowParens": "always",
  "bracketSpacing": true
}
```

Add `format:check` to CI. A repo without enforced formatting is a merge conflict factory.

### Lefthook

`lefthook.yml` at the repo root must include at minimum:

```yaml
pre-commit:
  parallel: true
  commands:
    lint-server:
      glob: 'apps/server/**/*.{ts,js}'
      run: pnpm --filter ./apps/server run lint
    lint-web:
      glob: 'apps/client/web/**/*.{ts,tsx}'
      run: pnpm --filter ./apps/client/web run lint
    format-check:
      glob: '**/*.{ts,tsx,js,scss}'
      run: pnpm format:check
    no-em-dash:
      glob: '*.{ts,tsx,js,md,scss}'
      run: |
        EMDASH=$(printf '\xe2\x80\x94')
        if grep -rn "$EMDASH" {staged_files} 2>/dev/null; then
          echo 'Em dash (U+2014) found. Use a period, comma, or colon instead.'
          exit 1
        fi
    migration-defaults:
      glob: '**/migrations/**/*.{ts,js}'
      run: |
        pattern="default:\s*[\"'].*[\"'].*[\"']"
        if grep -En "$pattern" {staged_files} 2>/dev/null; then
          echo 'ERROR: Migration default appears double-quoted. Use bare strings or pgm.func().'
          exit 1
        fi

commit-msg:
  commands:
    fix-requires-test:
      run: |
        subject=$(head -1 {1})
        if echo "$subject" | grep -qE '^(fix|bug|bugfix|hotfix)(\(.+\))?!?:'; then
          if ! git diff --cached --name-only | grep -qE '\.(test|spec)\.(ts|tsx|js)$'; then
            echo 'fix: commits require at least one test file staged.'
            exit 1
          fi
        fi

pre-push:
  commands:
    build:
      run: pnpm build
```

These hooks are the enforcement layer. Rules documented only in CLAUDE.md are not enforced on other machines or in other tools.

### PostHog

- Install `posthog-node` on the server. Use server-side tracking for all meaningful business events (search performed, booking link clicked, artist profile claimed, pro conversion).
- Install `posthog-js` on the client for pageview and UI interaction tracking.
- All event names are typed constants in `packages/constants/src/analytics.ts`. No magic strings.
- Route all PostHog traffic through a reverse proxy at an opaque path (e.g., `/atlas`). Configure this before launch. Retroactive setup loses early funnel data.
- Thumbs up/down feedback ships with every user-facing result from the first commit. Feedback is not a post-launch addition.

### Sentry

- Install `@sentry/node` on the server, `@sentry/nextjs` on the web client.
- Initialize before any business logic in both `app.ts` (server) and `layout.tsx` (client).
- Set `environment: process.env.NODE_ENV` in both initializations.
- Wire Sentry user context in `loadSession` middleware -- errors should always be attributed to a user.
- Source maps must be uploaded to Sentry in CI on every production deploy. Without source maps, stack traces are minified and useless.

### Cloudflare R2

- Create the R2 bucket and API token before writing any image upload code.
- Add a Cloudflare Images CDN domain in front of R2 for public read (custom domain, not the default R2 URL, which can be blocked).
- All environment variables (`R2_BUCKET_NAME`, `R2_ACCOUNT_ID`, `R2_ACCESS_KEY_ID`, `R2_SECRET_ACCESS_KEY`, `R2_PUBLIC_URL`) are validated at startup via `validateEnv()`.
- Image keys follow a consistent path scheme: `{entity-type}/{entity-id}/{uuid}.{ext}`. Example: `artists/abc123/img456.jpg`.
- Store keys in the database, not full URLs. Derive the public URL at read time from `R2_PUBLIC_URL + key`.
- File size limits and MIME type validation happen on the server before the R2 upload, not after.

### Typesense / Meilisearch

- The search index is not a secondary concern. It is a primary product surface. Configure the search client and define index schemas before writing any search UI.
- Define all searchable fields, filterable attributes, and sortable attributes explicitly in the index schema. Do not rely on auto-indexing.
- InkAtlas requires: `style_tags` (filterable), `city` (filterable), `neighborhood` (filterable), `is_taking_bookings` (filterable), `artist_name` (searchable), `shop_name` (searchable).
- The search index is populated via a background job triggered on artist profile creation/update. Never index synchronously in the HTTP request handler.

### Railway (Server Deployment)

```
Railway Project
├── api        # Express/TypeScript server
├── postgres   # Managed Postgres (with PostGIS extension enabled)
└── redis      # Managed Redis (for BullMQ background jobs)
```

- Enable the PostGIS extension in the Railway Postgres service on day one. It cannot be added to a migration; it must be enabled at the database level.
- Run migrations as a `prestart` script, not a separate deploy step. Keeps migration and deployment atomic.
- Railway healthcheck path: `/health`.
- Set all env vars before the first deploy. A deploy with missing vars is not a deploy.

### Railway (Web Deployment)

The Next.js frontend deploys as a separate Railway service within the same project, alongside the API, Postgres, and Redis services:

```
Railway Project
├── api        # Express/TypeScript server
├── web        # Next.js frontend
├── postgres   # Managed Postgres (with PostGIS extension enabled)
└── redis      # Managed Redis (for BullMQ background jobs)
```

- Set the root directory to `apps/client/web/` in the Railway service settings.
- Set `NODE_ENV=production` on both `api` and `web` services.
- Set all env vars on both services before the first deploy.
- If the frontend and API share a Railway domain, cookies use `SameSite: 'lax'`. No same-origin rewrite hack required when they run under the same domain.
- Railway healthcheck path for the API service: `/health`. The web service uses Railway's default Next.js health check.

---

## Auth Boilerplate

Auth must be present from commit one. It is not a post-MVP addition. Every feature that touches user data depends on session context. Do not build any user-facing functionality before the auth system is wired.

### Architecture overview

InkAtlas uses custom cookie sessions. No Passport.js. No NextAuth. No JWT. A `sid` cookie holds a raw token; the database stores only its SHA-256 hash.

```
POST /auth/register     -> create user + session in transaction
POST /auth/login        -> authenticate + issue session cookie
POST /auth/logout       -> delete session + clear cookie
GET  /auth/me           -> return current user (requires auth)
PATCH /auth/me          -> update current user profile (requires auth)
POST /auth/forgot-password  -> email reset token (rate limited)
POST /auth/reset-password   -> consume token + set new password (rate limited)
```

### Database migrations (ship in this order)

**Migration 1: create-users**

```javascript
export const up = (pgm) => {
  pgm.sql(`
    CREATE OR REPLACE FUNCTION set_updated_at()
    RETURNS TRIGGER AS $$
    BEGIN NEW.updated_at = NOW(); RETURN NEW; END;
    $$ LANGUAGE plpgsql;
  `);

  pgm.createTable('users', {
    id: { default: pgm.func('gen_random_uuid()'), primaryKey: true, type: 'uuid' },
    email: { notNull: true, type: 'text', unique: true },
    email_verified: { default: false, notNull: true, type: 'boolean' },
    password_hash: { type: 'text' },
    created_at: { default: pgm.func('NOW()'), notNull: true, type: 'timestamptz' },
    updated_at: { default: pgm.func('NOW()'), notNull: true, type: 'timestamptz' },
  });

  pgm.createIndex('users', 'email');

  pgm.sql(`
    CREATE TRIGGER set_users_updated_at
    BEFORE UPDATE ON users
    FOR EACH ROW EXECUTE FUNCTION set_updated_at();
  `);
};
```

**Migration 2: create-sessions**

```javascript
export const up = (pgm) => {
  pgm.createTable('sessions', {
    id: { default: pgm.func('gen_random_uuid()'), primaryKey: true, type: 'uuid' },
    user_id: { notNull: true, onDelete: 'CASCADE', references: 'users', type: 'uuid' },
    token_hash: { notNull: true, type: 'text', unique: true },
    expires_at: { notNull: true, type: 'timestamptz' },
    created_at: { default: pgm.func('NOW()'), notNull: true, type: 'timestamptz' },
  });

  pgm.createIndex('sessions', 'token_hash');
  pgm.createIndex('sessions', 'user_id');
  pgm.createIndex('sessions', 'expires_at');
};
```

**Migration 3: create-password-resets**

```javascript
export const up = (pgm) => {
  pgm.createTable('password_resets', {
    id: { default: pgm.func('gen_random_uuid()'), primaryKey: true, type: 'uuid' },
    user_id: { notNull: true, onDelete: 'CASCADE', references: 'users', type: 'uuid' },
    token_hash: { notNull: true, type: 'text', unique: true },
    expires_at: { notNull: true, type: 'timestamptz' },
    used_at: { type: 'timestamptz' },
    created_at: { default: pgm.func('NOW()'), notNull: true, type: 'timestamptz' },
  });

  pgm.createIndex('password_resets', 'token_hash');
};
```

### Session constants (`apps/server/src/constants/session.ts`)

```typescript
export const SESSION_COOKIE_NAME = 'sid';
export const SESSION_TTL_MS = 7 * 24 * 60 * 60 * 1000; // 7 days
```

### Auth repository (`apps/server/src/repositories/auth/auth.ts`)

The complete repository: `createUser`, `findUserByEmail`, `findUserById`, `getPasswordHashById`, `verifyPassword`, `createSession`, `getSessionWithUser`, `deleteSession`, `deleteSessionsForUser`, `deleteExpiredSessions`, `loginUser`, `authenticate`, `createUserAndSession`, `createPasswordResetToken`, `findPasswordResetByToken`, `markPasswordResetUsed`, `updateUserPassword`.

Key patterns:
- Tokens are stored as `crypto.createHash('sha256').update(token).digest('hex')`. The raw token goes in the cookie; the hash goes in the DB. A DB dump never exposes live session tokens.
- `createUserAndSession` wraps user creation and session creation in a single `withTransaction` call. Never create them separately -- the race condition leaves orphan users.
- `authenticate` returns `null` for both wrong email AND wrong password. Never distinguish which case failed. Prevents user enumeration.
- `loginUser` deletes only expired sessions for the user, then creates a new one. Allows concurrent sessions (multiple devices).
- Password reset tokens expire in 1 hour. `markPasswordResetUsed` must be called before `deleteSessionsForUser` on successful reset -- invalidate all active sessions to force re-login after a password change.
- bcrypt salt rounds: 12.

### Session cookie options

```typescript
export function sessionCookieOptions() {
  return {
    httpOnly: true,
    maxAge: SESSION_TTL_MS,
    path: '/',
    sameSite: isProduction() ? ('none' as const) : ('lax' as const),
    secure: isProduction(),
  };
}
```

`SameSite: 'lax'` is correct when the frontend and backend run on the same Railway domain. If they ever run on different domains (e.g., external CDN, cross-domain testing), switch to `SameSite: 'none'` + `secure: true`.

### Middleware (`apps/server/src/middleware/`)

**`loadSession`**: runs on every request. Reads the `sid` cookie (or `Authorization: Bearer` header for token mode). Calls `authRepo.getSessionWithUser()`. If valid, sets `req.user` and `Sentry.setUser()`. Never blocks the request -- unauthenticated requests pass through with `req.user` undefined.

**`requireAuth`**: runs on protected routes. If `req.user` is undefined, returns `401 { error: { message: 'Authentication required' } }`. Wire as express middleware on any route that requires a logged-in user.

Register `loadSession` globally in `app.ts` (after cookie-parser, before routes). Register `requireAuth` per-route where needed.

### Express route file (`apps/server/src/routes/auth.ts`)

```typescript
authRouter.post('/register', authRateLimiter, authHandlers.register);
authRouter.post('/login', authRateLimiter, authHandlers.login);
authRouter.post('/logout', authHandlers.logout);
authRouter.get('/me', requireAuth, authHandlers.me);
authRouter.patch('/me', requireAuth, authHandlers.patchMe);
authRouter.post('/forgot-password', forgotPasswordRateLimiter, authHandlers.forgotPassword);
authRouter.post('/reset-password', resetPasswordRateLimiter, authHandlers.resetPassword);
```

Rate limit `register`, `login`, `forgot-password`, and `reset-password`. No rate limit on `logout` or `me`.

### Handler security rules

- `register`: catch Postgres error code `'23505'` (unique violation) and return 409 with "Email already registered". Never re-throw the raw Postgres error.
- `login`: return 401 with "Invalid email or password" on failure. Never say which field was wrong.
- `logout`: clear both `sid` and any admin cookie. Use `res.clearCookie()` with the same options (except `maxAge: undefined`). Always return 204 -- even if no session existed.
- `forgotPassword`: always return 200 regardless of whether the email exists. Never confirm or deny email registration.
- `resetPassword`: check `used_at` AND `expires_at`. If either fails, return 400. On success: update password, mark token used, delete all sessions for the user.

### Next.js middleware (`apps/client/web/src/middleware.ts`)

Centralize all route access control here. Pattern: a `ROUTE_MAP` (exact path to `'public' | 'private' | 'admin'`) plus `PREFIX_RULES` for dynamic segments. Default to `'private'` for any path not in either list -- fail safe.

```typescript
function middleware(request: NextRequest): NextResponse {
  const access = resolveAccess(request.nextUrl.pathname);
  if (access === 'public') return NextResponse.next();
  const sid = request.cookies.get('sid');
  if (!sid) return NextResponse.redirect(new URL('/login', request.url));
  // ... admin check ...
  return NextResponse.next();
}
```

The middleware does a cookie presence check only -- it cannot verify the session against the DB (no async access). Real auth validation happens in the `(protected)` layout server component.

Auth pages (`/login`, `/register`, `/forgot-password`, `/reset-password`) are always `'public'` in `ROUTE_MAP`.

### Route groups

```
app/
├── (auth)/
│   ├── login/
│   │   └── page.tsx
│   ├── register/
│   │   └── page.tsx
│   ├── forgot-password/
│   │   └── page.tsx
│   ├── reset-password/
│   │   └── page.tsx
│   ├── loading.tsx       # shared auth loading state
│   └── auth.module.scss  # shared auth page styles
├── (protected)/
│   ├── layout.tsx        # server component: fetches /auth/me, redirects to /login if null
│   └── ...               # all authenticated pages go here
└── layout.tsx            # root layout: providers, Sentry, PostHog init
```

The `(auth)` route group has no layout -- it renders pages directly. The `(protected)` layout is a server component that calls `GET /auth/me` and redirects to `/login` if the user is not authenticated. This is the real auth gate, not the Next.js middleware.

### Protected layout (server component)

```typescript
async function ProtectedLayout({ children }) {
  const queryClient = createServerQueryClient();
  const cookie = await getServerCookie();

  const user = await queryClient.fetchQuery({
    queryFn: async () => {
      const response = await serverFetch('/auth/me', cookie);
      return response?.user ?? null;
    },
    queryKey: ['auth', 'me'],
  });

  if (!user) redirect('/login');

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      {children}
    </HydrationBoundary>
  );
}
```

Hydrate the `['auth', 'me']` query from the server so the client does not make a redundant `/auth/me` call on first render.

### `useAuth` hook (`apps/client/web/src/state/useAuth.ts`)

Wraps all auth operations in TanStack Query mutations. Query key: `['auth', 'me']`. On successful login/register: call `posthog.identify(user.id)`. On logout: call `posthog.reset()`.

Exposed API: `{ user, isLoading, login, logout, register, patchMe }`. No raw `fetch` calls in components -- everything goes through this hook.

### Shared auth page styles (`(auth)/auth.module.scss`)

All four auth pages share a single SCSS module. Common classes: `.form`, `.field`, `.label`, `.input`, `.error`, `.hint`, `.footer`, `.link`, `.successMessage`, `.passwordWrapper`, `.togglePassword`.

### Password reset email

Use Resend. The reset URL is `${CLIENT_URL}/reset-password?token=${rawToken}`. Token is raw (not hashed) in the URL. Token is 32 random bytes as hex. Expiry: 1 hour.

The `CLIENT_URL` env var must be set in Railway. Default to `http://localhost:3000` in development only.

### Resend email service (`apps/server/src/services/email.ts`)

```typescript
import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

export async function sendEmail({ to, subject, html }: { to: string; subject: string; html: string }) {
  await resend.emails.send({
    from: 'InkAtlas <noreply@inkatlas.com>',
    html,
    subject,
    to,
  });
}
```

`RESEND_API_KEY` is required in production (`validateEnv()` must include it).

### express.d.ts type augmentation

```typescript
// apps/server/src/types/express.d.ts
import type { User } from '@repo/types';

declare global {
  namespace Express {
    interface Request {
      user?: User;
    }
  }
}
```

Without this, `req.user` is not typed and TypeScript errors on every handler.

---

## Docs Directory Structure

```
docs/
├── superpowers/
│   ├── specs/       # Design specs (one per feature, date-prefixed)
│   └── plans/       # Implementation plans (one per feature, date-prefixed)
├── todos/
│   ├── P0-launch-blockers.md
│   ├── P1-high-value-post-launch.md
│   ├── P2-nice-to-have.md
│   └── P3-later.md
├── user-stories/    # Acceptance criteria for every user flow
├── feature-list/    # Feature velocity tracking (features.md)
├── recurring-bugs/  # Known bugs with repro steps and fixes
├── session-handoff/ # Current session state (one file, overwritten each session)
└── query-params.md  # All client route query params documented
```

Rules:

- Todos are the single source of truth for work. All work items live in one of the four priority files. Nothing else is a todo list.
- Every new route query param is documented in `docs/query-params.md` in the same commit that adds it.
- Shipped specs and plans are deleted. The code is the spec once it ships.
- Audit findings go into the appropriate priority file, then the audit file is deleted.
- `docs/session-handoff/session-handoff.md` is the single current handoff. Previous handoffs are in git history.

---

## Stack Reference

| Layer | Technology |
|:--|:--|
| Frontend | Next.js 15 (App Router) + React 19 |
| Styling | SCSS Modules + CSS custom properties |
| State | TanStack Query (server state), React Context (auth/app state) |
| Backend | Express 5 + TypeScript on Railway |
| Database | PostgreSQL + PostGIS on Neon |
| Migrations | node-pg-migrate (ESM, builder API) |
| Search | Typesense (or Meilisearch) |
| Images | Cloudflare R2 |
| Analytics | PostHog (server-side via posthog-node) |
| Error tracking | Sentry (@sentry/node + @sentry/nextjs) |
| Background jobs | BullMQ on Railway Redis |
| Payments | Stripe (subscriptions) |
| Email | Resend |
| Auth | Custom cookie sessions (SHA-256 hashed, 7-day TTL, httpOnly) |
| CI/CD | GitHub Actions + Railway (staging auto, production manual) |
| Package manager | pnpm workspaces |

---

*This file is the source of truth for repo-wide conventions. Workspace-specific CLAUDE.md files layer on top of it. If a workspace rule and this file conflict, this file wins.*
