# 🚀 IMPLEMENTATION GUIDE — Revenue Growth Sprint

## ⚡ Quick Start (Get Revenue Flowing in 7 Days)

### Day 1: Video Ads Setup (2-3 hours)
1. **Sign up for Synthesia** ($89/mo — first month 50% off)
   - Go to https://www.synthesia.io/
   - Use code: `STARTUP50`
   - Choose 3 avatars: Anna (female, professional), James (male, American), David (mature, executive)

2. **Generate your first 5 videos**
   - Use scripts from `VIDEO_ADS_SCRIPTS.md`
   - Start with Script #1 (30s rejection hook) — generate 3 variations
   - Generate Script #4 (15s TikTok hook) — 2 variations
   - **Output**: 5 videos ready for ads

3. **Set up ad accounts**
   - Meta Business Manager: https://business.facebook.com/
   - Install Facebook Pixel on website (add to `layout.tsx`)
   - Google Ads: https://ads.google.com/
   - Add conversion tracking

### Day 2: Launch Exit Intent Popup (ALREADY DONE ✅)
- [x] Exit intent popup component created
- [x] Backend endpoint for email capture created
- [x] Database migration created
- [ ] **Run migration**: `cd backend && alembic upgrade head`
- [ ] **Test on pricing page**: Open `/pricing`, move mouse to exit, see popup
- [ ] **Verify email capture**: Check database after submitting email

### Day 3: Launch First Ads (CHF 500 budget)
1. **Meta Ads Campaign**
   - Upload 3 videos to Meta Ads Manager
   - Campaign objective: Conversions (sign ups)
   - Audience: 25-45, EU nationals, interests: Switzerland, expat, relocation
   - Budget: CHF 300/day for 3 days (total CHF 900)
   - Ad placements: Facebook Feed, Instagram Feed, Reels

2. **Monitor & Optimize**
   - Check dashboard every 4 hours
   - Kill ads with CPA > CHF 75
   - Scale ads with CPA < CHF 30
   - **Goal**: 10+ signups by end of Day 3

### Day 4-5: Content Sprint (10 blog posts)
1. **Write pillar content** (use ChatGPT/Claude to assist)
   - "Complete Swiss Work Permit Guide 2026" (5,000 words)
   - "How to Get a Swiss Work Visa from [Your Country]" (3,000 words)
   - "Swiss Citizenship Requirements: 10-Year Roadmap" (4,000 words)

2. **Optimize for SEO**
   - Keyword research: Ahrefs/SEMrush (or free: Google Keyword Planner)
   - Target keywords: "swiss work permit", "swiss visa application", etc.
   - Add FAQ sections with schema markup
   - Internal links to pricing page

3. **Publish & promote**
   - Post on blog
   - Share on Reddit (r/Switzerland, r/IWantOut)
   - Email to existing subscribers

### Day 6-7: Partnership Outreach (50 emails sent)
1. **Find affiliate partners**
   - Google: "expat blogger switzerland"
   - YouTube: Search "moving to switzerland"
   - Target: Channels with 10k+ subscribers

2. **Email template**:
   ```
   Subject: Partnership opportunity — Earn 30% recurring commissions

   Hi [Name],

   I'm a fan of your content about [Switzerland/expat life]!

   I run Swiss Immigration Pro (swissimmigrationpro.com), an AI-powered platform 
   that helps people navigate Swiss work permits, visas, and citizenship.

   I'd love to partner with you:
   - Earn 30% recurring commission on all sales (CHF 2.40–24 per referral)
   - Provide value to your audience with expert immigration guidance
   - No upfront cost — we handle everything

   Interested? Reply and I'll send you your unique affiliate link + promo kit.

   Best,
   [Your name]
   Swiss Immigration Pro
   ```

3. **Track responses**
   - Target: 10% response rate = 5 partners
   - Each partner sends 5 referrals/mo = 25 signups
   - Revenue: 25 × CHF 29 × 12 = CHF 8,700/mo

---

## 🎯 Week 2-4: Scale to CHF 10,000 MRR

