# P1: High Priority

Ship these after P0. Core product surfaces that must exist before anything is shown to users.

---

## 1. InkAtlas design system

Define the full token set and global styles. Black/white/neutral-gray palette. No accent color -- the artwork provides the color. Square borders, stark typography, generous whitespace.

- Design tokens in `packages/tokens/src/tokens.ts`
- Regenerate `dist/_tokens.scss`
- Update `globals.scss`, `auth.module.scss`, `Button.module.scss`

---

## 2. Artist profile data model

Core schema: `artists` table with PostGIS geography column from migration one. Never lat/lng floats.

Fields: `id`, `user_id`, `name`, `bio`, `city`, `neighborhood`, `location` (geography), `style_tags` (text[]), `instagram_handle`, `booking_url`, `is_taking_bookings`, `is_claimed`, `created_at`, `updated_at`.

---

## 3. Shop data model

`shops` table. Fields: `id`, `name`, `city`, `neighborhood`, `location` (geography), `website`, `instagram_handle`, `created_at`, `updated_at`.

Junction table: `artist_shop_affiliations` (`artist_id`, `shop_id`, `is_primary`).

---

## 4. Gallery images

`gallery_images` table. Fields: `id`, `artist_id`, `r2_key`, `content_type`, `size_bytes`, `width`, `height`, `display_order`, `uploaded_at`.

R2 bucket + CDN domain must be created before any image upload code is written. See CLAUDE.md rule 27.

---

## 5. Search index schema

Define Typesense (or Meilisearch) index before writing any search UI. Searchable: `artist_name`, `shop_name`. Filterable: `style_tags`, `city`, `neighborhood`, `is_taking_bookings`. Sortable: `created_at`.

---

## 6. Cloudflare R2 setup

Create R2 bucket and API token. Add CDN domain in front of R2 for public reads. Add env vars to server: `R2_BUCKET_NAME`, `R2_ACCOUNT_ID`, `R2_ACCESS_KEY_ID`, `R2_SECRET_ACCESS_KEY`, `R2_PUBLIC_URL`. Validate at startup via `validateEnv()`.

---

## 7. Railway project setup

```
Railway Project: ink-atlas
├── api        # Express server
├── web        # Next.js frontend
├── postgres   # Managed Postgres (enable PostGIS after provisioning)
└── redis      # Managed Redis (for BullMQ)
```

Set `NODE_ENV=production` on both `api` and `web` services. Set all env vars before first deploy.
