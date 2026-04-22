# Session Handoff

**Date:** 2026-04-22

**Last commit:** Initial commit

**Production state:** Not deployed.

---

## Status: INITIALIZED

Monorepo scaffold with full auth boilerplate. Ready for feature development.

### What exists

- `apps/server`: Express 5 + TypeScript, custom session auth, node-pg-migrate, PostHog, Sentry, Resend
- `apps/client/web`: Next.js 15 App Router, SCSS Modules, TanStack Query, PostHog, Sentry
- `packages/types`, `packages/constants`, `packages/tokens`, `packages/client-shared`
- Lefthook pre-commit hooks: lint, format, em-dash scan, migration default guard
- GitHub Actions CI: lint, format, test, build, E2E

---

## Pending Work

- Configure `.env` files from `.env.example` in `apps/server` and `apps/client/web`
- Set up local Postgres database and run migrations
- Run `pnpm install` to install dependencies
- Define InkAtlas design tokens and styles