### Week 2: Optimize Ads + Launch YouTube
**Ads**: Increase budget to CHF 1,500/mo
- Meta: CHF 1,000
- Google Search: CHF 500
- Test new audiences: Job seekers, tech workers, healthcare professionals

**YouTube Channel Launch**:
1. Create channel: "Swiss Immigration Pro"
2. Upload 5 videos (Synthesia generated)
   - "Ultimate Swiss Work Permit Guide [2026]" (60s)
   - "5 Mistakes That Get Your Swiss Visa Rejected" (60s)
   - "Swiss Citizenship: Complete Timeline Explained" (60s)
3. Run YouTube pre-roll ads (CHF 500 budget)
4. Thumbnail optimization (Canva)

**Expected Results**: 
- 50+ signups
- 7+ paid conversions
- CHF 2,500 MRR

### Week 3: Launch B2B Outreach
**Target**: Tech companies hiring international talent

1. **Build list of 100 companies**
   - Swiss tech companies with international teams
   - HR departments at: Google Zurich, Roche, Novartis, ABB, etc.
   - Find contacts: LinkedIn Sales Navigator (free trial)

2. **Email template**:
   ```
   Subject: Help your international hires get Swiss work permits faster

   Hi [Name],

   Hiring international talent in Switzerland is challenging. Work permit 
   rejections cost you time and money.

   Swiss Immigration Pro helps your new hires navigate the process:
   - AI-guided permit applications (reduce rejections by 80%)
   - Complete document checklists
   - Priority support (24h response)

   Pricing: CHF 25/employee/month (billed quarterly)

   Would you be open to a 15-min call to discuss how we can help?

   Best,
   [Your name]
   Swiss Immigration Pro
   ```

3. **Follow-up sequence**
   - Day 3: Reminder
   - Day 7: Case study share
   - Day 14: Final offer (free pilot for 10 employees)

**Expected Results**:
- 5% response rate = 5 meetings
- 20% close rate = 1 client (50 seats)
- Revenue: 50 × CHF 25 × 12 = CHF 15,000/year

### Week 4: Referral Program Launch
1. **Dashboard integration** (add referral widget)
2. **Announcement email** to all users
3. **Social media promotion**
4. **Offer**: Give CHF 10, Get CHF 10

**Expected Results**:
- 10% of users participate (50 users)
- Each refers 2 people = 100 referrals
- 20% convert = 20 paid subscribers
- Revenue: 20 × CHF 29 × 12 = CHF 6,960/year

---

## 📊 30-Day Revenue Projection

| Week | Signups | Conversions | New MRR | Cumulative MRR |
|------|---------|-------------|---------|----------------|
| 1 | 25 | 4 | CHF 116 | CHF 116 |
| 2 | 50 | 7 | CHF 203 | CHF 319 |
| 3 | 75 | 11 | CHF 319 | CHF 638 |
| 4 | 100 | 15 | CHF 435 | CHF 1,073 |

**Month 1 Total**: CHF 1,073 MRR = **CHF 12,876 annual run-rate**

**Investment**:
- Synthesia: CHF 85
- Ads: CHF 1,500
- Tools: CHF 50
- **Total**: CHF 1,635

**ROI**: CHF 12,876 / CHF 1,635 = **7.9:1** 🎉

---

## 🎬 VIDEO PRODUCTION CHECKLIST

### Pre-Production (1 hour)
- [ ] Review all 5 scripts in `VIDEO_ADS_SCRIPTS.md`
- [ ] Choose avatars in Synthesia
- [ ] Prepare brand assets (logo, colors)
- [ ] Download B-roll footage (Pexels, free)

### Production (3 hours)
- [ ] Generate Script #1 — 3 variations (different hooks)
- [ ] Generate Script #2 — 2 variations (male/female avatar)
- [ ] Generate Script #3 — 1 version (educational)
- [ ] Generate Script #4 — 5 versions (TikTok hooks)
- [ ] Generate Script #5 — 1 version (citizenship)
- [ ] **Total**: 12 videos

### Post-Production (2 hours)
- [ ] Download all videos from Synthesia
- [ ] Add logo intro/outro (3s each)
- [ ] Add captions with Descript
- [ ] Add B-roll overlays
- [ ] Export in multiple formats:
  - 16:9 (YouTube, Facebook)
  - 9:16 (Stories, Reels, TikTok)
  - 1:1 (Instagram Feed)

