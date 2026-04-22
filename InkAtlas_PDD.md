# Ink Atlas | Product Design Document

> **Find your artist. InkAtlas is the city-first tattoo discovery platform built for the way people actually find tattoo artists.**

| | |
|:--|:--|
| **Author** | Ian Greenough |
| **Status** | Concept / Pre-MVP |
| **Updated** | April 2026 |
| **Mission** | The default discovery layer for tattoo artists, city by city. |
| **Tagline** | Find your artist. |
| **Launch city** | Portland, OR |

---

## 1. Executive Summary

InkAtlas is a city-first tattoo discovery platform that solves the fragmented, style-blind way people currently find tattoo artists. Today, finding a tattoo artist means bouncing between Instagram, Google Maps, Yelp, and word-of-mouth — with no unified way to filter by style, neighborhood, budget, or availability.

InkAtlas answers that problem with a focused, tattoo-specific discovery stack: interactive map, curated profiles, style-tagged galleries, and an editorial layer that builds trust and drives organic search. Think of it as the Eater or Resy equivalent for tattoo — a platform that takes the category seriously enough to build natively for it.

**The product is three things at once:**
- A **local editorial guide** that earns trust and organic traffic
- A **searchable marketplace** that lets users filter by style, neighborhood, and availability
- A **map discovery engine** built on PostGIS to make geographic browsing native

**The launch thesis:** Portland first — not because it is easiest, but because it is right. Dense artist market, style-conscious consumers, strong tattoo culture, and a clear SEO opportunity in an underserved local search vertical.

**Strategic principle:** Do not overbuild. Win with search, maps, profiles, galleries, supply density, and distribution. Every feature decision flows from this constraint.

---

## 2. Core Philosophy & Strategic Principle

InkAtlas is a discovery product, not a booking platform. It is not trying to own the transaction — it is trying to own the moment before the decision: when someone is asking "who should I get tattooed by?"

**The discipline:** Do not overbuild.

Win by being the best at a narrow set of things:

| Priority | What we win with |
|:--|:--|
| 1 | Search — style-tagged, city-scoped, fast |
| 2 | Maps — PostGIS-native geographic discovery |
| 3 | Profiles — the canonical artist/shop record |
| 4 | Galleries — image-first browsing |
| 5 | Supply density — 200+ Portland artists before launch |
| 6 | Distribution — editorial SEO + artist sharing loops |

**Avoid early distractions:**

Reviews, messaging systems, native apps, complex subscription tiers, social feeds. These are all fine products. None of them win the discovery problem. Ship them never, or much later.

**City-first rollout:** InkAtlas is not trying to be everywhere at launch. It is trying to be the definitive tattoo resource in Portland first. Depth beats breadth. A thin national product loses to a dense local one. The expansion sequence matters as much as the product.

---

## 3. Target Audience

InkAtlas serves two distinct sides of a marketplace and one editorial audience.

**The Tattoo-Curious Consumer**

Someone who wants a tattoo — or is thinking about it — and does not know where to start. They have seen styles they like on Instagram but have no framework for finding a local artist who matches. They search Google, find generic results, and give up or settle. InkAtlas is the tool they did not know existed.

**The Experienced Collector**

Someone who already has tattoos and is looking for their next artist. They know what they want stylistically. They want to filter — by style, by neighborhood, by shop, by artist. They are not the acquisition target; they are the retention target. Once they find InkAtlas, they come back every time they plan a new piece.

**The Artist / Studio (Supply Side)**

The tattoo artist or shop owner who wants to be discovered. They have a portfolio they are proud of, a booking method, a style they specialize in — and no great way to surface that to people who are actively looking. InkAtlas gives them a profile that is built for how people discover tattoo artists, not for how they discover restaurants or hotels.

**Beachhead audience:** Portland tattoo consumers actively planning their first or next tattoo. Style-conscious, locally anchored, under-served by existing search products.

---

## 4. Product Architecture

### 4.1 — Consumer Features

The user-facing discovery surface. Built to make finding the right artist frictionless.

