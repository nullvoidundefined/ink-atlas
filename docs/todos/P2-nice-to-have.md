# P2: Nice to Have

Post-launch or pre-launch if there is time. Not blocking.

---

## 1. E2E tests for password reset flow

Playwright spec covering: request reset email, receive link, set new password, verify old password rejected, verify new password accepted.

---

## 2. Smoke test script

`scripts/smoke-test.sh` that starts all services and verifies:
- `GET /health` returns 200
- `GET /health/ready` returns 200 with `db: connected`
- `POST /auth/login` with bad credentials returns 401

---

## 3. User story docs

`docs/user-stories/` entries for: password reset flow, profile update, artist discovery, image upload.

---

## 4. PostHog reverse proxy path

Verify the `/ingest` proxy path is opaque enough to avoid ad blockers. Rename to `/atlas` or similar if not.

---

## 5. Sentry source maps in CI

Upload source maps to Sentry on every production deploy. Without them, stack traces in production are minified and useless.

---

## 6. Stripe integration

Subscriptions for artist pro features (claiming profiles, priority search placement, booking link). Set up Stripe products and price IDs before writing any payment UI.
