# 🏢 Ink Atlas | Business Operations Document

## Purpose

This document covers the operational and business structure of InkAtlas as a company — separate from the product design. The PDD governs what we build. This document governs how we run: supply acquisition, founding artist programs, revenue, costs, growth, and milestones.

---

## 1. Partnership Structure

**Founder:** Ian Greenough

**Role:** Full-stack founder. Product, engineering, infrastructure, supply acquisition, editorial strategy, and growth. Solo at this stage.

**Equity / vesting:** [TBD — document the moment a co-founder or significant contributor joins. A handshake is not a partnership agreement.]

**Decision rights:** [TBD — single founder at launch. Define when this becomes relevant.]

**IP assignment:** All code, content, and brand assets created for InkAtlas are owned by the business entity, not personally.

> **Action item:** Define and document any equity agreements before revenue exceeds $1K MRR. Get it in writing, even if it's a simple one-page document.

---

## 2. Entity & Incorporation

**Target entity type:** Wyoming LLC

**Why Wyoming:**
- No state income tax
- Strong privacy protections (no public disclosure of member names)
- Low annual fees (~$60/yr registered agent + $60/yr annual report)
- Favorable for single-member LLCs
- Remote formation available

**Registered agent:** [TBD — Northwest Registered Agent or Registered Agents Inc., ~$100–150/yr]

**EIN:** [TBD — apply after LLC formation. Required for Stripe, business bank account, and tax filing. Free, ~10 minutes online.]

**Operating agreement:** [TBD — governs profit distribution, IP assignment, dissolution. Wyoming does not require public filing, but it must exist.]

**Status:** Not yet incorporated.

> **Action item:** Form the Wyoming LLC before revenue exceeds $1K MRR.

---

## 3. Supply Acquisition Strategy

### Data Policy

InkAtlas does not rely on scraping third-party platforms as its core data backbone. External sources are used for discovery and verification only. InkAtlas maintains an independent, first-party canonical database.

**Approved sources:**
- Official APIs where available
- Public shop websites
- Public artist websites and booking pages
- Direct profile submissions from artists
- Manual concierge research
- Public social links (Instagram, etc.) used for verification only

**Avoid as core strategy:**
- Large-scale scraping of Google Maps, Yelp, or similar platforms
- Copying third-party reviews or photos into permanent storage
- Building data dependency on any single external platform

### Canonical Data Model

InkAtlas maintains first-party records for:
- Artists
- Shops
- Locations
- Style tags
- Gallery metadata
- Availability
- Verification status
- Last reviewed timestamps

**Competitive moat:** External platforms help identify entities. InkAtlas wins through tattoo-specific metadata, curation, search quality, and claimed profiles. The first-party database is the product, not the discovery mechanism.

### Portland Supply Acquisition Goal

**Target:** 200 Portland artists before meaningful consumer launch.

**Priority:** Artist density first. Users choose artists more than shops.

**Sources for Portland data:**
- Shop websites (most Portland shops list their resident artists publicly)
- Public portfolios (personal sites, booking pages)
- Social profiles (Instagram links, contact info)
- Public map listings (used for discovery only, not as a dependency)

**Manual concierge approach for top studios:** For the 20–30 highest-profile Portland shops, conduct direct outreach alongside profile creation. Warm relationships with key studios drive artist referrals and early claim activity.

---

## 4. Founding Artist Program

### Portland Launch

The first cohorts are growth cohorts, not revenue cohorts. They buy: supply density, trust, SEO inventory, referrals, and marketplace credibility.

| Cohort | Terms |
|:--|:--|
| First 100 artists | Free for 12 months after activation, then legacy discounted pricing |
| Second 100 artists | 50% off for 12 months, then full pricing |

### Activation Requirements

A profile is not "active" and does not receive program benefits until the artist completes all of the following:
- Claimed profile (email verified + social proof)
- 12+ portfolio images uploaded
- At least 1 style tag applied
- Booking or contact method set
- Availability status set