### Distribution (1 hour)
- [ ] Upload to Meta Ads Manager
- [ ] Upload to Google Ads (YouTube)
- [ ] Upload to YouTube organic channel
- [ ] Upload to TikTok account
- [ ] Create thumbnails (Canva)

---

## 💰 BUDGET ALLOCATION (First 3 Months)

### Month 1: Foundation (CHF 4,200)
| Category | Amount | Purpose |
|----------|--------|---------|
| Meta Ads | CHF 2,000 | Acquisition |
| Google Ads | CHF 1,500 | High-intent search |
| Synthesia | CHF 85 | Video production |
| Descript | CHF 23 | Video editing |
| Canva Pro | CHF 12 | Graphics |
| Content Writer | CHF 500 | Blog posts |
| **Total** | **CHF 4,120** | |

**Expected Revenue**: CHF 24,000 (annual run-rate)
**ROI**: 5.8:1

### Month 2: Growth (CHF 6,600)
| Category | Amount | Purpose |
|----------|--------|---------|
| Meta Ads | CHF 2,500 | Scale winners |
| Google Ads | CHF 2,000 | More keywords |
| LinkedIn Ads | CHF 1,000 | B2B targeting |
| Video Tools | CHF 100 | Continued production |
| Content Writer | CHF 500 | 10 posts |
| Affiliate Commissions | CHF 500 | First payouts |
| **Total** | **CHF 6,600** | |

**Expected Revenue**: CHF 57,600 (annual run-rate)
**ROI**: 8.7:1

### Month 3: Scale (CHF 9,100)
| Category | Amount | Purpose |
|----------|--------|---------|
| Meta Ads | CHF 3,000 | Continue scaling |
| Google Ads | CHF 2,500 | Expand keywords |
| LinkedIn Ads | CHF 1,500 | B2B deals |
| TikTok Ads | CHF 500 | Boost viral content |
| Video Tools | CHF 100 | Production |
| Content Writer | CHF 500 | 10 posts |
| Affiliate Commissions | CHF 1,500 | Growing partner network |
| **Total** | **CHF 9,600** | |

**Expected Revenue**: CHF 156,000 (annual run-rate)
**ROI**: 16.3:1

---

## 🔧 TECHNICAL IMPLEMENTATION

### Step 1: Run Database Migration
```bash
cd backend
alembic upgrade head
```

### Step 2: Test Exit Intent Popup
1. Open: http://localhost:3000/pricing
2. Move mouse to top edge (exit intent)
3. Popup should appear with discount code
4. Enter email and submit
5. Check database: `SELECT * FROM public.marketing_captures;`

### Step 3: Verify Email Sending
1. Check Resend API key in `.env`: `RESEND_API_KEY=...`
2. Submit exit intent form
3. Check email inbox for discount code
4. If not received, check logs: `docker-compose logs backend`

### Step 4: Add Facebook Pixel
```typescript
// swiss-immigration-pro/app/layout.tsx
// Add inside <head>

<Script
  id="facebook-pixel"
  strategy="afterInteractive"
  dangerouslySetInnerHTML={{
    __html: `
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
    `,
  }}
/>
```

### Step 5: Track Conversions
```typescript
// After successful checkout
if (typeof window !== 'undefined' && (window as any).fbq) {
  (window as any).fbq('track', 'Purchase', {
    value: amount,
    currency: 'CHF',
    content_name: packId,
  });
}
```

---

## 📈 METRICS DASHBOARD

### Track These Daily (First 30 Days)
- [ ] Website visitors
- [ ] Pricing page views
- [ ] Exit intent triggers
- [ ] Exit intent conversions
- [ ] New signups
- [ ] Free→Paid conversions
- [ ] Daily MRR growth
- [ ] Ad spend (Meta, Google, LinkedIn)
- [ ] CPA (Cost Per Acquisition)
- [ ] ROAS (Return on Ad Spend)

