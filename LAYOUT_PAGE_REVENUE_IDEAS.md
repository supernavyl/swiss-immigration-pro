# 🎯 Revenue-Maximizing Layout & Page Ideas — Swiss Immigration Pro

**Date:** March 2, 2026  
**Focus:** Every layout component and public page — identify conversion opportunities, UX friction, and monetization hooks

---

## 📋 Executive Summary

Your frontend has **15+ key pages** with **30+ revenue touchpoints**. Currently leveraging:
- ✅ Exit-intent popup on pricing pages (already implemented)
- ✅ Header with login/account UX
- ✅ Footer newsletter signup
- ✅ B2B landing page with pricing
- ❌ **No in-app upgrade modals** (friction point)
- ❌ **No consultation upsell in lawyer chat** (left on table)
- ❌ **No progress-based nudges** in modules (engaged users not asked)
- ❌ **No abandoned cart recovery UI** (backend ready, UI missing)
- ❌ **No referral rewards display** in dashboard (feature exists, hidden)

**Estimated 12-month revenue lift:** CHF 6,000–12,000/mo with all ideas

---

## 🎨 LAYOUT COMPONENTS

### 1. **MainHeader** (`/components/layout/MainHeader.tsx`)
**Current:** Logo, nav links (Visas, Pricing, B2B), search, auth, dark mode, language switcher  
**Issue:** No CTA prominence for free → paid conversion

#### Ideas

| Idea | Impact | Effort | Revenue |
|------|--------|--------|---------|
| **1.1 Sticky "Upgrade" CTA in header (free users)** | Show "Unlock AI Lawyer → CHF 9/mo" next to profile; only for free-tier users | 2h | CHF 200–400/mo |
| **1.2 Pack badge in profile dropdown** | Display current pack tier & expiry date; link to upgrade; show days remaining | 1h | CHF 50–100/mo |
| **1.3 Consultation quick-book button in header** | "Book Consultation" button (30min CHF 80) in header on lawyer/modules pages | 3h | CHF 150–300/mo |
| **1.4 Referral badge with earnings** | Show "You've earned CHF X — Share & earn more" next to profile | 1h | +15% referral CTR |
| **1.5 Announcement bar for time-limited offers** | Rotate promo (15% off annual, new masterclass, limited seats for B2B) | 2h | CHF 300–600/mo |

**Files to edit:**
- `MainHeader.tsx` — Add conditional CTAs, pack status, referral badge
- `components/marketing/AnnouncementBar.tsx` (new) — Rotating announcements

---

### 2. **Footer** (`/components/layout/Footer.tsx`)
**Current:** Newsletter signup, quick links, trust metrics (12K+ apps, 4.9⭐, 98% success)  
**Issue:** No secondary CTA for free users; newsletter signup may not convert to paid

#### Ideas

| Idea | Impact | Effort | Revenue |
|------|--------|--------|---------|
| **2.1 "Why Swiss Immigration Pro?" trust section** | Add testimonial quote, case study stat, "Join 18,500+ applicants" callout | 1h | +5% footer CTR |
| **2.2 Footer CTA buttons (context-aware)** | Logged-out: "Start Free"; Free users: "Upgrade"; Paid: "Extend Pack" | 2h | CHF 100–200/mo |
| **2.3 Add consultation booking CTA in footer** | "Need expert advice? Book a 30-min consultation — CHF 80" link | 1h | CHF 50–150/mo |
| **2.4 Marketplace/B2B sections in footer** | Links to marketplace, B2B pricing; footer real estate optimization | 1h | +3% discovery |
| **2.5 Social proof carousel in footer** | Auto-rotating "18,500 guided" → "96% success" → "CHF 5-15K saved" | 2h | +2% engagement |

**Files to edit:**
- `Footer.tsx` — Add CTA buttons, trust section, marketplace links

---

### 3. **QuickActionFAB** (`/components/layout/QuickActionFAB.tsx`)
**Current:** Unknown (likely floating button for support/chat)  
**Opportunity:** Floating CTA for upsell

#### Ideas