### Why This Works

Founding artist programs create urgency ("join the first 100"), generate supply density before consumer launch, and give early artists a genuine reason to refer peers. The first 200 artists who activate are also InkAtlas's most powerful distribution channel — each one has an audience of fans and peers who might follow.

**The goal is not 200 claimed profiles at launch.** It is 200 seeded profiles (good enough to browse) at launch, with the claim flow underway. Claimed and activated profiles get priority placement as they come in.

---

## 5. Financials

### Bank Accounts

**Current state:** Personal bank account (commingled — not recommended).

**Immediate action:** Open a second personal bank account dedicated exclusively to InkAtlas. Route all Stripe payouts here. Pay all business expenses from this account (Railway, Neon, Cloudflare, Stripe fees, domain). Transfer a fixed monthly amount to personal account as draw.

**Post-incorporation:** Open a business bank account in the LLC's name. Migrate everything. The dedicated personal account becomes unnecessary.

### Revenue Model

| Phase | Product | Price |
|:--|:--|:--|
| Phase 1 | Free listings | $0 |
| Phase 2 | Pro Artist Accounts | $29/mo |
| Phase 3 | Shop SaaS | $99+/mo |
| Phase 4 | Sponsored placements | Variable |
| Phase 5 | Affiliate commerce / events | Variable |

### Cost Structure (Monthly Estimates — Early Stage)

| Category | Service | Est. Monthly Cost |
|:--|:--|:--|
| Hosting (backend) | Railway | $20–50 |
| Hosting (frontend) | Vercel | $20 (Pro) |
| Database | Neon (PostgreSQL + PostGIS) | $19–39 |
| Search | Typesense Cloud or Meilisearch | $25–50 |
| Image storage | Cloudflare R2 | $5–15 |
| Analytics | PostHog | $0 (free tier) |
| Error tracking | Sentry | $0 (free tier) |
| Domain | Cloudflare | ~$1 |
| Stripe fees | Stripe | ~3% of revenue |
| **Total** | | **~$90–175/mo** |

**Infrastructure is lean.** Unlike an LLM-powered product, InkAtlas does not have inference costs at this stage. The primary drivers are hosting, database, and search. Margin at early revenue is high.

### Revenue Targets

| MRR Target | What it requires |
|:--|:--|
| $1,000 MRR | ~35 Pro Artist accounts at $29/mo |
| $3,000 MRR | ~103 Pro Artist accounts |
| $5,000 MRR | ~172 Pro Artist accounts or mix of Pro + Shop SaaS |

### Founder Compensation

**Pre-revenue:** $0. Working unpaid.

**Post-revenue:** [TBD — no founder draw until MRR exceeds $2,000/mo with 3 months of runway in reserve.]

---

## 6. Growth Strategy

### Path to 100k Monthly Visitors

**Channel mix (priority order):**
1. **Programmatic SEO** — City + style pages are the primary traffic engine. These compound.
2. **Artist sharing loops** — Every claimed artist is a distribution node. Their profile share is a warm referral.
3. **Short-form video** — Artist spotlights, Portland tattoo content, gallery reveals.
4. **Local PR** — Portland press, tattoo media, neighborhood blogs.
5. **Email retention** — Availability alert emails drive return visits.
6. **Community referrals** — Tattoo communities on Reddit, Discord, Instagram.

### Traffic Targets

| Phase | Target |
|:--|:--|
| Months 1–3 | 2,000–5,000 monthly visits |
| Months 4–6 | 10,000–20,000 monthly visits |
| Months 7–9 | 30,000–50,000 monthly visits |
| Months 10–12 | 60,000–100,000 monthly visits with city expansion |

### Programmatic SEO Model

The engine: build a city + style + intent page template, populate it from the InkAtlas database, and publish at scale across every combination.