| Feature | Description |
|:--|:--|
| Search | Full-text and faceted search by style, neighborhood, artist name, shop name. Powered by Typesense/Meilisearch. |
| Interactive Map | Artist and shop pins on a PostGIS-backed map. Geographic browsing as a first-class experience. |
| Artist Profile Pages | Canonical profile for each artist: bio, style tags, shop affiliation, booking link, gallery. |
| Gallery Browsing | Image-first browsing of artist portfolios. The visual layer that drives decisions. |
| Booking Links | External booking links — not owned transaction, just discovery completion. |
| Style + Availability Filters | Filter by tattoo style (blackwork, fine line, traditional, etc.) and availability status. |

### 4.2 — Provider Features

The artist/studio-facing management surface. Built to make claiming and maintaining a profile low-friction.

| Feature | Description |
|:--|:--|
| Claim Profile | Artists verify identity and take ownership of their InkAtlas profile. |
| Upload Portfolio | Direct image upload into the gallery system. Stored in Cloudflare R2. |
| Update Availability | Simple status: taking bookings / waitlist / closed. |
| Manage Contact Links | Booking page, Instagram, email, DM link — whatever the artist uses. |

### 4.3 — Map Engine

The map is not a secondary feature — it is a primary surface. InkAtlas is built on PostGIS from day one, meaning geographic queries are native: "find all fine-line artists within 2 miles of this neighborhood," "show me all shops in NE Portland."

The map and the search index are the same data. A search result is also a map pin. A map pin is also a profile. The three surfaces reinforce each other.

### 4.4 — Search & Discovery Design

InkAtlas search is tattoo-specific first. Generic search tools are not optimized for how people actually search for tattoo artists. InkAtlas builds the taxonomy from the ground up.

**Primary search dimensions:**
- **Style:** The most important filter. Blackwork, fine line, Japanese, traditional, neo-traditional, realism, watercolor, tribal, geometric, illustrative.
- **Location / Neighborhood:** City, neighborhood, proximity to user location.
- **Artist Name:** Direct artist lookup.
- **Shop Name:** Find all artists at a specific shop.
- **Availability:** Only show artists currently taking bookings.

**Canonical style taxonomy:** InkAtlas owns the style tag taxonomy. Every artist is tagged by an InkAtlas editor or via self-submission, not free-form. The taxonomy is the product's competitive moat on the search side — every competitor uses free-form tags; InkAtlas uses a controlled vocabulary.

### 4.5 — Editorial Discovery Layer

The editorial layer is what separates InkAtlas from a directory. It is the trust signal, the traffic engine, and the conversion mechanism.

**Purpose:** Build authority, earn organic traffic, and funnel users into profiles, maps, and bookings.

**Content types:**
- City roundups: *Best Tattoo Studios in Portland*, *18 Essential Tattoo Artists in Seattle*
- Style guides: *Best Fine Line Tattoo Studios in Portland*, *Best Blackwork Artists in Seattle*
- Use-case guides: *Best Walk-In Shops in Portland*, *Where to Get Your First Tattoo in Portland*
- Neighborhood guides: *Portland Neighborhood Tattoo Guide*

**Why editorial works:**
- Ranks in search for high-intent queries
- Earns backlinks from local press and tattoo media
- Gets shared socially by featured artists
- Converts better than raw directories (editorial = trust)
- Feeds users into profiles, maps, and bookings

---

## 5. Tech Stack

| Layer | Technology |
|:--|:--|
| Frontend | Next.js + React + Tailwind |
| Backend | Node.js + Express on Railway |
| Database | PostgreSQL + PostGIS |
| Search | Typesense / Meilisearch |
| Image Storage | Cloudflare R2 |
| Maps | Mapbox or Leaflet (TBD) |
| Analytics | PostHog |
| Error Tracking | Sentry |
| Payments | Stripe |
| Email | Resend |

**Why PostGIS:** Tattoo discovery is inherently geographic. Neighborhood-scoped search, proximity filters, and map-native browsing require proper geographic indexing. PostGIS gives us native geospatial queries without a separate geo service.

**Why Typesense/Meilisearch:** Tattoo-specific search needs fast, faceted results with style-tag filtering. Both options provide sub-100ms search with zero infrastructure overhead at early scale.

---

## 6. Onboarding

### Consumer Onboarding

