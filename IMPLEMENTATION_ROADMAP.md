# 🎯 IMPLEMENTATION ROADMAP — Layout & Page Revenue Ideas

**Status:** Ready to implement  
**Date:** March 2, 2026  
**Priority:** High ROI, low-complexity first

---

## 📋 QUICK START CHECKLIST (Week 1–2)

### [  ] **Phase 1A: Header & Footer CTAs** (4 hours)

#### Task 1: Add "Upgrade" CTA to MainHeader (for free users)
- [ ] Read current MainHeader logic in `/components/layout/MainHeader.tsx` (lines 1–100)
- [ ] Add conditional rendering: if `appUser.packId === 'free'`, show sticky "Upgrade to AI Lawyer" button
- [ ] Style: Blue button, 12px padding, positioned right of profile menu
- [ ] Track click via analytics.headerUpgradeCTA()
- [ ] **Files:** `MainHeader.tsx`
- **Time:** 1.5h

#### Task 2: Add "Pack Status" Badge to Header Profile Dropdown
- [ ] Show current pack tier + renewal date in dropdown
- [ ] Add "Upgrade" link below badge
- [ ] **Files:** `MainHeader.tsx`
- **Time:** 1h

#### Task 3: Update Footer CTAs (Context-Aware)
- [ ] Replace generic footer links with conditional CTAs:
  - Not logged in: "Start Free" + "View Pricing"
  - Free user: "Upgrade to AI Lawyer" + "See Plans"
  - Paid user: "Extend Pack" + "Book Consultation"
- [ ] **Files:** `Footer.tsx`
- **Time:** 1.5h

---

### [  ] **Phase 1B: Pricing Page Enhancements** (3 hours)

#### Task 4: Add Billing Cycle Toggle Animation
- [ ] Enhanced animation on toggle: pulsing "Save 20%" badge
- [ ] Use `framer-motion` for smooth scale/fade effect
- [ ] **Files:** `components/pricing/PricingCard.tsx`
- **Time:** 1h

#### Task 5: Coupon Code Input Field
- [ ] Add input field with "Have a coupon?" placeholder
- [ ] On input, validate against `DISCOUNT_CODES` from backend
- [ ] Show discount amount if valid: "You save CHF 15 with SAVE15"
- [ ] **Files:** `components/pricing/PricingContent.tsx`
- **Time:** 1.5h

#### Task 6: "Money-Back Guarantee" Banner
- [ ] Add top banner: "30-day money-back guarantee — no questions asked"
- [ ] Style: Green checkmark icon, subtle background
- [ ] **Files:** `components/pricing/PricingContent.tsx`
- **Time:** 0.5h

---

### [  ] **Phase 1C: Homepage & Quiz** (4 hours)

#### Task 7: Homepage Quiz CTA in Hero
- [ ] Add secondary button: "Take 2-min Quiz → See Your Visa Pathway (Free)"
- [ ] Link to `/quiz` page
- [ ] Analytics: homepageQuizCTA()
- [ ] **Files:** `components/home/HeroSection.tsx`
- **Time:** 1h

#### Task 8: Referral Callout Section on Homepage
- [ ] Add footer section before Footer: "Give CHF 10, Get CHF 10 — Refer a friend"
- [ ] Show user referral link if logged in; signup link if not
- [ ] **Files:** `app/(main)/page.tsx` or `components/home/CTASection.tsx`
- **Time:** 1.5h

#### Task 9: Expand Quiz with Progress Bar
- [ ] Change quiz questions to 8–10 questions (currently 3)
- [ ] Add progress bar: "3/8 questions complete"
- [ ] Add "Skip" button (optional)
- [ ] **Files:** `app/quiz/page.tsx`
- **Time:** 1.5h

---

### [  ] **Phase 1D: Resources & Contact** (2 hours)

#### Task 10: Exit-Intent Popup on Resource Pages
- [ ] Reuse `ExitIntentPopup` component
- [ ] Deploy to: `/app/(main)/resources/[slug]/page.tsx`
- [ ] Customize message: "Get 15% off our complete guides — Use SAVE15"
- [ ] **Files:** `app/(main)/resources/[slug]/page.tsx`
- **Time:** 1h

#### Task 11: Consultation CTA on Resources
- [ ] Add CTA at end of resource: "Need expert review? Book a CHF 80 consultation"
- [ ] Use dynamic text based on article topic (e.g., "B-Permit Application" → "Get your B-permit reviewed")
- [ ] **Files:** `app/(main)/resources/[slug]/page.tsx`
- **Time:** 1h

---

## 📊 PHASE 1 SUMMARY
**Total Time:** ~13 hours  
**Expected Revenue Lift:** CHF 850–1850/mo  
**Implementation Difficulty:** Low (mostly UI/copy tweaks)