| Idea | Impact | Effort | Revenue |
|------|--------|--------|---------|
| **3.1 Floating "Chat with AI Lawyer" button** | Free users: "Upgrade to ask unlimited" — paid users: direct to lawyer chat | 2h | CHF 150–300/mo |
| **3.2 Context-aware FAB icon** | Show different icons/CTAs by page: pricing page = "Apply Coupon", modules = "Upgrade", lawyer = "Chat" | 3h | CHF 100–200/mo |
| **3.3 Unread message badge on FAB** | If user has consultation confirmation/referral earnings, badge alerts them | 1h | +10% engagement |

**Files to edit:**
- `QuickActionFAB.tsx` — Conditional rendering, context-aware CTAs

---

### 4. **Breadcrumbs** (`/components/layout/Breadcrumbs.tsx`)
**Current:** Navigation breadcrumbs  
**Opportunity:** Subtle upsell hint in hierarchy

#### Ideas

| Idea | Impact | Effort | Revenue |
|------|--------|--------|---------|
| **4.1 Add "Unlock Full Guide" link in breadcrumb** | On /[layer]/resources/[slug] pages, show breadcrumb hint + "Unlock Full Guide" for free users | 2h | CHF 100–150/mo |

---

## 📄 PUBLIC PAGES

### 5. **Homepage** (`/app/(main)/page.tsx`)
**Current:** Hero, advantages, journey, pathway grid, testimonials, features, timeline, CTA  
**Issue:** Weak CTA section; no urgency or scarcity; no quiz/referral prompts

#### Ideas

| Idea | Impact | Effort | Revenue |
|------|--------|--------|---------|
| **5.1 Quiz CTA in hero** | "Take 2-min quiz → See your visa pathway (free)" — trigger drip emails after | 2h | CHF 300–600/mo (email sequence) |
| **5.2 Stats refresh (dynamic)** | Pull live stats from backend: "18,500+ guided this year", "X permits approved this month" | 2h | +3% engagement |
| **5.3 Social proof carousel hero** | 3-5 rotating testimonials in hero with faces, name, pack tier ("Immigration Pack, CHF 9") | 1h | +2% conversion |
| **5.4 "Join 18,500+ Swiss-bound applicants" CTA in hero** | Prominent primary button; secondary "Take Quiz First" | 1h | +5% signup |
| **5.5 Referral reward callout** | "Give CHF 10, Get CHF 10 — Tell a friend" section in footer | 1h | +20% referral signups |
| **5.6 Annual plan savings badge in advantages** | "Save 20% with annual billing — CHF 9/mo → CHF 108/year (save CHF 11)" | 1h | +15% annual mix |

**Files to edit:**
- `app/(main)/page.tsx` — Add quiz CTA, referral callout
- `components/home/HeroSection.tsx` — Strengthen hero CTA, add stats ticker
- `components/home/CTASection.tsx` — Upgrade CTA design

---

### 6. **Pricing Page** (`/app/pricing/page.tsx`)
**Current:** Pricing content + exit-intent popup  
**Already good:** Exit-intent popup enabled, annual default

#### Ideas

| Idea | Impact | Effort | Revenue |
|------|--------|--------|---------|
| **6.1 Billing cycle toggle animation** | "Save 20% with annual" badge pulses on annual toggle | 1h | +2% annual selection |
| **6.2 Coupon code input field** (integrate drip emails) | After exit-intent popup, show "Have a coupon?" field; apply QUIZ25, SAVE15 on checkout | 2h | CHF 200–400/mo |
| **6.3 Trust meter below pricing cards** | "Only 5 spots left at this price" (scarcity) or "Join 2,000+ Citizenship Pro members" | 2h | +3% conversion |
| **6.4 "FAQ by Use Case" tabs** | "I'm freelancer" → show L-permit focused FAQs; "I'm employee" → B-permit FAQs | 3h | +4% clarity, -support burden |
| **6.5 Annual "lock-in" messaging** | "Annual plan locked at CHF 108 for 2026 — prices increase Jan 2027" | 1h | +5% annual mix |
| **6.6 Consultation upsell section** | "Not sure which plan? Book a CHF 80 consultation" below pricing cards | 2h | CHF 100–200/mo |
| **6.7 Success stories by pack tier** | "See how Immigration Pack helped [Name] get B-permit in 6 weeks" | 2h | +3% conversion |
| **6.8 "Money-back guarantee" banner** | "30-day money-back guarantee — no questions asked" to reduce purchase friction | 1h | +8% conversion |