No account required to browse. The product should be immediately valuable without sign-up friction. Search, browse the map, view profiles, and check out galleries — all without creating an account.

Sign-up is motivated by saving artists, setting style preferences, and receiving availability alerts. The value exchange is clear: give us your email, get notified when your saved artist opens their books.

### Artist / Studio Onboarding (Claim Flow)

Artists discover their pre-seeded profile and claim it via:
1. Email verification
2. Social proof (Instagram link matches the profile's listed social)
3. Activation: 12+ images, style tags, booking/contact method, availability status set

Until an artist claims their profile, InkAtlas displays it as "Unclaimed" with only publicly available information. Once claimed and activated, the profile is promoted in search results and the map.

**Activation requirements:**
- Claimed profile (email verified + social proof)
- 12+ portfolio images uploaded
- At least 1 style tag applied
- Booking or contact method set
- Availability status set

---

## 7. Pricing

### Phase 1 — Free Listings
Seed the market. All profiles are free. The goal is supply density, not revenue.

### Phase 2 — Pro Artist Accounts ($29/mo)
- Priority placement in search results
- Larger image galleries
- Analytics dashboard (profile views, clicks, saves)
- Verified badge

### Phase 3 — Shop SaaS ($99+/mo)
- Multi-artist management
- Lead routing and contact dashboards
- Analytics across all shop artists

### Phase 4 — Sponsored Placements
- Featured placement in category pages and editorial
- Promoted pins on the map

### Phase 5 — Affiliate Commerce / Events
- Flash sale bookings, tattoo conventions, pop-up events
- Affiliate revenue from booking platforms

**Monetization philosophy:** The first cohorts are growth cohorts, not revenue cohorts. Supply density, trust, SEO inventory, and referrals are the Phase 1 deliverables. Revenue follows credibility, not the other way around.

---

## 8. Release Roadmap

Release order follows the city-first model: go deep before going wide.

| Phase | Timeline | Deliverables |
|:--|:--|:--|
| **Portland MVP + Listings** | Months 1–2 | Core product built. 200 Portland artists seeded. No billing yet. |
| **Portland Launch + Monetization** | Months 3–4 | Public launch. Pro accounts live. First editorial content. SEO starts compounding. |
| **Seattle Launch** | Months 5–6 | Replicate the Portland playbook. New editorial content. |
| **City-by-City Expansion** | Months 7–12 | Los Angeles → Denver → Austin → Chicago. Same pattern each time. |

**Rule:** Never launch a city with fewer than 150 seeded profiles. An empty directory is worse than no directory.

---

## 9. Go-to-Market

### Why Portland First
- Dense artist market with strong tattoo culture
- Style-conscious consumer base
- Clear local SEO opportunity in an underserved vertical
- Manageable supply acquisition target (200 artists)

### Expansion Sequence

Portland → Seattle → Los Angeles → Denver → Austin → Chicago

The sequence prioritizes cities with the strongest combination of tattoo culture, dense artist markets, and accessible supply acquisition.

### Primary Acquisition Channels

1. **Programmatic SEO** — City + style pages. *Best Fine Line Tattoo Artists in Portland.* These pages rank, compound, and convert.
2. **Artist Sharing Loops** — Every claimed artist has incentive to share their InkAtlas profile. Each share is a warm referral to the platform.
3. **Short-Form Video** — Artist spotlights, Portland tattoo content, gallery reveals.
4. **Local PR** — Portland alternative press, tattoo media, neighborhood blogs.
5. **Email Retention** — Artist availability alerts keep consumers coming back.
6. **Community Referrals** — Tattoo communities on Reddit, Discord, and Instagram.

### SEO Target Pages

- Best Fine Line Tattoo Artists in Portland
- Walk-In Tattoo Shops Portland
- Japanese Tattoo Seattle
- Tattoo Cost Guide Portland
- Blackwork Tattoo Artists Portland
- Portland Neighborhood Tattoo Guide

---

## 10. Analytics

PostHog is the primary analytics platform. Every feature ships with instrumented events.

**Key events to track:**
- Search queries (with style and location filters)
- Artist profile views
- Gallery image views
- Map pin clicks
- Booking link clicks (**primary conversion event**)
- Artist saves / favorites
- Artist claim flow completions
- Activation completions (12 images, style tags, booking link)
- Editorial page views and time-on-page

**North star metric:** Booking link clicks. This is the moment InkAtlas delivers value to both consumer and artist — the consumer found who they want, the artist gets a potential client.

**Artist-side north star:** Pro conversion rate on claimed profiles. An artist who claims, activates, and upgrades to Pro is the supply-side retention signal.

---

## 11. Key Risks & Mitigations

| Risk | Mitigation |
|:--|:--|
| **Supply-side cold start** — Empty profiles destroy consumer trust | Seed 200 Portland artists before public launch. Never launch a city below 150 profiles. |
| **Data quality** — Outdated or inaccurate info erodes credibility | Build first-party records. Manual research for top studios. Last-reviewed timestamps on every profile. |
| **Artist resistance** — Artists don't claim profiles | Extremely low-friction claim flow. Show concrete value: "Your profile has been viewed X times." Pro tier follows trust, not the other way around. |
| **SEO timeline** — Content takes months to rank | Start publishing before launch. SEO compounds; start the clock early. |
| **Image rights** — Portfolio images from public sources | Only use images artists have explicitly published themselves (their own sites, their own social). Direct upload by claimed artists is the long-term standard. |
| **Platform dependency** — Building on fragile third-party data | First-party canonical database is the insurance policy. External sources are for discovery only, never dependency. |

---

## 12. Success Metrics

| Phase | North Star | Target |
|:--|:--|:--|
| Pre-launch (Months 1–2) | Artist profiles seeded | 200 Portland artists |
| Portland launch (Months 3–4) | Monthly visitors | 2,000–5,000 |
| Seattle launch (Months 5–6) | Monthly visitors | 10,000–20,000 |
| Expansion (Months 7–9) | Monthly visitors | 30,000–50,000 |
| End of year (Months 10–12) | Monthly visitors | 60,000–100,000 |

**Retention signal:** Returning visitors who act on availability alerts. A consumer who saves an artist and comes back when that artist opens their books is the highest-value retention signal available.

**What matters most:**
1. Listing density
2. Image quality
3. Tagging accuracy
4. SEO traffic
5. Artist conversion to Pro
6. Repeat visitors

---

## 13. Glossary

| Term | Definition |
|:--|:--|
| **Artist Profile** | The canonical record for a tattoo artist: bio, style tags, shop, gallery, booking link, availability. |
| **Shop Profile** | The canonical record for a tattoo studio: location, artists, contact, hours. |
| **Style Tag** | A controlled-vocabulary tag from the InkAtlas taxonomy describing a tattoo style (e.g., blackwork, fine line, traditional). |
| **Claim Flow** | The process by which an artist verifies identity and takes ownership of their InkAtlas profile. |
| **Activation** | The requirements (12+ images, style tags, booking link, availability status) that mark a claimed profile as fully live and promoted. |
| **Founding Artist** | An artist in the first 200 Portland profiles. Eligible for the Founding Artist Program (free or discounted Pro tier). |
| **Editorial Layer** | The curated content pages (roundups, guides, neighborhood pages) layered on top of the directory. |
| **PostGIS** | PostgreSQL extension for geographic data. Powers the map engine and proximity search. |
| **Programmatic SEO** | Pages generated at scale from structured data (city + style combinations) to capture long-tail organic search. |
| **Canonical Taxonomy** | InkAtlas's controlled vocabulary for tattoo styles. The moat on the search side. |

---

## 14. Long-Term Vision

InkAtlas's long-term goal is to become the default discovery layer for tattoo artists globally — the platform that both consumers and artists turn to first, in every city, for every style.

The path there is simple and repetitive: go deep in one city, prove the model, expand. Each new city follows the same playbook. The product does not need to reinvent itself; the supply acquisition and editorial execution does the work.

**The defensible moat is not the technology.** It is the depth of the first-party data (artist records, style tags, galleries, availability history) accumulated over time, and the editorial authority earned through consistent, high-quality content in each city. Both are hard to replicate at speed. Both compound.

---

*Confidential — April 2026*

*This is a living document. Business operations, supply acquisition, founding artist programs, financials, and growth strategy live in the Business Operations Document.*