---

## 📋 PHASE 2 CHECKLIST (Week 3–4)

### [  ] **Phase 2A: Module Upgrade Modal** (3 hours)

#### Task 12: Create UpgradeModal Component
- [ ] New component: `components/modules/UpgradeModal.tsx`
- [ ] Props: `onClose: () => void`, `featureGatingReason: string` (e.g., "module_lock")
- [ ] Display: "Unlock 10 modules + AI tutor for CHF 29/mo"
- [ ] Button: "Upgrade Now" → triggers checkout with pre-filled pack_id
- [ ] **Files:** `components/modules/UpgradeModal.tsx` (new)
- **Time:** 1.5h

#### Task 13: Integrate UpgradeModal into Module Pages
- [ ] Detect when free user tries to access locked module
- [ ] Trigger UpgradeModal instead of just showing "locked" state
- [ ] Track: moduleUpgradeModalShown(), moduleUpgradeModalClicked()
- [ ] **Files:** `components/modules/ModuleCard.tsx`, `app/(main)/modules/page.tsx`
- **Time:** 1.5h

---

### [  ] **Phase 2B: AI Lawyer Chat Upsell** (3 hours)

#### Task 14: Message Counter for Free Users
- [ ] Track messages in `UserLimit` model (already has `lawyer_messages_today`)
- [ ] On API call to `/api/lawyer/chat`, check if free user + message_count > 5
- [ ] Return modal trigger signal: `{ upsellModal: true, reason: "message_limit" }`
- [ ] **Files:** `backend/app/routers/lawyer.py`, `backend/app/models/user.py`
- **Time:** 1.5h

#### Task 15: Create ConsultationUpsellModal for Lawyer Chat
- [ ] New component: `components/lawyer/ConsultationUpsellModal.tsx`
- [ ] Display: "Want 1:1 guidance? Book a CHF 80 consultation with a Swiss employment lawyer"
- [ ] Show expertise areas: "B-Permit", "Citizenship", "Family Reunion"
- [ ] Button: "Book Now" → `/consultation/quick-book?type=quick&expertise=b_permit`
- [ ] Inject into `components/lawyer/SwissVirtualLawyer.tsx` at message 5
- [ ] **Files:** `components/lawyer/ConsultationUpsellModal.tsx` (new), `SwissVirtualLawyer.tsx`
- **Time:** 1.5h

---

### [  ] **Phase 2C: Dashboard Widgets** (4 hours)

#### Task 16: Referral Earnings Widget
- [ ] New component: `components/dashboard/ReferralEarningsWidget.tsx`
- [ ] Query `/api/referrals/stats` endpoint to get earnings
- [ ] Display: "You've earned CHF X from Y referrals — Share your link to earn more"
- [ ] Show share button (copy link to clipboard)
- [ ] **Files:** `components/dashboard/ReferralEarningsWidget.tsx` (new)
- **Time:** 1.5h

#### Task 17: Pack Status Widget
- [ ] New component: `components/dashboard/PackStatusWidget.tsx`
- [ ] Display: "[Pack Name] — Renews in X days — [Upgrade Button]"
- [ ] Color-coded: Green (>30 days), Yellow (7–30 days), Red (<7 days)
- [ ] **Files:** `components/dashboard/PackStatusWidget.tsx` (new)
- **Time:** 1h

#### Task 18: Integrate Widgets into Dashboard
- [ ] Update `/app/(main)/dashboard/page.tsx` to import and render both widgets
- [ ] Position: Top of dashboard, before other content
- [ ] **Files:** `app/(main)/dashboard/page.tsx`
- **Time:** 1.5h

---

### [  ] **Phase 2D: Backend Drip Email Tasks** (3 hours)

#### Task 19: Create Post-Quiz Drip Email Task
- [ ] New task: `backend/app/tasks/quiz_drip_emails.py`
- [ ] Trigger on quiz completion (webhook or sync call)
- [ ] Schedule emails:
  - Day 0: "Here's your personalized visa path" + link to quiz results
  - Day 1: "Top 5 mistakes to avoid" + module recommendation
  - Day 3: "Limited offer expires Friday — Get Immigration Pack for CHF 9"
  - Day 7: "Last chance — CHF 9 offer ends today"
- [ ] Use Celery `apply_async` with countdown timers
- [ ] **Files:** `backend/app/tasks/quiz_drip_emails.py` (new), `backend/app/routers/quiz.py` (trigger)
- **Time:** 2h

#### Task 20: Email Template Creation
- [ ] Create 4 email templates in `backend/app/services/email_service.py`:
  - `send_quiz_result_email()` — Day 0
  - `send_quiz_mistakes_email()` — Day 1
  - `send_quiz_offer_email()` — Day 3 & 7