**Files to edit:**
- `PricingContent.tsx` — Add billing cycle animation, FAQs by use case, guarantee banner
- `PricingCard.tsx` — Add trust meter, scarcity hints
- New: `components/pricing/ConsultationUpsell.tsx`

---

### 7. **Quiz Page** (`/app/quiz/page.tsx`)
**Current:** Basic 3-question quiz (nationality, location, intent)  
**Issue:** Small quiz; no upsell after result; no email capture

#### Ideas

| Idea | Impact | Effort | Revenue |
|------|--------|--------|---------|
| **7.1 Expand quiz to 8-10 questions** | Add work experience, education, family status, language → more accurate recommendations | 3h | +10% recommendation match |
| **7.2 Progress bar with urgency** | "8/10 questions — You're almost there!" with animation | 1h | +5% completion rate |
| **7.3 Result-dependent CTAs** | EU citizen → "90% approve B-permits — Upgrade to Adv. Pack"; US citizen → "Consulate processing takes 8 weeks — Get Masterclass" | 2h | CHF 300–600/mo |
| **7.4 Email capture before result reveal** | "See your personalized path + exclusive offer" → capture email first | 1h | +200 emails/mo |
| **7.5 Drip email sequence post-quiz** | Day 0: "Here's your visa path"; Day 1: "Top 5 mistakes to avoid"; Day 3: "CHF 9/mo offer expires" | 2h (backend) | CHF 400–800/mo |
| **7.6 Referral code pre-fill** | If user came from referral link, show "Your friend referred you — both get CHF 10 off" | 1h | +15% referral conversion |

**Files to edit:**
- `app/quiz/page.tsx` — Expand questions, progress bar, result CTAs
- `backend/app/tasks/` — Drip email sequence task

---

### 8. **Modules/Learning Pages** (`/app/(main)/modules/page.tsx`)
**Current:** Module listings with access control  
**Issue:** No upgrade nudges at critical friction points; no PDF upsells

#### Ideas

| Idea | Impact | Effort | Revenue |
|------|--------|--------|---------|
| **8.1 In-app upgrade modal at module lock** | Free user tries to open Module 3 → show: "Unlock 10 modules + AI tutor for CHF 29/mo" | 3h | CHF 400–800/mo |
| **8.2 Progress tracking with "almost there" nudges** | 80% through free module → show sticky CTA: "You're almost done — Upgrade to see the rest" | 2h | CHF 200–400/mo |
| **8.3 PDF download upsell** | At module end: "Download this guide as PDF + checklist — CHF 9 (one-time)" | 2h | CHF 300–500/mo |
| **8.4 Module completion badges/milestones** | "You've completed 3/5 free modules — Upgrade to access 10 total" | 1h | +3% module engagement |
| **8.5 Related consultation recommendation** | After module on "B-Permit Applications", show: "Need expert review? Book a CHF 80 session" | 2h | CHF 100–200/mo |
| **8.6 Time-to-completion indicator** | "Avg 15 min to complete" + "5 min left" — urgency/progress | 1h | +2% completion |

**Files to edit:**
- New: `components/modules/UpgradeModal.tsx`
- `components/modules/ModuleCard.tsx` — Add progress tracker, PDF upsell button
- `components/modules/ProgressBar.tsx` — Add "almost there" nudge

---

### 9. **AI Lawyer Chat** (`/app/lawyer/page.tsx`)
**Current:** SwissVirtualLawyer component  
**Issue:** No consultation upsell after message limit; free users may get frustrated

#### Ideas

| Idea | Impact | Effort | Revenue |
|------|--------|--------|---------|
| **9.1 Consultation upsell after 5 messages (free users)** | "Want detailed 1:1 guidance? Book a CHF 80 consultation with a Swiss employment lawyer" | 3h | CHF 300–800/mo |
| **9.2 Chat history saved for paid users only** | Free: "Upgrade to save chat history & reference past Q&As"; Paid: full history | 2h | CHF 100–200/mo |
| **9.3 In-chat referral CTA** | After user gets helpful answer: "Know someone applying? Refer & both get CHF 10" | 1h | +25% referral signups |
| **9.4 AI lawyer "expertise area" filters** | Let user filter: "B-Permit", "Citizenship", "Family Reunion" — match to consultation type | 2h | +15% consultation booking |
| **9.5 Consultation booking quick-action** | Blue button "Book a consultation" pre-fills context from chat | 2h | CHF 200–400/mo |
| **9.6 Session transcript upsell** | "Download chat transcript + lawyer summary — CHF 15" | 1h | CHF 100–200/mo |

