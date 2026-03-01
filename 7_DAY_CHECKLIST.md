# ✅ ACTION CHECKLIST — Launch in 7 Days

## 🎯 GOAL: First Paying Customers in 7 Days

---

## DAY 1 (TODAY) — 2 hours

### Morning (1 hour)
- [ ] Read `EXECUTIVE_SUMMARY.md` (5 min)
- [ ] Sign up for Synthesia.io — https://www.synthesia.io/ (15 min)
  - Use code: `STARTUP50` for 50% off
  - Choose: Creator plan ($89/mo)
- [ ] Deploy exit intent popup (5 min)
  ```bash
  cd /home/supernovyl/sip/backend
  alembic upgrade head
  docker-compose restart backend
  ```
- [ ] Test exit intent popup (5 min)
  - Open: http://localhost:3000/pricing
  - Move mouse to top edge
  - Verify popup appears
  - Submit test email
  - Check database: `SELECT * FROM public.marketing_captures;`

### Afternoon (1 hour)
- [ ] Set up Meta Business Manager (30 min)
  - Go to: https://business.facebook.com/
  - Create business account
  - Add payment method (CHF 300)
- [ ] Install Facebook Pixel (30 min)
  - Get Pixel ID from Meta Business Manager
  - Add to `swiss-immigration-pro/app/layout.tsx`
  - Test with Chrome extension: "Facebook Pixel Helper"

**End of Day 1**: ✅ All accounts set up, exit intent live

---

## DAY 2 — 3 hours

### Morning (2 hours)
- [ ] Generate first 5 videos in Synthesia
  1. Open `VIDEO_ADS_SCRIPTS.md`
  2. Copy **Script #1** (30s rejection hook)
     - Generate 3 variations (different hooks)
     - Avatar: Anna (professional female)
  3. Copy **Script #4** (15s TikTok hook)
     - Generate 2 variations
     - Avatar: Alex (young, casual)
  4. Download all 5 videos

### Afternoon (1 hour)
- [ ] Quick edit videos in Descript or CapCut
  - Add 3-second logo intro
  - Add captions (auto-generate)
  - Export in 3 formats:
    - 16:9 (Facebook/YouTube)
    - 9:16 (Stories/Reels)
    - 1:1 (Instagram Feed)

**End of Day 2**: ✅ 5 videos ready for ads

---

## DAY 3 — 2 hours

### Morning (1 hour)
- [ ] Upload videos to Meta Ads Manager
  - Create new campaign
  - Objective: Conversions (Website)
  - Conversion event: Sign up
- [ ] Set up first ad set
  - Audience: EU nationals, 25-45
  - Interests: Switzerland, expat, relocation, immigration
  - Placements: Facebook Feed, Instagram Feed, Reels
  - Budget: CHF 100/day for 3 days

### Afternoon (1 hour)
- [ ] Create 3 ads (one per video variation)
  - Primary text: "Getting a Swiss work permit rejected? Here's why..."
  - Headline: "Get Your Swiss Work Permit Approved"
  - CTA button: "Sign Up"
  - Destination: https://swissimmigrationpro.com/auth/register
- [ ] Publish campaign
- [ ] Set up daily budget alerts (Slack/email)

**End of Day 3**: ✅ First ads running, targeting 10+ signups

---

## DAY 4 — 3 hours

### Morning (2 hours)
- [ ] Write first blog post
  - Title: "Complete Swiss Work Permit Guide 2026"
  - Length: 3,000+ words
  - Sections:
    - Types of permits (L, B, G, C)
    - Eligibility requirements
    - Application process
    - Common mistakes
    - Timeline & costs
    - FAQs
  - Add: FAQ schema markup, internal links, CTA to sign up

### Afternoon (1 hour)
- [ ] Publish blog post
- [ ] Share on Reddit:
  - r/Switzerland
  - r/IWantOut
  - r/expats
- [ ] Answer 3 Quora questions about Swiss immigration
  - Link back to blog post

**End of Day 4**: ✅ First content published, SEO started

---

## DAY 5 — 2 hours

### Morning (1 hour)
- [ ] Check ad performance in Meta Ads Manager
  - Impressions: Should have 10,000+
  - Clicks: Should have 50+
  - Signups: Should have 2-5
- [ ] Kill losing ads (CPA > CHF 75)
- [ ] Scale winning ads (+50% budget)

### Afternoon (1 hour)
- [ ] Email 20 expat bloggers (affiliate offer)
  - Find: Google "expat blogger switzerland"
  - Template:
    ```
    Subject: Partnership: Earn 30% recurring commissions

    Hi [Name],

    I love your content about [Switzerland/expat life]!

    I run Swiss Immigration Pro, an AI platform that helps people 
    navigate Swiss work permits & visas. I'd love to partner:

    - Earn 30% recurring commission (CHF 2.40-24 per referral)
    - Provide value to your audience
    - No upfront cost

    Interested? I'll send your affiliate link + promo kit.

    Best,
    [Your name]
    ```

**End of Day 5**: ✅ Ads optimized, first partnerships started

---

## DAY 6 — 2 hours

### Morning (1 hour)
- [ ] Set up Google Ads account
  - Go to: https://ads.google.com/
  - Add payment method (CHF 500)
- [ ] Create first Search campaign
  - Keywords:
    - "swiss work permit"
    - "swiss work visa"
    - "how to get swiss work permit"
    - "swiss immigration requirements"
  - Ad copy:
    - Headline 1: "Swiss Work Permit Guide"
    - Headline 2: "AI-Powered Application Help"
    - Description: "Get your Swiss work permit approved. Step-by-step guidance, AI chatbot, expert support. Start free."
  - Budget: CHF 50/day

