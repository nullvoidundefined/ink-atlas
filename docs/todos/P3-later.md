# P3: Later

Good ideas. Not now.

---

## 1. BullMQ background jobs

Search index sync on artist profile create/update. Image processing (resize, optimize) after R2 upload. Never do these synchronously in the HTTP request handler.

---

## 2. Admin panel

Claim verification queue, content moderation, featured artist curation.

---

## 3. Artist claiming flow

Artists claim their profile via email verification. Unclaimed profiles are seeded from public data; claimed profiles are editable by the artist.

---

## 4. Proximity search

"Artists near me" using PostGIS `ST_DWithin`. Already supported by the geography column in the `artists` table.

---

## 5. Neighborhood filtering

Curated neighborhood taxonomy per city. Pre-seed common neighborhoods; artists can tag their location from the list.

---

## 6. Booking integrations

Direct links to Square Appointments, Fresha, or custom booking pages. Surface `is_taking_bookings` prominently in search results.

---

## 7. Mobile web optimization

Responsive layout for the map/grid toggle, touch-friendly gallery viewer, mobile-first search filters.

---

## 8. Status page

Better Uptime or statuspage.io. Monitor: Railway API, Railway web, Neon database availability. Link from footer and error pages.