**Files to edit:**
- `components/lawyer/SwissVirtualLawyer.tsx` — Add message counter, upsell modal
- New: `components/lawyer/ConsultationUpsellModal.tsx`
- `app/lawyer/page.tsx` — Pass props for messaging limits

---

### 10. **Marketplace Page** (`/app/marketplace/page.tsx`)
**Current:** Browse lawyers/agencies with search, filters, ratings  
**Issue:** No marketplace commission tracking shown; no "featured" tier upsell for providers

#### Ideas

| Idea | Impact | Effort | Revenue |
|------|--------|--------|---------|
| **10.1 "Featured Lawyer" tier in marketplace** | Lawyers pay CHF 49/mo to appear in "Recommended" section at top; 30% boost in inquiries | 4h | CHF 500–1000/mo |
| **10.2 In-marketplace consultation booking** | "Get instant answer" button on lawyer profile → direct consultation booking | 2h | CHF 100–200/mo (commission) |
| **10.3 User review count badge** | "100+ reviews, 4.9⭐" builds trust → higher conversion to book/call | 1h | +8% booking rate |
| **10.4 "Verified Expert" badge upsell** | Agencies can pay CHF 30/mo for verified badge; builds trust | 2h | CHF 200–400/mo |
| **10.5 Agency "team seats" promotion** | "Add 2 team members to your agency profile — CHF 50/mo for each" | 2h | CHF 100–300/mo |

**Files to edit:**
- `app/marketplace/page.tsx` — Add featured tier banner, verification badge
- `backend/app/routers/marketplace/` — New endpoint for featured tier checkout

---

### 11. **Dashboard** (`/app/(main)/dashboard/page.tsx`)
**Current:** Unknown structure  
**Opportunity:** Surface all monetization opportunities in one place

#### Ideas

| Idea | Impact | Effort | Revenue |
|------|--------|--------|---------|
| **11.1 "Referral earnings widget"** | "You've earned CHF 50 from 5 referrals — Share link to earn more" | 2h | +20% referral participation |
| **11.2 Pack status widget** | "Immigration Pack — Renews in 15 days — CHF 9/mo — Upgrade to Advanced?" | 1h | +5% upsell rate |
| **11.3 Consultation booking history** | Show past/upcoming consultations; CTAs to "Book another", "Leave review" | 2h | +10% repeat bookings |
| **11.4 Module progress tracker** | "3/10 modules completed — 30% done — Keep going!" with milestone badges | 2h | +15% module engagement |
| **11.5 Next steps recommendations** | "You completed B-Permit guide — Next: Book a consultation to review your CV" | 1h | CHF 100–200/mo |
| **11.6 Achievement badges & unlocks** | "Quiz Master", "CV Expert", "Citizenship Path" — gamification → engagement | 2h | +25% engagement |

**Files to edit:**
- New: `components/dashboard/ReferralEarningsWidget.tsx`
- New: `components/dashboard/PackStatusWidget.tsx`
- `app/(main)/dashboard/page.tsx` — Integrate widgets

---

### 12. **Consultation Booking Page** (`/app/(main)/consultation/page.tsx`)
**Current:** Booking interface (assumed to exist)  
**Issue:** No upsell for package deals; no post-booking followup

#### Ideas

| Idea | Impact | Effort | Revenue |
|------|--------|--------|---------|
| **12.1 Consultation package upsell** | "Book 3 consultations — CHF 200 (save CHF 40)" on checkout | 2h | CHF 200–400/mo |
| **12.2 "Add CV review" service** | Offer CHF 150 CV review add-on at booking time | 1h | CHF 150–300/mo |
| **12.3 Post-consultation email with next steps** | "Your consultation is booked! [Link] to prepare, share your CV, etc." | 1h | +20% prep rate, better outcomes |
| **12.4 Cancellation/rescheduling incentive** | "Cancel within 24h? Get 20% off next consultation" | 1h | +5% retention |