- [ ] Use Resend API for delivery
- [ ] Include personalized visa pathway based on quiz answers
- [ ] **Files:** `backend/app/services/email_service.py`
- **Time:** 1h

---

## 📊 PHASE 2 SUMMARY
**Total Time:** ~13 hours  
**Expected Revenue Lift:** CHF 700–1500/mo  
**Implementation Difficulty:** Medium (modal UX, Celery tasks)

---

## 📋 PHASE 3 CHECKLIST (Month 2)

### [  ] **Phase 3A: PDF Upsells** (2 hours)

#### Task 21: PDF Module Download Button
- [ ] Add button at module end: "Download this guide as PDF + checklist — CHF 9"
- [ ] On click, trigger `/api/modules/{id}/download-pdf` endpoint
- [ ] Create checkout session: one-time product `module_pdf_{module_id}`
- [ ] **Files:** `components/modules/ModuleCard.tsx`, `backend/app/routers/modules.py`
- **Time:** 1h

#### Task 22: PDF Resource Download Button
- [ ] Add button on resource pages: "Download as PDF + checklist — CHF 9"
- [ ] Similar flow as modules
- [ ] **Files:** `app/(main)/resources/[slug]/page.tsx`
- **Time:** 1h

---

### [  ] **Phase 3B: B2B Seat Expansion** (3 hours)

#### Task 23: Create Seat Expansion Modal
- [ ] New component: `components/b2b/SeatExpansionModal.tsx`
- [ ] Detect if user is B2B admin + at seat limit
- [ ] Show: "You've used all 25 seats — Add 5 more for CHF 50/mo"
- [ ] Pricing varies by tier: Starter +5 seats @ CHF 50/mo, Business +10 @ CHF 80/mo
- [ ] **Files:** `components/b2b/SeatExpansionModal.tsx` (new)
- **Time:** 1.5h

#### Task 24: Integrate SeatExpansionModal into B2B Dashboard
- [ ] Monitor seat usage on `/app/b2b/dashboard`
- [ ] Trigger modal when user reaches 85% seat usage
- [ ] Show banner: "You have X seats used / Y total"
- [ ] **Files:** `app/b2b/dashboard/page.tsx`
- **Time:** 1.5h

---

### [  ] **Phase 3C: Marketplace Featured Tier** (3 hours)

#### Task 25: Create Marketplace Featured Tier UI
- [ ] Add "Featured Lawyer" badge + promotion section at top of marketplace
- [ ] Show featured lawyers with yellow star badge
- [ ] Add pricing callout: "Get 30% more inquiries — CHF 49/mo"
- [ ] **Files:** `app/marketplace/page.tsx`, `components/marketplace/FeaturedLawyerBanner.tsx` (new)
- **Time:** 1.5h

#### Task 26: Backend: Featured Tier Checkout
- [ ] Add new product to Stripe: `marketplace_featured_monthly`
- [ ] Create `/api/marketplace/featured/checkout` endpoint
- [ ] Update lawyer model with `featured_tier: bool`, `featured_expires_at: datetime`
- [ ] **Files:** `backend/app/routers/marketplace/lawyers.py`, `backend/app/services/stripe_service.py`
- **Time:** 1.5h

---

### [  ] **Phase 3D: Progress-Based Nudges** (2 hours)

#### Task 27: Progress Tracking Component
- [ ] Update module progress tracking: store completion percentage
- [ ] Trigger "almost there" nudge at 75% completion
- [ ] Show sticky CTA: "You're X% done — Upgrade to see the full guide"
- [ ] **Files:** `components/modules/ProgressBar.tsx` (enhance)
- **Time:** 1h

#### Task 28: Sticky CTA Implementation
- [ ] Component: `components/modules/AlmostThereCTA.tsx` (new)
- [ ] Only show for free users on free modules
- [ ] Analytics: progressNudgeShown(), progressNudgeClicked()
- [ ] **Files:** `components/modules/AlmostThereCTA.tsx` (new), modules page
- **Time:** 1h

---

### [  ] **Phase 3E: Consultation Recovery Emails** (2 hours)

#### Task 29: Post-Consultation Follow-Up Email
- [ ] New email: `send_consultation_confirmation_email()` improvement
- [ ] Add: pre-consultation prep guide, CV template link, success stories
- [ ] Trigger 1 day before consultation: reminder + what to prepare
- [ ] Trigger 1 day after consultation: "How was your session? + Book again at CHF 70"
- [ ] **Files:** `backend/app/services/email_service.py`, `backend/app/routers/consultations.py`
- **Time:** 1.5h

#### Task 30: Consultation Upsell Email
- [ ] Post-consultation follow-up: "Enjoyed your session? Book 3 consultations for CHF 200 (save CHF 40)"
- [ ] **Files:** `backend/app/services/email_service.py`
- **Time:** 0.5h