### Afternoon (1 hour)
- [ ] Write 2 more blog posts:
  1. "Swiss Work Permit for EU Citizens: Complete Guide"
  2. "Swiss L Permit vs B Permit: Which Do You Need?"
- [ ] Publish both
- [ ] Share on social media

**End of Day 6**: ✅ Google ads running, more content live

---

## DAY 7 — 3 hours

### Morning (1 hour)
- [ ] Create YouTube channel
  - Name: "Swiss Immigration Pro"
  - Description: "Expert guidance for Swiss immigration, work permits, and citizenship"
  - Upload profile picture + banner (Canva)
- [ ] Upload first 3 videos:
  1. "Ultimate Swiss Work Permit Guide [2026]"
  2. "5 Mistakes That Get Your Swiss Visa Rejected"
  3. "Swiss Citizenship: Complete Timeline"
- [ ] Optimize titles, descriptions, tags

### Afternoon (2 hours)
- [ ] Weekly review meeting (with yourself)
  - What worked? (scale it)
  - What didn't? (kill it)
  - Metrics review:
    - Ad spend: CHF _____
    - Impressions: _____
    - Clicks: _____
    - Signups: _____ (target: 25+)
    - Paid conversions: _____ (target: 4+)
    - MRR: CHF _____ (target: CHF 116+)
- [ ] Plan Week 2:
  - Increase ad budget?
  - New video variations?
  - More content?
  - Partnership follow-ups?

**End of Day 7**: ✅ First week complete, metrics tracked, plan for Week 2

---

## 📊 EXPECTED RESULTS (7 Days)

| Metric | Target | Actual |
|--------|--------|--------|
| Ad spend | CHF 900 | ____ |
| Website visitors | 500 | ____ |
| Pricing views | 200 | ____ |
| Exit intent triggers | 40 | ____ |
| Email captures | 15 | ____ |
| New signups | 25 | ____ |
| Paid conversions | 4 | ____ |
| MRR | CHF 116 | ____ |

**If you hit these targets**: 🎉 You're on track for CHF 1,073 MRR in Month 1!

**If you're below targets**: 
- Check ad creative (compelling hook?)
- Check targeting (right audience?)
- Check landing page (loads fast? clear CTA?)
- Check pricing (too high? too confusing?)

---

## 🚨 DAILY TASKS (Every Day for 7 Days)

### Morning (30 min)
- [ ] Check ad dashboards (Meta, Google)
- [ ] Respond to support emails
- [ ] Check Stripe dashboard for new payments

### Evening (30 min)
- [ ] Post on social media (TikTok/Instagram/LinkedIn)
- [ ] Answer 1 Reddit/Quora question
- [ ] Review today's metrics (signups, conversions)

---

## 💰 BUDGET FOR 7 DAYS

| Item | Cost |
|------|------|
| Synthesia (monthly) | CHF 85 |
| Meta Ads (3 days) | CHF 300 |
| Google Ads (started) | CHF 100 |
| Descript/CapCut | CHF 15 |
| Canva Pro | CHF 3 |
| **Total** | **CHF 503** |

**Expected Return**: CHF 1,392 (annual value of 4 subscribers)
**7-Day ROI**: 2.8:1

---

## ✅ SUCCESS CRITERIA (7 Days)

### Minimum Viable Success
- [ ] 10+ signups
- [ ] 2+ paid conversions
- [ ] CHF 58+ MRR
- [ ] 1+ blog post published
- [ ] Ads running profitably (CPA < CHF 75)

### Target Success
- [ ] 25+ signups
- [ ] 4+ paid conversions
- [ ] CHF 116+ MRR
- [ ] 3+ blog posts published
- [ ] Ads running well (CPA < CHF 50)

### Stretch Success
- [ ] 50+ signups
- [ ] 8+ paid conversions
- [ ] CHF 232+ MRR
- [ ] 5+ blog posts published
- [ ] Ads running great (CPA < CHF 30)

---

## 🎯 WEEK 2 PREVIEW (If Week 1 Goes Well)

- [ ] Increase ad budget to CHF 1,500
- [ ] Launch LinkedIn ads (CHF 1,000)
- [ ] Email 50 more potential affiliates
- [ ] Generate 10 more videos (Synthesia)
- [ ] Write 5 more blog posts
- [ ] Launch TikTok account (organic)
- [ ] First webinar: "How to Get Swiss Work Permit in 90 Days"

**Week 2 Goal**: 50 signups, 7 paid conversions, CHF 203 MRR

---

## 📞 NEED HELP?

### Technical Issues
- Exit popup not showing? → Check `IMPLEMENTATION_GUIDE.md` → Troubleshooting
- Email not sending? → Check Resend API logs
- Database error? → Check migration ran successfully

### Marketing Questions
- Video not converting? → Try different hooks (Script variations)
- Ads too expensive? → Narrow targeting, improve landing page
- Low signups? → Check funnel (traffic → pricing → signup)

### Strategy Questions
- Read: `MARKETING_PLAN_2026.md` (full strategy)
- Read: `EXECUTIVE_SUMMARY.md` (quick overview)

---

## 🚀 LET'S GO!

**Today is Day 1.**

**Your first paying customer is 3-7 days away.**

**Your house down payment is 5 months away.**

**Stop reading. Start doing. Check the first box. 🎯**

---

*Checklist created: February 28, 2026*  
*Goal: CHF 400,000 in 5 months*  
*First milestone: CHF 116 MRR in 7 days*