**Files to edit:**
- `app/(main)/consultation/page.tsx` — Add package upsell, CV review add-on
- `backend/app/services/email_service.py` — Pre-consultation reminder email

---

### 13. **B2B Portal** (`/app/b2b/page.tsx` + dashboard)
**Current:** Pricing (3 tiers: Starter CHF 199, Business CHF 499, Enterprise CHF 999/mo)  
**Issue:** No seat expansion upsell; no analytics dashboard to justify retention

#### Ideas

| Idea | Impact | Effort | Revenue |
|------|--------|--------|---------|
| **13.1 "Add team members" CTA in B2B dashboard** | Starter: "Add 5 more seats for CHF 50/mo"; Business: "Add 10 seats for CHF 80/mo" | 2h | CHF 500–1000/mo |
| **13.2 Compliance alerts widget in dashboard** | Real-time alerts: "8 permits expiring in <30 days", "2 non-compliant hires" | 2h | +30% retention (prevents churn) |
| **13.3 "Upgrade to Business" CTA in Starter dashboard** | "Unlock advanced compliance scoring + multi-department tracking" | 1h | CHF 300–600/mo |
| **13.4 Department head invitation feature** | "Invite 3 team members to manage their own permits" → increase engagement, stickiness | 2h | +25% engagement |
| **13.5 Export compliance reports for audit** | "Generate PDF audit report" — might upsell to higher tier | 1h | +5% retention |
| **13.6 Historical compliance trends** | "Year-over-year permit violations down 40%" dashboard | 2h | +20% renewal rate |

**Files to edit:**
- `app/b2b/dashboard/page.tsx` — Add seat expansion CTA, compliance widget
- New: `components/b2b/SeatExpansionModal.tsx`

---

### 14. **Blog/Resources Pages** (`/app/(main)/resources/[slug]/page.tsx`)
**Current:** Resource content pages  
**Issue:** No exit-intent popup; no PDF upsell; no consultation recommendation

#### Ideas

| Idea | Impact | Effort | Revenue |
|------|--------|--------|---------|
| **14.1 Exit-intent popup on resources** | Same as pricing: "Save with SAVE15" — capture newsletter emails | 1h | CHF 200–400/mo |
| **14.2 Resource PDF download upsell** | "Download this guide as PDF + checklist — CHF 9" button | 1h | CHF 150–300/mo |
| **14.3 "Related consultation" CTA** | At end of "B-Permit Application Steps" article: "Need personalized review? CHF 80 consultation" | 1h | CHF 100–200/mo |
| **14.4 "Learn more" module links** | Blog post on B-Permits → link to Advanced Pack with B-Permit module | 1h | CHF 100–200/mo |

**Files to edit:**
- `app/(main)/resources/[slug]/page.tsx` — Add exit-intent popup, PDF upsell, consultation CTA

---

### 15. **Contact/Support Page** (`/app/(main)/contact/page.tsx`)
**Current:** Contact form  
**Opportunity:** Qualify inbound leads for higher-priced services

#### Ideas

| Idea | Impact | Effort | Revenue |
|------|--------|--------|---------|
| **15.1 "Quick consultation instead?" offer** | If user writes detailed question: "Book a CHF 80 consultation with a lawyer instead" | 2h | CHF 300–600/mo |
| **15.2 Support tier upsell** | "Priority support" feature: "Paid members get 48h responses; contact us for Enterprise SLA" | 1h | +5% Business→Enterprise upgrades |
| **15.3 Lead qualification form** | "What's your situation? (Employee visa / Family reunion / Entrepreneur)" → route to relevant consultant | 2h | +30% conversion |

**Files to edit:**
- `app/(main)/contact/page.tsx` — Add consultation CTA, lead qualification

---

### 16. **Auth Pages** (`/app/(main)/auth/page.tsx`, signin/signup)
**Current:** Auth forms  
**Issue:** No post-signup drip emails; no referral code pre-fill

#### Ideas