---

## 📊 PHASE 3 SUMMARY
**Total Time:** ~12 hours  
**Expected Revenue Lift:** CHF 1000–2000/mo  
**Implementation Difficulty:** Medium (various components, email sequences)

---

## 🎯 ROLLOUT TIMELINE

```
Week 1–2: Phase 1 (Quick Wins)
├─ Day 1–2: Header + Footer CTAs (4h)
├─ Day 3–4: Pricing page (3h)
├─ Day 5: Homepage + Quiz (4h)
└─ Day 6: Resources + Contact (2h)
Expected Launch: End of Week 2

Week 3–4: Phase 2 (High-Impact Modals)
├─ Day 1–2: Module upgrade modal (3h)
├─ Day 3–4: Lawyer chat upsell (3h)
├─ Day 5: Dashboard widgets (4h)
└─ Day 6–7: Drip email tasks (3h)
Expected Launch: End of Week 4

Month 2: Phase 3 (Refinement)
├─ Week 1: PDF upsells (2h)
├─ Week 2: B2B seat expansion (3h)
├─ Week 3: Marketplace featured tier (3h)
├─ Week 4: Progress nudges + consultation emails (4h)
Expected Launch: Staggered throughout month
```

---

## 💰 EXPECTED FINANCIAL IMPACT

| Phase | Timeline | Dev Hours | Monthly Revenue Lift | Cumulative |
|-------|----------|-----------|----------------------|------------|
| Phase 1 | Week 2 | 13h | CHF 850–1,850/mo | CHF 850–1,850 |
| Phase 2 | Week 4 | 13h | CHF 700–1,500/mo | CHF 1,550–3,350 |
| Phase 3 | Month 2 | 12h | CHF 1,000–2,000/mo | CHF 2,550–5,350 |
| **Total** | **8 weeks** | **38h** | **CHF 2,550–5,350/mo** | **CHF 30,600–64,200/year** |

---

## ✅ SUCCESS METRICS

### Before (Baseline)
- Header CTA CTR: 0%
- Module upgrade modal: N/A
- Lawyer chat → consultation booking: 0.5%
- Referral program engagement: <5%

### After Phase 1 (Week 2)
- Header CTA CTR: 1–2% (CHF 200–400/mo)
- Quiz CTA engagement: 3–5% of home visitors (CHF 300–600/mo)

### After Phase 2 (Week 4)
- Module upgrade modal: 2–3% conversion (CHF 400–800/mo)
- Lawyer chat → consultation: 1–2% (CHF 300–800/mo)
- Referral engagement: 10%+ (participations up 20%)

### After Phase 3 (Month 2)
- PDF upsells: CHF 300–500/mo
- B2B seat expansion: CHF 300–600/mo
- Marketplace featured tier: CHF 300–600/mo

---

## 🔧 DEPENDENCIES & RISKS

### Required Backend Endpoints (verify they exist)
- [ ] `GET /api/user/status` — Check pack tier
- [ ] `POST /api/checkout` — Initiate checkout
- [ ] `GET /api/referrals/stats` — Referral earnings
- [ ] `GET /api/modules/{id}` — Module metadata
- [ ] `POST /api/consultations/quick-book` — Instant booking
- [ ] `POST /api/marketplace/featured/checkout` — Featured tier checkout

### Risk: Payment Processing
- Ensure Stripe integration supports all products mentioned
- Test with test keys before deploying to production
- Verify discount code application works with new checkout flows

### Risk: Email Deliverability
- Resend API rate limits: ~100 emails/sec
- Monitor bounce rates on new drip sequences
- Set up feedback loops for failed emails

---

## 📝 DEPLOYMENT CHECKLIST

Before each phase:
- [ ] Code review (all components have TypeScript + no `any`)
- [ ] Unit tests for modal logic, form validation
- [ ] E2E tests for checkout flows (using test Stripe keys)
- [ ] Mobile responsiveness check (iOS + Android)
- [ ] Analytics tracking verified
- [ ] A/B test setup (track variants for CTA copy, colors)
- [ ] Backup database before deploying
- [ ] Staging environment tested
- [ ] Production deploy during low-traffic hours

---

## 🎓 LEARNING & ITERATION

After each phase, measure:
1. **Conversion rate by component** (which CTAs convert best?)
2. **Revenue per impression** (which ideas drive the highest ROI?)
3. **Churn impact** (do upgrade modals increase churn?)
4. **Email performance** (open rate, click rate, conversion)
5. **User satisfaction** (do surveys show negative sentiment on modals?)

Iterate quickly: swap low-performing CTAs, adjust pricing, test new copy variations.

---

**Last updated:** March 2, 2026  
**Ready to implement:** Yes

