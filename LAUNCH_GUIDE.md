# Marketing Launch Guide — Swiss Immigration Pro

Comprehensive step-by-step guide for driving traffic to SIP landing pages and converting visitors into paying subscribers.

**Landing pages:**
- `/lp/work-permit` — targets EU/US nationals seeking Swiss work permits
- `/lp/citizenship` — targets long-term residents pursuing naturalization

---

## Table of Contents

1. [Google Search Console & Analytics](#1-google-search-console--analytics)
2. [Synthesia Video Ads](#2-synthesia-video-ads)
3. [Google Ads Campaign](#3-google-ads-campaign)
4. [Meta Ads (Facebook/Instagram)](#4-meta-ads-facebookinstagram)
5. [TikTok Ads (Optional)](#5-tiktok-ads-optional)
6. [UTM Convention](#6-utm-convention)
7. [KPI Dashboard](#7-kpi-dashboard)
8. [30-Day Launch Checklist](#8-30-day-launch-checklist)

---

## 1. Google Search Console & Analytics

### Google Search Console Setup

1. Go to [Google Search Console](https://search.google.com/search-console)
2. Add property: `https://swissimmigrationpro.com`
3. Verify ownership via one of:
   - **DNS TXT record** (recommended): Add TXT record to your domain DNS
   - **HTML file**: Upload verification file to `public/`
   - **HTML tag**: Already supported — set `GOOGLE_SITE_VERIFICATION` env var in `.env`
4. Submit sitemap:
   - Go to Sitemaps > Add new sitemap
   - Enter: `https://swissimmigrationpro.com/sitemap.xml`
   - This includes `/lp/work-permit` and `/lp/citizenship` automatically
5. Request indexing for priority pages:
   - URL Inspection > Enter each LP URL > Request Indexing

### Google Analytics 4 Setup

1. Go to [Google Analytics](https://analytics.google.com)
2. Create new GA4 property: "Swiss Immigration Pro"
3. Create a Web data stream for `swissimmigrationpro.com`
4. Get the Measurement ID (format: `G-XXXXXXXXXX`)
5. Add to your deployment:
   - Set env var: `NEXT_PUBLIC_GA_MEASUREMENT_ID=G-XXXXXXXXXX`
   - Or use Plausible (already configured via `NEXT_PUBLIC_PLAUSIBLE_DOMAIN`)

### Key Events to Track

| Event | Trigger | Purpose |
|-------|---------|---------|
| `sign_up` | Registration form submit | Track signup conversion |
| `begin_checkout` | Click "Start Free Trial" on pricing | Track purchase intent |
| `purchase` | Stripe webhook confirms payment | Track revenue |
| `page_view` | Page load | Track LP engagement |
| `quiz_complete` | Quiz submission | Track funnel progression |
| `cta_click` | Any CTA button click | Track engagement |

### Link GA4 to Google Ads

1. In GA4: Admin > Google Ads Links > Link
2. Select your Google Ads account
3. Enable auto-tagging
4. Import conversions: sign_up, purchase

---

## 2. Synthesia Video Ads

### Account Setup

1. Go to [Synthesia.io](https://www.synthesia.io/)
2. Sign up for **Creator plan** ($89/month — 120 video minutes)
3. Set up brand kit:
   - Logo: Upload SIP logo (`images/logo.png`)
   - Colors: Swiss Red `#DC2626`, Slate `#0F172A`, White `#FFFFFF`
   - Font: Inter (matches website)

### Avatar Selection

| Script | Avatar | Accent | Background |
|--------|--------|--------|------------|
| Work Permit Hook (30s) | Anna (professional female) | British | Modern office |
| Success Story (45s) | James (professional male) | American | Home office |
| Educational (60s) | Sophia (teacher-style female) | British | Clean studio |
| TikTok Hook (15s) | Alex (young, casual) | Neutral | Colorful |
| Citizenship Path (60s) | David (mature professional) | Neutral | Executive office |

### Script Source

All 5 scripts are in `VIDEO_ADS_SCRIPTS.md` at the repo root. Key updates for SIP-AI branding:
- Replace "AI chatbot" with "SIP-AI assistant" in scripts
- Replace "5,000 people" with "18,500+ users" (matches `SITE_STATS.totalUsers`)
- Update website CTA to point to LP URLs with UTM params:
  - Work permit scripts: `swissimmigrationpro.com/lp/work-permit?utm_source=synthesia&utm_medium=video`
  - Citizenship scripts: `swissimmigrationpro.com/lp/citizenship?utm_source=synthesia&utm_medium=video`

### Export Settings by Platform

| Platform | Resolution | Aspect Ratio | Max Length |
|----------|-----------|--------------|------------|
| Meta (Feed) | 1080x1080 | 1:1 | 60s |
| Meta (Stories/Reels) | 1080x1920 | 9:16 | 30s |
| TikTok | 1080x1920 | 9:16 | 60s |
| YouTube (Pre-roll) | 1920x1080 | 16:9 | 60s |
| YouTube (Shorts) | 1080x1920 | 9:16 | 60s |
| LinkedIn | 1920x1080 | 16:9 | 60s |

### Production Workflow

1. Paste script into Synthesia editor
2. Select avatar and background
3. Add text overlays matching the script callouts
4. Generate video (takes 5-15 min per video)
5. Download and add captions in [Descript](https://www.descript.com/) ($24/mo)
6. Add logo intro (3s) and CTA end card
7. Export in all required aspect ratios

---

## 3. Google Ads Campaign

### Account Setup

1. Go to [Google Ads](https://ads.google.com)
2. Create account with billing in CHF
3. Link to Google Analytics 4 (see Section 1)
4. Set up conversion tracking:
   - Import GA4 conversions: `sign_up`, `purchase`
   - Or install Google Ads tag directly

### Campaign Structure

```
Account: Swiss Immigration Pro
├── Campaign 1: Work Permits (Search)
│   ├── Ad Group: B Permit
│   ├── Ad Group: L Permit
│   └── Ad Group: General Work Permit
├── Campaign 2: Citizenship (Search)
│   ├── Ad Group: Naturalization
│   ├── Ad Group: Swiss Citizenship
│   └── Ad Group: Integration Test
└── Campaign 3: Remarketing (Display)
    └── Ad Group: Site Visitors
```

### Keyword Lists

**Campaign 1: Work Permits**

| Ad Group | Keywords (Exact Match) |
|----------|----------------------|
| B Permit | [swiss b permit], [b permit switzerland], [residence permit switzerland], [swiss work permit b], [aufenthaltsbewilligung schweiz] |
| L Permit | [swiss l permit], [short term work permit switzerland], [l permit application], [kurzaufenthaltsbewilligung] |
| General | [work permit switzerland], [swiss work visa], [how to work in switzerland], [arbeitsbewilligung schweiz], [work in switzerland as foreigner] |

**Campaign 2: Citizenship**

| Ad Group | Keywords (Exact Match) |
|----------|----------------------|
| Naturalization | [swiss naturalization], [einbürgerung schweiz], [naturalisation suisse], [swiss naturalization requirements] |
| Citizenship | [swiss citizenship], [how to become swiss citizen], [swiss passport application], [schweizer bürgerrecht] |
| Integration | [swiss integration test], [swiss citizenship test preparation], [integrationstest schweiz] |

### Ad Copy Templates

**Work Permit — Responsive Search Ad:**

Headlines (max 30 chars each):
1. Swiss Work Permit Guide
2. 96% Success Rate
3. AI-Powered Guidance
4. Avoid Permit Rejection
5. Free Eligibility Quiz
6. 25+ Swiss CV Templates
7. Start Free Today
8. From CHF 9/Month

Descriptions (max 90 chars each):
1. Join 18,500+ who successfully navigated Swiss work permits. AI guidance, checklists & CV templates.
2. Stop guessing. Our permit calculator finds your best pathway. Free quiz, no credit card required.
3. Professional Swiss CV builder, quota tracking & step-by-step checklists. Try free today.

Final URL: `https://swissimmigrationpro.com/lp/work-permit?utm_source=google&utm_medium=cpc&utm_campaign=work-permit`

**Citizenship — Responsive Search Ad:**

Headlines:
1. Swiss Citizenship Guide
2. Complete 10-Year Roadmap
3. All 26 Cantons Covered
4. Integration Test Prep
5. Language Test B1/B2 Ready
6. Naturalization Simplified
7. Start Free Today
8. Expert AI Guidance

Descriptions:
1. Your complete path to Swiss citizenship. Canton-specific guides, language test prep & timeline tracking.
2. Navigate the 10-year naturalization process with confidence. Integration test question bank included.
3. 26 cantons, each with different rules. We map your exact pathway. Free eligibility check available.

Final URL: `https://swissimmigrationpro.com/lp/citizenship?utm_source=google&utm_medium=cpc&utm_campaign=citizenship`

### Budget & Bidding

| Setting | Value |
|---------|-------|
| Starting budget | CHF 500/month total (CHF 250 per campaign) |
| Bidding strategy | Maximize conversions (start), then Target CPA |
| Target CPA | CHF 30-50 per signup |
| Scale trigger | ROAS > 3:1 for 2 consecutive weeks |
| Scale amount | +25% budget increase |
| Geographic targeting | Switzerland, EU countries, United States, United Kingdom |
| Language targeting | English, German, French |
| Device | All devices (mobile + desktop) |
| Schedule | All hours (immigration research happens anytime) |

### Negative Keywords

Add these to all campaigns:
- free visa
- refugee
- asylum
- illegal
- schengen visa tourist
- holiday visa
- job posting
- salary calculator (unless yours)

---

## 4. Meta Ads (Facebook/Instagram)

### Business Manager Setup

1. Go to [Meta Business Suite](https://business.facebook.com/)
2. Create Business Manager account
3. Create Ad Account with CHF billing
4. Create Facebook Page: "Swiss Immigration Pro"
5. Connect Instagram business account

### Meta Pixel Installation

Add to your deployment environment:

```
NEXT_PUBLIC_META_PIXEL_ID=your_pixel_id_here
```

Then add the pixel to `app/layout.tsx` (or use a tag manager):

```html
<!-- Meta Pixel Code -->
<script>
!function(f,b,e,v,n,t,s)
{if(f.fbq)return;n=f.fbq=function(){n.callMethod?
n.callMethod.apply(n,arguments):n.queue.push(arguments)};
if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
n.queue=[];t=b.createElement(e);t.async=!0;
t.src=v;s=b.getElementsByTagName(e)[0];
s.parentNode.insertBefore(t,s)}(window, document,'script',
'https://connect.facebook.net/en_US/fbevents.js');
fbq('init', 'YOUR_PIXEL_ID');
fbq('track', 'PageView');
</script>
```

### Campaign Structure

```
Campaign: Swiss Immigration — Conversions
├── Ad Set 1: Work Permits — EU Nationals
│   ├── Ad: Video (30s hook)
│   ├── Ad: Image carousel (features)
│   └── Ad: Testimonial
├── Ad Set 2: Work Permits — US/UK Nationals
│   ├── Ad: Video (success story)
│   └── Ad: Image (CV builder)
└── Ad Set 3: Citizenship — Long-term Residents
    ├── Ad: Video (citizenship path 60s)
    └── Ad: Image (10-year roadmap)
```

### Audience Targeting

**Ad Set 1: EU Work Permits**
- Location: EU countries (Germany, France, Italy, Spain, Netherlands, Poland)
- Age: 25-45
- Interests: Switzerland, Swiss culture, expat life, immigration, working abroad, Swiss companies
- Behaviors: Frequent international travelers, recent movers
- Language: English, German, French

**Ad Set 2: US/UK Work Permits**
- Location: United States, United Kingdom
- Age: 25-45
- Interests: Switzerland, Swiss culture, European jobs, tech jobs abroad, international careers
- Language: English

**Ad Set 3: Citizenship**
- Location: Switzerland (people living there)
- Age: 30-55
- Interests: Swiss citizenship, naturalization, integration, Swiss politics, civic engagement
- Behaviors: Expats, foreign residents
- Language: English, German, French

### Ad Creative Specs

| Format | Size | File Size | Duration |
|--------|------|-----------|----------|
| Feed Image | 1080x1080 | <30MB | — |
| Feed Video | 1080x1080 | <4GB | 15-60s |
| Stories/Reels | 1080x1920 | <4GB | 15-30s |
| Carousel | 1080x1080 per card | <30MB | 2-10 cards |

### Budget & Optimization

| Setting | Value |
|---------|-------|
| Campaign objective | Conversions |
| Optimization event | sign_up (or ViewContent initially) |
| Starting budget | CHF 500/month |
| Ad set budget | CHF 150-200 per ad set |
| Bid strategy | Lowest cost (learning phase), then cost cap |
| Target CPA | CHF 25-40 per signup |
| Placement | Automatic (let Meta optimize) |
| Schedule | Always on |

### Scaling Rules

- **Kill**: CPA > CHF 60 after 1,000 impressions
- **Scale**: CPA < CHF 30 for 3 consecutive days → increase budget by 20%
- **Test**: Run 2-3 ad creatives per ad set, kill losers after 3 days

---

## 5. TikTok Ads (Optional)

**When to start:** After Meta proves ROI (CPA < CHF 40, ROAS > 2:1) for at least 2 weeks.

### Setup

1. Create [TikTok Ads Manager](https://ads.tiktok.com/) account
2. Install TikTok Pixel (similar to Meta Pixel)
3. Create campaigns with "Website Conversions" objective

### Pixel Installation

```
NEXT_PUBLIC_TIKTOK_PIXEL_ID=your_pixel_id_here
```

### Campaign Structure

```
Campaign: Swiss Immigration — TikTok
├── Ad Group 1: Work Permit Hook
│   └── Ad: 15s quick hook video
├── Ad Group 2: Educational
│   └── Ad: 60s "5 Mistakes" video
└── Ad Group 3: Citizenship
    └── Ad: 30s citizenship path teaser
```

### Targeting

- Location: EU countries, US, UK, Switzerland
- Age: 20-40
- Interests: Travel, expat life, career, Europe, Switzerland
- Behaviors: Video viewers (6s+)

### Budget

| Setting | Value |
|---------|-------|
| Starting budget | CHF 300/month |
| Bid strategy | Lowest cost |
| Optimization | Click-through (initially), then Conversions |
| Creative format | 9:16 vertical video, 15-60s |
| Captions | Always on (80% watch without sound) |

---

## 6. UTM Convention

### Standard Format

```
?utm_source={source}&utm_medium={medium}&utm_campaign={campaign}&utm_content={content}&utm_term={term}
```

### Parameter Values

| Parameter | Values |
|-----------|--------|
| `utm_source` | `google`, `meta`, `tiktok`, `youtube`, `linkedin`, `synthesia`, `email`, `organic` |
| `utm_medium` | `cpc`, `cpm`, `video`, `social`, `email`, `referral` |
| `utm_campaign` | `work-permit`, `citizenship`, `brand`, `remarketing`, `newsletter` |
| `utm_content` | `hero-cta`, `nav-cta`, `pricing-cta`, `footer-cta`, `video-30s`, `video-60s`, `carousel`, `testimonial` |
| `utm_term` | (auto-filled by Google Ads for search terms) |

### Standard URLs for Ads

```
# Google Ads — Work Permit
https://swissimmigrationpro.com/lp/work-permit?utm_source=google&utm_medium=cpc&utm_campaign=work-permit

# Google Ads — Citizenship
https://swissimmigrationpro.com/lp/citizenship?utm_source=google&utm_medium=cpc&utm_campaign=citizenship

# Meta Ads — Work Permit Video
https://swissimmigrationpro.com/lp/work-permit?utm_source=meta&utm_medium=cpc&utm_campaign=work-permit&utm_content=video-30s

# Meta Ads — Citizenship Image
https://swissimmigrationpro.com/lp/citizenship?utm_source=meta&utm_medium=cpc&utm_campaign=citizenship&utm_content=carousel

# TikTok — Work Permit
https://swissimmigrationpro.com/lp/work-permit?utm_source=tiktok&utm_medium=cpc&utm_campaign=work-permit&utm_content=video-15s

# Email Newsletter
https://swissimmigrationpro.com/lp/work-permit?utm_source=email&utm_medium=email&utm_campaign=newsletter&utm_content=hero-cta

# YouTube Organic
https://swissimmigrationpro.com/lp/work-permit?utm_source=youtube&utm_medium=video&utm_campaign=work-permit&utm_content=video-60s
```

---

## 7. KPI Dashboard

### Weekly Metrics to Track

| Metric | Target | Source |
|--------|--------|--------|
| LP Page Views | 500+/week | GA4 |
| LP → Signup Rate | >5% | GA4 Events |
| Total Signups | 25+/week | Backend DB |
| Signup → Trial Rate | >30% | Backend DB |
| Trial → Paid Rate | >10% | Stripe |
| ROAS (Revenue / Ad Spend) | >3:1 | Stripe + Ads |
| Cost Per Signup (CPS) | <CHF 30 | Ads Manager |
| Cost Per Acquisition (CPA) | <CHF 100 | Ads + Stripe |
| Ad CTR | >2% | Ads Manager |
| Video View Rate (3s+) | >40% | Ads Manager |

### Monthly Revenue Targets

| Month | Ad Spend | Target Signups | Target Paid | Revenue | ROAS |
|-------|----------|---------------|-------------|---------|------|
| Month 1 | CHF 1,000 | 50 | 5 | CHF 145 | 0.15:1 |
| Month 2 | CHF 1,000 | 75 | 12 | CHF 508 | 0.51:1 |
| Month 3 | CHF 1,500 | 120 | 25 | CHF 1,575 | 1.05:1 |
| Month 6 | CHF 2,000 | 200 | 60 | CHF 4,140 | 2.07:1 |
| Month 12 | CHF 3,000 | 350 | 120 | CHF 9,660 | 3.22:1 |

*Assumes avg revenue of CHF 29/subscriber/month, 15% conversion to paid, 85% monthly retention.*

### Funnel Tracking

```
Impressions → Clicks → LP Views → Signups → Quiz Complete → Trial Start → Paid Conversion
   100K         2K        1.8K       90         60            30            9
   (2% CTR)             (5% conv)  (67%)      (50%)         (30%)
```

### Alert Thresholds

- CPA > CHF 80 for 3 consecutive days → Pause and review
- CTR < 1% → Refresh ad creatives
- LP bounce rate > 70% → Review page speed and content
- Signup → paid < 5% → Review onboarding flow

---

## 8. 30-Day Launch Checklist

### Week 1: Foundation (Days 1-7)

- [ ] **Day 1: Analytics**
  - [ ] Set up Google Search Console, submit sitemap
  - [ ] Set up GA4 (or verify Plausible is active)
  - [ ] Verify LP pages are indexed: `/lp/work-permit`, `/lp/citizenship`

- [ ] **Day 2: Ad Accounts**
  - [ ] Create Google Ads account, set billing to CHF
  - [ ] Create Meta Business Manager, ad account, Facebook page
  - [ ] Link GA4 to Google Ads

- [ ] **Day 3: Tracking Pixels**
  - [ ] Install Meta Pixel on site
  - [ ] Set up conversion events: sign_up, purchase, page_view
  - [ ] Test pixel fires using Meta Pixel Helper browser extension
  - [ ] Verify Google Ads conversion tracking

- [ ] **Day 4-5: Video Production**
  - [ ] Sign up for Synthesia ($89/mo)
  - [ ] Generate 3 priority videos:
    - [ ] Work Permit Hook (30s) — for Meta ads
    - [ ] Success Story (45s) — for YouTube/Meta
    - [ ] Citizenship Path (60s) — for YouTube
  - [ ] Add captions and brand intro in Descript
  - [ ] Export in 1:1, 9:16, and 16:9 formats

- [ ] **Day 6-7: Campaign Setup**
  - [ ] Create Google Ads campaigns (Work Permit + Citizenship)
  - [ ] Create 3 responsive search ads per ad group
  - [ ] Set negative keywords
  - [ ] Create Meta campaign with 3 ad sets
  - [ ] Upload video + image creatives
  - [ ] Set budgets: CHF 250/campaign (Google), CHF 500 total (Meta)
  - [ ] Set geographic and language targeting
  - [ ] Review and launch all campaigns

### Week 2: Launch & Monitor (Days 8-14)

- [ ] **Daily**: Check ad performance in Google Ads and Meta Ads Manager
- [ ] **Day 8**: Verify ads are approved and serving
- [ ] **Day 10**: First performance review
  - [ ] Check CTR (target >1.5%)
  - [ ] Check CPC (target <CHF 2)
  - [ ] Check LP bounce rate (target <60%)
  - [ ] Pause any ads with CTR <0.5%
- [ ] **Day 12**: Review signup data
  - [ ] Check signups from each source
  - [ ] Verify UTM parameters are tracking correctly
  - [ ] Check quiz completion rate from LP visitors
- [ ] **Day 14**: Week 2 retrospective
  - [ ] Calculate CPA for each campaign
  - [ ] Identify top-performing ad creatives
  - [ ] Kill bottom 20% of ads
  - [ ] Create 2 new ad variations based on winners

### Week 3: Optimize (Days 15-21)

- [ ] **Day 15**: A/B test landing pages
  - [ ] Test headline variations
  - [ ] Test CTA button copy ("Start Free" vs "Get My Roadmap")
  - [ ] Test hero stat emphasis
- [ ] **Day 17**: Expand targeting
  - [ ] Add lookalike audiences on Meta (based on signups)
  - [ ] Add broad match keywords on Google (top performers only)
  - [ ] Test new geographic markets
- [ ] **Day 19**: Video performance review
  - [ ] Check 3-second view rate (target >40%)
  - [ ] Check full view rate (target >15%)
  - [ ] Generate 2 new video variations for best-performing script
- [ ] **Day 21**: Mid-month report
  - [ ] Total spend, signups, paid conversions, ROAS
  - [ ] Channel comparison: Google vs Meta
  - [ ] Update budget allocation based on performance

### Week 4: Scale & Plan (Days 22-30)

- [ ] **Day 22**: Scale winning campaigns
  - [ ] Increase budget 20-25% on campaigns with CPA < target
  - [ ] Expand successful ad sets to new audiences
- [ ] **Day 24**: Content marketing kickoff
  - [ ] Publish 2 blog posts targeting LP keywords
  - [ ] Share on LinkedIn and relevant communities
  - [ ] Submit to relevant directories (expat forums, immigration resources)
- [ ] **Day 26**: Remarketing setup
  - [ ] Create remarketing audiences (LP visitors who didn't sign up)
  - [ ] Create remarketing ads with stronger offers
  - [ ] Set up email drip for new signups (automated via Celery)
- [ ] **Day 28**: TikTok evaluation
  - [ ] If Meta ROAS > 2:1 → set up TikTok Ads (CHF 300/mo)
  - [ ] Generate 2 short-form videos (15s hooks)
- [ ] **Day 30**: Month 1 report
  - [ ] Full performance summary
  - [ ] Revenue vs spend analysis
  - [ ] Month 2 strategy and budget recommendation
  - [ ] Update this checklist for Month 2

---

## Budget Summary

### Monthly Costs

| Category | Month 1 | Month 3 | Month 6 |
|----------|---------|---------|---------|
| Google Ads | CHF 500 | CHF 750 | CHF 1,000 |
| Meta Ads | CHF 500 | CHF 750 | CHF 1,000 |
| TikTok Ads | — | CHF 300 | CHF 500 |
| Synthesia | CHF 80 | CHF 80 | CHF 80 |
| Descript | CHF 22 | CHF 22 | CHF 22 |
| **Total** | **CHF 1,102** | **CHF 1,902** | **CHF 2,602** |

### Break-Even Analysis

- Average revenue per paid user: CHF 29/month
- Monthly churn: ~15%
- Customer Lifetime Value (LTV): CHF 29 / 0.15 = **CHF 193**
- Target CPA: CHF 100 (LTV/CPA ratio of ~2:1)
- Break-even: Need 6 paid conversions/month at CHF 1,100 spend = CHF 183/conversion
- At target performance (Month 6+): 60 paid users generating CHF 4,140/month recurring

---

*Last updated: March 2026*