| Idea | Impact | Effort | Revenue |
|------|--------|--------|---------|
| **16.1 Referral code pre-fill on signup** | `?ref=abc123` in URL pre-fills referral field; shows "Your friend X referred you" | 1h | +15% referral conversions |
| **16.2 Post-signup drip sequence** | Day 0: Welcome, Day 1: Quiz CTA, Day 3: "Unlock AI Lawyer for CHF 9", Day 7: "Limited offer expires" | 2h (backend) | CHF 500–1000/mo |
| **16.3 Social signup (Google/Apple)** | Reduce friction for new users; capture 10% more signups | 3h | CHF 300–600/mo |

**Files to edit:**
- `app/(main)/auth/signup/page.tsx` — Add referral code pre-fill, social signup buttons
- `backend/app/tasks/` — Post-signup drip email task

---

## 🎨 LAYOUT & COMPONENT-WIDE IDEAS

### 17. **Global Alerts/Notifications System**
**Current:** Toast notifications (ToastProvider)  
**Opportunity:** Upgrade to sticky in-app banners for high-priority monetization

| Idea | Impact | Effort | Revenue |
|------|--------|--------|---------|
| **17.1 "Limited offer" banner at page top** | Sticky banner: "Immigration Pack — 50% off for annual (expires Friday)" — appears site-wide | 2h | CHF 300–600/mo |
| **17.2 Pack expiration warning banner** | "Your Immigration Pack expires in 3 days — Renew now" for near-expiry users | 1h | +8% renewal rate |
| **17.3 Consultation availability banner** | "2 slots left this week for CHF 80 consultations — Book now" | 1h | CHF 100–200/mo |
| **17.4 Referral earnings notification** | When user gets referral reward: "Friend X upgraded — You earned CHF 10! — See all earnings" | 1h | +20% referral engagement |

**Files to edit:**
- New: `components/layout/AlertBanner.tsx`
- `app/layout.tsx` — Add AlertBanner at top

---

### 18. **Mobile-Specific Optimizations** (Mobile app at `/mobile`)
**Current:** Mobile app in workspace  
**Opportunity:** Mobile has different conversion patterns (lower friction for CTAs)

| Idea | Impact | Effort | Revenue |
|------|--------|--------|---------|
| **18.1 Bottom-sheet checkout on mobile** | Mobile users: "Upgrade" CTA opens bottom sheet (not full page checkout) | 2h | +8% mobile conversion |
| **18.2 Mobile push notifications for drip sequence** | Post-quiz: "Your visa path is ready — [Link]" push notification | 2h | +30% email open rate → CHF 300–600/mo |
| **18.3 Mobile one-tap consultation booking** | "Book consultation" button with pre-filled profile data | 1h | +5% consultation bookings |

**Files to edit:**
- `mobile/app/` — Bottom sheet checkout, push notification integration

---

## 📊 REVENUE IMPACT SUMMARY

### Quick Wins (1–2h each, implement ASAP)
| Idea | Revenue | Effort |
|------|---------|--------|
| 1.1 Sticky "Upgrade" CTA in header | CHF 200–400/mo | 2h |
| 1.2 Pack badge in header | CHF 50–100/mo | 1h |
| 2.1 Trust section in footer | +5% CTR | 1h |
| 2.2 Footer CTA buttons | CHF 100–200/mo | 2h |
| 4.1 "Unlock Full Guide" breadcrumb | CHF 100–150/mo | 2h |
| 5.1 Quiz CTA in hero | CHF 300–600/mo | 2h |
| 5.5 Referral callout on home | +20% referral | 1h |
| **Subtotal** | **CHF 850–1850/mo** | **~14h** |

### Medium Effort (2–4h each, Q1)
| Idea | Revenue | Effort |
|------|---------|--------|
| 8.1 In-app module upgrade modal | CHF 400–800/mo | 3h |
| 9.1 Consultation upsell in lawyer chat | CHF 300–800/mo | 3h |
| 6.4 "FAQ by use case" tabs | +4% clarity | 3h |
| 14.1 Exit-intent on resources | CHF 200–400/mo | 1h |
| 16.1 Referral code pre-fill signup | +15% referral | 1h |
| **Subtotal** | **CHF 900–2000/mo** | **~14h** |