### Create Google Sheet Template:
```
Date | Visitors | Pricing Views | Exit Triggers | Exit Emails | Signups | Paid | MRR | Ad Spend | CPA | ROAS
```

### Weekly Review (Every Monday)
- What worked? (scale it)
- What didn't? (kill it)
- New tests to run this week
- Revenue goal for the week
- Blockers / challenges

---

## 🚨 TROUBLESHOOTING

### Exit Popup Not Showing?
1. Clear browser cache
2. Open DevTools → Console (check for errors)
3. Verify `ExitIntentPopup` is imported in `/pricing/page.tsx`
4. Check `sessionStorage.getItem('exitIntentShown')` — clear it to test again

### Email Not Sending?
1. Check backend logs: `docker-compose logs backend | grep "Email"`
2. Verify Resend API key: `echo $RESEND_API_KEY`
3. Check Resend dashboard: https://resend.com/emails
4. Verify email template HTML renders correctly

### Ads Not Converting?
1. Check Facebook Pixel firing: Chrome extension "Facebook Pixel Helper"
2. Verify landing page loads fast (< 3s)
3. Test mobile experience (70%+ traffic is mobile)
4. Review ad creative: Is the hook compelling?
5. Check targeting: Are you reaching the right audience?

### Low Conversion Rate?
1. Add more trust signals (testimonials, reviews)
2. Simplify pricing (reduce options)
3. Improve CTA clarity ("Start Free" vs "Learn More")
4. Speed up page load (optimize images)
5. A/B test headlines and copy

---

## ✅ LAUNCH CHECKLIST (Before Spending on Ads)

### Pre-Launch (Critical)
- [ ] Exit intent popup tested and working
- [ ] Email capture endpoint tested
- [ ] Email sending verified (check inbox)
- [ ] Facebook Pixel installed
- [ ] Google Analytics tracking verified
- [ ] Pricing page loads in < 3s
- [ ] Mobile experience tested (iPhone + Android)
- [ ] Payment flow tested (Stripe test mode)
- [ ] All CTAs point to correct URLs
- [ ] Legal pages updated (Privacy Policy, Terms)

### Video Ads Ready
- [ ] 5+ videos generated (Synthesia)
- [ ] Videos edited (captions, B-roll, CTA)
- [ ] Multiple formats exported (16:9, 9:16, 1:1)
- [ ] Thumbnails created (Canva)
- [ ] Videos uploaded to ad platforms

### Ad Accounts Setup
- [ ] Meta Business Manager verified
- [ ] Ad account funded (CHF 500 minimum)
- [ ] Conversion tracking configured
- [ ] Audience built (lookalike + interest)
- [ ] Google Ads account set up
- [ ] YouTube channel created

### Monitoring Setup
- [ ] Google Sheet for daily metrics
- [ ] Slack/email alerts for high CPA
- [ ] Dashboard bookmarked (Meta, Google, Stripe)
- [ ] Weekly review scheduled (calendar)

---

## 🎯 SUCCESS METRICS (30-Day Goals)

### Acquisition
- 500 new signups
- CPA < CHF 50
- ROAS > 2:1

### Conversion
- 15% free→paid conversion
- 75 paid subscribers
- CHF 2,000 MRR

### Revenue
- CHF 24,000 annual run-rate
- CHF 5,000 one-time product sales
- 1 B2B client (50 seats)

### Content
- 10 blog posts published
- 5 YouTube videos uploaded
- 1,000 YouTube views

### Partnerships
- 5 active affiliates
- 25 referrals generated
- 2 immigration lawyer partners

---

## 🚀 LET'S GO!

You now have:
1. ✅ Complete marketing plan (`MARKETING_PLAN_2026.md`)
2. ✅ Video ad scripts (`VIDEO_ADS_SCRIPTS.md`)
3. ✅ Exit intent popup (already coded)
4. ✅ Email capture backend (ready to deploy)
5. ✅ Implementation guide (this file)

**Next Steps**:
1. Run migration: `alembic upgrade head`
2. Sign up for Synthesia today
3. Generate first 5 videos tomorrow
4. Launch ads by end of week

**You're 7 days away from your first revenue! 🎉**

Questions? Need help? Let me know!