**Example target pages:**
- Best Fine Line Tattoo Artists in Portland
- Walk-In Tattoo Shops Portland
- Japanese Tattoo Seattle
- Tattoo Cost Guide Portland
- Blackwork Tattoo Artists Portland
- Portland Neighborhood Tattoo Guide
- Where to Get Your First Tattoo in Portland

### Artist Sharing Loop

Every claimed artist has two incentives to share their InkAtlas profile:
1. **Professional pride** — it's a better portfolio page than their link-in-bio
2. **Booking volume** — more profile views = more booking inquiries

Artist shares drive consumer traffic. Consumer traffic creates demand for more profiles. The loop is self-reinforcing.

### City Expansion Sequence

Portland → Seattle → Los Angeles → Denver → Austin → Chicago

Each city follows the same playbook:
1. Supply acquisition first (200+ artist profiles)
2. Editorial content second (city roundups, style guides)
3. Consumer launch third

Never jump to the next city before the current one has meaningful listing density and initial SEO traction.

---

## 7. Tax Considerations

**Founder tax situation:** US citizen. [Country of residence TBD — consult an accountant as this affects FEIE eligibility and treaty treatment.]

**LLC tax treatment:** A single-member Wyoming LLC is a disregarded entity by default. Income flows through to the personal return. No entity-level federal tax at this stage.

**Sales tax / SaaS:** Artist subscription revenue may be subject to sales tax in certain states. Enable Stripe Tax (with SaaS product tax code) before launch. Tax-exclusive pricing ($29 + applicable tax).

**Estimated taxes:** Self-employment income requires quarterly estimated tax payments to the IRS. Set aside 25–30% of net revenue for taxes from the start.

> **Action item:** Consult an accountant before hitting $3K MRR. The structure choice (single-member LLC, S-corp election, etc.) has meaningful tax implications.

---

## 8. Contingency Plans

### Slow Supply Acquisition

If Portland artist acquisition is slower than expected, delay consumer launch rather than launching thin.

**Rule:** Never launch a city with fewer than 150 seeded profiles. An empty directory is worse than no directory.

### Platform / Data Risk

InkAtlas's supply acquisition relies on manual research and public sources. If a key external source disappears, the profile remains intact in the InkAtlas database. The first-party database is the insurance policy.

### Stripe Reserve / Hold Risk

Stripe can impose rolling reserves on new accounts with rapid revenue growth — holding 10–25% of payouts for 90–120 days. Budget as if 75% of MRR is accessible in the first 6 months.

### Solo-Founder Risk

Ian is the sole technical founder. If unable to work for an extended period, the product cannot be maintained.

**Mitigation:** Clean codebase with conventions documented in the PDD. Claude Code as the primary build tool means a competent developer with access could maintain the product.

### Pro Conversion Failure

If artists claim profiles but don't convert to Pro, the revenue model doesn't work.

**Early signal to watch:** The claim-to-Pro conversion rate on the first 50 claimed artists. If it's below 10% after 60 days, the Pro value proposition needs revisiting before scaling acquisition.

---

## 9. Key Dates & Milestones

| Milestone | Target | Status |
|:--|:--|:--|
| Open dedicated bank account | This week | Not started |
| Portland artist database — 100 profiles seeded | Month 1 | Not started |
| Founding artist outreach — top 20 Portland studios | Month 1 | Not started |
| Portland artist database — 200 profiles seeded | Month 2 | Not started |
| Core MVP built (search, map, profiles, gallery) | Month 2 | Not started |
| Form Wyoming LLC | Before $1K MRR | Not started |
| Obtain EIN | Immediately after LLC | Not started |
| Portland consumer launch | Month 3 | Not started |
| Pro artist accounts live | Months 3–4 | Not started |
| First editorial content published | Month 3 | Not started |
| Enable Stripe Tax | Before launch | Not started |
| Seattle launch | Months 5–6 | Not started |
| Consult accountant (US abroad + LLC) | Before $3K MRR | Not started |

---

*This is a living document. Update as decisions are made and milestones are reached.*

*Confidential — April 2026*