### Larger Features (4–8h, Q1–Q2)
| Idea | Revenue | Effort |
|------|---------|--------|
| 8.3 PDF module download upsell | CHF 300–500/mo | 2h |
| 8.2 Progress-based nudges | CHF 200–400/mo | 2h |
| 11.1 Referral earnings widget | +20% participation | 2h |
| 13.1 B2B seat expansion CTA | CHF 500–1000/mo | 2h |
| 10.1 Marketplace featured tier | CHF 500–1000/mo | 4h |
| **Subtotal** | **CHF 1500–2900/mo** | **~14h** |

### **GRAND TOTAL 12-MONTH PROJECTION**
- **Implementation time:** ~40–50 hours
- **Monthly recurring revenue lift:** CHF 3,250–6,750/mo
- **Annual impact:** CHF 39,000–81,000

---

## 🚀 RECOMMENDED ROLLOUT PLAN

### **Phase 1 (Week 1–2): Quick Wins**
1. Add sticky header CTA for free users (1.1)
2. Footer CTA buttons (2.2)
3. Pricing page coupon field (6.2)
4. Quiz CTA in hero (5.1)
5. Referral callout (5.5)

**Expected lift:** CHF 500–1000/mo  
**Time:** 10h

### **Phase 2 (Week 3–4): High-Impact Modals**
1. Module upgrade modal (8.1)
2. Lawyer chat consultation upsell (9.1)
3. Dashboard widgets (11.1, 11.2)
4. Quiz drip email sequence (7.5) — backend task

**Expected lift:** CHF 700–1500/mo  
**Time:** 12h

### **Phase 3 (Month 2): Refinement & Polish**
1. Exit-intent on all resource pages (14.1)
2. PDF upsells (8.3, 14.2)
3. B2B seat expansion (13.1)
4. Marketplace featured tier (10.1)
5. Progress-based nudges (8.2)

**Expected lift:** CHF 1000–2000/mo  
**Time:** 15h

### **Phase 4 (Ongoing): Optimization & Testing**
- A/B test CTA copy, colors, placement
- Track conversion metrics per component
- Optimize drip email sequences based on open/click rates
- Iterate on pricing/discount strategies

---

## 📋 FILES TO CREATE/MODIFY

**New files:**
- `components/marketing/AnnouncementBar.tsx`
- `components/marketing/ExitIntentPopup.tsx` (enhance with more pages)
- `components/modules/UpgradeModal.tsx`
- `components/modules/ModuleCard.tsx` (enhance)
- `components/lawyer/ConsultationUpsellModal.tsx`
- `components/dashboard/ReferralEarningsWidget.tsx`
- `components/dashboard/PackStatusWidget.tsx`
- `components/b2b/SeatExpansionModal.tsx`
- `components/layout/AlertBanner.tsx`

**Modified files:**
- `components/layout/MainHeader.tsx`
- `components/layout/Footer.tsx`
- `components/layout/QuickActionFAB.tsx`
- `components/pricing/PricingContent.tsx`
- `components/pricing/PricingCard.tsx`
- `app/(main)/page.tsx`
- `app/pricing/page.tsx`
- `app/quiz/page.tsx`
- `app/lawyer/page.tsx`
- `app/(main)/dashboard/page.tsx`
- `app/(main)/modules/page.tsx`
- `app/(main)/resources/[slug]/page.tsx`
- `app/(main)/contact/page.tsx`
- `app/(main)/auth/signup/page.tsx`
- `app/b2b/dashboard/page.tsx`
- `app/layout.tsx`

**Backend files:**
- `backend/app/tasks/` (new drip email tasks)
- `backend/app/services/email_service.py` (new email templates)

---

## ✅ Success Metrics to Track

| Metric | Current | Goal (3mo) | Goal (12mo) |
|--------|---------|-----------|-----------|
| Header CTA CTR | 0% | 2% | 5% |
| Module upgrade modal conversion | — | 3% | 8% |
| Lawyer chat consultation booking | — | 2% | 5% |
| Dashboard widget engagement | — | 15% | 40% |
| Referral program participation | — | 10% | 25% |
| B2B seat expansion revenue | — | CHF 200/mo | CHF 800/mo |
| Email drip → paid conversion | — | 5% | 12% |
| **Total MRR increase** | Baseline | +2–3K/mo | +4–7K/mo |

---

**Last updated:** March 2, 2026

