# Marketing AI Agent Catalog — Gemini Enterprise Field Kit

**Department:** Marketing
**Total Agents:** 65 across 9 domains
**Approach:** Domain-native structure sequenced along the marketing value chain (Research → Plan → Create → Distribute → Engage → Convert → Measure → Optimize)

---

## Three-Layer Capability Model

Every agent is decomposed into three capability layers. The value of the AI agent is the LLM Reasoning layer — everything else is necessary plumbing that could exist without AI.

| Layer | What It Is | Example Tech |
|-------|-----------|-------------|
| **Integration & Orchestration** | API calls, data movement, workflow triggers, scheduled jobs, notifications, system-to-system plumbing, file routing | Cloud Workflows, Workato, Zapier, native CRM/MAP integrations, webhook listeners |
| **Traditional ML / Analytics** | Classification, propensity scoring, time-series forecasting, clustering, attribution modeling, statistical analysis | BigQuery ML, scikit-learn, GA4 predictive audiences, Looker, XGBoost |
| **LLM Reasoning** | Natural language understanding, synthesis across unstructured sources, contextual generation, multi-step reasoning over ambiguous inputs, judgment under uncertainty | Gemini, Vertex AI, RAG pipelines |

---

## Domain Structure Overview

| # | Domain | Value-Chain Stage | Owner Persona | Agent Count |
|---|--------|-------------------|---------------|-------------|
| **M1** | Marketing Strategy & Planning | PLAN | CMO / VP Marketing | 7 |
| **M2** | Content & Creative Operations | CREATE | Content Strategist / Brand Manager | 8 |
| **M3** | Demand Generation & Campaigns | DISTRIBUTE | Demand Gen Manager / Digital Marketing Mgr | 8 |
| **M4** | Digital Marketing & SEO/SEM | DISTRIBUTE | SEO/SEM Specialist / Digital Marketing Mgr | 7 |
| **M5** | Social Media & Community | ENGAGE | Social Media Mgr / Content Strategist | 6 |
| **M6** | Marketing Analytics & Attribution | MEASURE | Marketing Analyst / Marketing Ops Lead | 8 |
| **M7** | Brand & Communications | ENGAGE | Brand Manager / CMO | 7 |
| **M8** | Marketing Operations & MarTech | OPTIMIZE | Marketing Ops Lead / VP Marketing | 7 |
| **M9** | Customer & Market Intelligence | RESEARCH | Product Marketing Mgr / Marketing Analyst | 7 |

---

## Personas (12)

| Persona | Focus Areas | Key Domains |
|---------|-------------|-------------|
| **CMO** | Marketing strategy, brand stewardship, board-level reporting, budget allocation, growth targets | M1, M7, M6 |
| **VP Marketing** | Cross-functional execution, pipeline targets, team leadership, budget management | M1, M3, M8 |
| **Brand Manager** | Brand identity, messaging consistency, creative standards, reputation management | M7, M2 |
| **Content Strategist** | Editorial planning, content production, asset management, SEO content | M2, M5 |
| **Demand Gen Manager** | Campaign execution, pipeline generation, lead nurturing, conversion optimization | M3, M6 |
| **Digital Marketing Mgr** | Website, paid media, email, marketing automation, digital channel performance | M3, M4 |
| **Social Media Mgr** | Social publishing, community engagement, influencer relations, social listening | M5 |
| **Marketing Analyst** | Attribution, dashboards, A/B testing, ROI analysis, data governance | M6, M9 |
| **SEO/SEM Specialist** | Organic search, paid search, keyword strategy, technical SEO, ad optimization | M4 |
| **Marketing Ops Lead** | MarTech stack, data hygiene, workflow automation, lead management, integration | M8, M6 |
| **Product Marketing Mgr** | Positioning, competitive intelligence, sales enablement, launch planning | M9, M7 |
| **Field Marketing Mgr** | Regional events, ABM programs, partner marketing, local demand gen | M3, M5 |

---

## M1: Marketing Strategy & Planning (7 Agents)

### M1-01: Marketing Plan Generator

- **Systems:** Google Workspace, Salesforce CRM, HubSpot, BigQuery, Vertex AI
- **Trigger:** Scheduled (quarterly planning cycle)
- **HITL:** CMO approval
- **Layer:** 3 (Custom ADK)
- **Integration & Orchestration:** Pull pipeline data from Salesforce, historical campaign performance from HubSpot, revenue targets from finance systems, schedule quarterly generation, deliver draft plan to CMO
- **Traditional ML / Analytics:** Trend analysis on pipeline conversion rates, channel mix optimization based on historical CAC/LTV, budget allocation modeling using diminishing returns curves
- **LLM Reasoning:** Synthesize quarterly revenue targets, historical campaign performance, competitive landscape, and product launch calendar into a coherent marketing plan narrative. Reason about which channels deserve incremental investment vs. sunset based on diminishing returns and market shifts. Draft a plan document that a CMO can present to the board — with strategic rationale, not just budget tables.

### M1-02: Budget Allocator & Forecaster

- **Systems:** Anaplan, HubSpot, Google Ads, Meta Ads Manager, BigQuery, Looker
- **Trigger:** Scheduled (monthly)
- **HITL:** VP Marketing approval
- **Layer:** 4 (Data Agent)
- **Integration & Orchestration:** Pull spend actuals from ad platforms and MAP, aggregate budget vs. actual by channel and campaign, feed Looker dashboards, send variance alerts
- **Traditional ML / Analytics:** Spend pacing prediction, channel-level ROI forecasting via marketing mix modeling, Monte Carlo simulation on budget scenarios, diminishing returns curve fitting
- **LLM Reasoning:** Interpret why a channel is underperforming its forecast — read campaign notes, creative change logs, and market context ("competitor launched aggressive pricing in our core segment") to explain variance beyond the numbers. Generate budget reallocation recommendations with business rationale for the VP Marketing.

### M1-03: Competitive Intelligence Monitor

- **Systems:** SEMrush, Crayon, Google News API, LinkedIn, Vertex AI, BigQuery
- **Trigger:** Scheduled (weekly) + Event (competitor announcement detected)
- **HITL:** --
- **Layer:** 3 (Custom ADK)
- **Integration & Orchestration:** Poll competitor websites via SEMrush, ingest news feeds, monitor LinkedIn company pages, aggregate signals into BigQuery, push alerts on significant changes
- **Traditional ML / Analytics:** Share of voice tracking, keyword ranking comparison, ad spend estimation, pricing change detection via web scraping
- **LLM Reasoning:** Read a competitor's blog post announcing a product launch and reason about its impact on your positioning — even when the language is marketing-speak that requires interpretation. Synthesize SEMrush ranking data, news signals, and product comparisons into an actionable competitive brief: "Competitor X is investing heavily in enterprise features — their ad spend on enterprise keywords up 45% MoM — recommend adjusting messaging to emphasize our integration advantage."

### M1-04: GTM Launch Planner

- **Systems:** Asana, Google Workspace, Salesforce CRM, HubSpot, Slack, Vertex AI
- **Trigger:** Event (product launch initiated)
- **HITL:** VP Marketing approval
- **Layer:** 3 (Custom ADK)
- **Integration & Orchestration:** Create project plan in Asana from launch template, assign tasks across marketing functions, set up HubSpot campaign, schedule Slack notifications at milestones
- **Traditional ML / Analytics:** Historical launch performance benchmarking, timeline risk scoring based on past delays, resource utilization prediction
- **LLM Reasoning:** Interpret product requirements documents and positioning briefs to generate tailored launch checklists. Reason about which channels and tactics are appropriate for different launch tiers (major product vs. feature update vs. partnership announcement). Draft launch messaging frameworks and coordinate cross-functional dependencies.

### M1-05: Audience Segmentation Engine

- **Systems:** Salesforce CRM, HubSpot, 6sense, BigQuery, Vertex AI
- **Trigger:** Scheduled (monthly)
- **HITL:** --
- **Layer:** 4 (Data Agent)
- **Integration & Orchestration:** Pull contact and account data from CRM, behavioral data from HubSpot, intent data from 6sense, aggregate in BigQuery, push segments back to MAP
- **Traditional ML / Analytics:** K-means clustering on firmographic and behavioral attributes, propensity scoring, RFM segmentation, lookalike modeling from best customer profiles
- **LLM Reasoning:** Interpret qualitative signals that don't fit into scoring models — read a prospect's recent blog post that signals they're evaluating solutions, or a job posting that indicates org changes. Synthesize quantitative segments with qualitative context to create segment narratives that help demand gen teams personalize outreach.

### M1-06: Campaign Calendar Orchestrator

- **Systems:** Asana, HubSpot, Google Calendar, Salesforce CRM, Slack
- **Trigger:** Scheduled (weekly) + Event (campaign created/modified)
- **HITL:** --
- **Layer:** 2 (Agent Designer)
- **Integration & Orchestration:** Sync campaigns from HubSpot with Asana timelines, detect scheduling conflicts, send weekly digest of upcoming campaigns, alert on resource over-allocation, coordinate cross-campaign dependencies
- **Traditional ML / Analytics:** Optimal send-time prediction based on historical engagement, conflict detection for audience overlap across concurrent campaigns
- **LLM Reasoning:** When two campaigns target overlapping audiences in the same week, reason about which should take priority based on funnel stage, deal size potential, and historical response fatigue. Generate weekly campaign summary narratives for leadership.

### M1-07: Marketing OKR Tracker

- **Systems:** Salesforce CRM, HubSpot, Google Analytics 4, Looker, Google Workspace
- **Trigger:** Scheduled (weekly)
- **HITL:** --
- **Layer:** 4 (Data Agent)
- **Integration & Orchestration:** Pull KPIs from CRM (pipeline, bookings), MAP (MQLs, engagement), GA4 (traffic, conversion), aggregate in Looker, generate weekly OKR progress report
- **Traditional ML / Analytics:** Trajectory forecasting — given current run rate, will each KR be achieved by quarter-end? Confidence intervals on target achievement, pacing analysis
- **LLM Reasoning:** Interpret why specific OKRs are off-track by correlating multiple data sources. "MQL target is at 62% with 3 weeks left — the gap traces to lower-than-expected webinar attendance (competitor event on same day) and delayed product launch content. Recommend: accelerate paid campaign M3-04 by 1 week."

---

## M2: Content & Creative Operations (8 Agents)

### M2-01: Content Brief Generator

- **Systems:** SEMrush, Ahrefs, Google Analytics 4, WordPress, Vertex AI
- **Trigger:** Chat (content strategist requests brief)
- **HITL:** Content Strategist review
- **Layer:** 1 (OOTB)
- **Integration & Orchestration:** Pull keyword data from SEMrush/Ahrefs, fetch competitor content rankings, retrieve internal content performance from GA4, deliver brief via Google Docs
- **Traditional ML / Analytics:** Keyword gap analysis, content scoring against top-ranking competitors, estimated organic traffic potential
- **LLM Reasoning:** Analyze the top 10 ranking pages for a target keyword and identify content gaps — not just missing subtopics, but structural and depth advantages. Draft a comprehensive content brief with recommended angle, outline, word count, internal linking suggestions, and differentiation strategy. Understand search intent ("best CRM for startups" needs comparison format, not product page).

### M2-02: Long-Form Content Drafter

- **Systems:** Google Docs, WordPress, Contentful, Vertex AI
- **Trigger:** Event (brief approved)
- **HITL:** Content Strategist review
- **Layer:** 1 (OOTB)
- **Integration & Orchestration:** Receive approved brief, generate draft in Google Docs, apply brand style guide formatting, flag sections needing SME input, publish to WordPress/Contentful after approval
- **Traditional ML / Analytics:** Readability scoring (Flesch-Kincaid), keyword density optimization, internal link recommendation based on content graph
- **LLM Reasoning:** Transform a content brief into a draft blog post, whitepaper, or guide that reads as if written by a domain expert — with original analysis, relevant examples, and a clear narrative arc. Maintain brand voice while adapting tone to the content type (thought leadership vs. how-to vs. comparison guide). Generate multiple headline options with reasoning for each.

### M2-03: Creative Asset Generator

- **Systems:** Figma, Canva, Google Drive, DAM (Bynder/Brandfolder), Vertex AI
- **Trigger:** Event (campaign asset request)
- **HITL:** Brand Manager review
- **Layer:** 3 (Custom ADK)
- **Integration & Orchestration:** Receive asset request with specifications, pull brand templates from DAM, generate asset variations, route for approval, publish approved assets to DAM
- **Traditional ML / Analytics:** Historical performance scoring of visual elements (colors, layouts, CTAs), A/B test result aggregation across creative variants
- **LLM Reasoning:** Interpret campaign briefs to generate ad copy, social media graphics text, email header copy, and display ad variations that align with brand guidelines. Reason about which messaging angle will resonate based on the target audience segment and funnel stage. Generate alt-text and accessibility descriptions for visual assets.

### M2-04: Content Performance Analyzer

- **Systems:** Google Analytics 4, HubSpot, WordPress, SEMrush, BigQuery, Looker
- **Trigger:** Scheduled (weekly)
- **HITL:** --
- **Layer:** 4 (Data Agent)
- **Integration & Orchestration:** Pull page-level analytics from GA4, content engagement from HubSpot, ranking data from SEMrush, aggregate in BigQuery, feed Looker content dashboard
- **Traditional ML / Analytics:** Content decay detection (traffic decline patterns), engagement scoring (time on page, scroll depth, CTA clicks), conversion attribution at content level, topic cluster performance
- **LLM Reasoning:** Explain why a blog post that was performing well lost 40% traffic — correlate with algorithm updates, new competitor content, or content freshness decay. Generate content optimization recommendations: "This post ranks #4 for 'marketing automation guide' but is missing sections on AI-powered automation that the #1 and #2 results cover extensively. Estimated traffic gain from update: 2,400 visits/month."

### M2-05: Email Copy Optimizer

- **Systems:** HubSpot, Marketo, Salesforce Marketing Cloud, Vertex AI
- **Trigger:** Event (email campaign created)
- **HITL:** --
- **Layer:** 1 (OOTB)
- **Integration & Orchestration:** Receive email draft from MAP, generate subject line and preheader variations, set up A/B test configurations, track open/click rates, push winning variant
- **Traditional ML / Analytics:** Historical open rate prediction by segment, click-through rate optimization, send time optimization, subject line scoring model
- **LLM Reasoning:** Analyze the email body and generate 5 subject line variations that match the content's value proposition but test different psychological triggers (curiosity, urgency, social proof, specificity). Adapt copy tone for different segments — enterprise vs. SMB, new lead vs. customer. Review email body for clarity, CTA strength, and mobile readability.

### M2-06: Content Repurposing Agent

- **Systems:** Google Docs, WordPress, Canva, HubSpot, LinkedIn, Vertex AI
- **Trigger:** Event (long-form content published)
- **HITL:** Content Strategist approval
- **Layer:** 1 (OOTB)
- **Integration & Orchestration:** Detect new content publication, generate derivative assets, queue for approval, publish approved assets to respective channels (social, email, blog snippets)
- **Traditional ML / Analytics:** Channel-specific format performance analysis, optimal content length by platform, engagement prediction for derivatives
- **LLM Reasoning:** Take a 3,000-word blog post and intelligently repurpose it into 5 LinkedIn posts, 3 tweet threads, an email newsletter section, an infographic outline, and a video script — each adapted for the platform's style and audience expectations. Not mechanical extraction but creative reframing that preserves the core insight while fitting the medium.

### M2-07: Brand Voice Checker

- **Systems:** Google Docs, WordPress, Contentful, HubSpot, Vertex AI
- **Trigger:** Event (content submitted for review)
- **HITL:** --
- **Layer:** 3 (Custom ADK)
- **Integration & Orchestration:** Hook into content submission workflows, scan submitted content, flag deviations, return annotated feedback to authors
- **Traditional ML / Analytics:** Style consistency scoring against brand guidelines, terminology compliance checking, readability metrics
- **LLM Reasoning:** Read any piece of marketing content and assess whether it sounds like "us" — catching not just prohibited terms but tonal mismatches. "This paragraph uses overly technical jargon that conflicts with our accessible, conversational brand voice. Suggested rewrite..." Understand the difference between appropriately formal (whitepaper) and inappropriately stiff (blog post) within the same brand voice framework.

### M2-08: DAM & Content Lifecycle Manager

- **Systems:** Bynder, Brandfolder, Google Drive, WordPress, Contentful
- **Trigger:** Scheduled (weekly) + Event (asset expiration approaching)
- **HITL:** --
- **Layer:** 2 (Agent Designer)
- **Integration & Orchestration:** Scan DAM for asset expiration dates, usage rights expirations, outdated brand elements, notify asset owners, archive expired content, maintain taxonomy and tagging
- **Traditional ML / Analytics:** Asset utilization tracking, duplicate detection, version control analytics, storage optimization
- **LLM Reasoning:** Review asset metadata and content to identify assets that reference outdated product names, former executives, or discontinued features — things that a metadata scan would miss but a reader would catch. Generate asset deprecation recommendations with replacement suggestions.

---

## M3: Demand Generation & Campaigns (8 Agents)

### M3-01: Campaign Builder & Orchestrator

- **Systems:** HubSpot, Marketo, Salesforce Marketing Cloud, Salesforce CRM, Vertex AI
- **Trigger:** Event (campaign brief approved)
- **HITL:** Demand Gen Manager approval
- **Layer:** 3 (Custom ADK)
- **Integration & Orchestration:** Create campaign in MAP from brief, set up email sequences, configure lead scoring rules, create Salesforce campaign, set up UTM tracking, coordinate multi-channel launch
- **Traditional ML / Analytics:** Historical campaign performance prediction, optimal sequence length based on segment response data, channel mix optimization
- **LLM Reasoning:** Interpret a campaign brief ("drive pipeline for enterprise accounts evaluating data platforms") and reason about the optimal multi-touch journey. Draft personalized email sequences that evolve messaging based on engagement signals — not just "if opened, send email B" but contextually different follow-ups based on which content was consumed and what it signals about buying intent.

### M3-02: Lead Scoring & Qualification Agent

- **Systems:** HubSpot, Marketo, Salesforce CRM, 6sense, Demandbase, BigQuery
- **Trigger:** Event (lead activity detected)
- **HITL:** --
- **Layer:** 4 (Data Agent)
- **Integration & Orchestration:** Receive behavioral events from MAP, enrich with firmographic data from 6sense/Demandbase, update lead scores in CRM, trigger MQL notifications to sales
- **Traditional ML / Analytics:** Predictive lead scoring using gradient boosting on conversion history, intent signal aggregation, behavioral velocity scoring (acceleration of engagement), ICP fit scoring
- **LLM Reasoning:** Interpret contextual signals that scoring models miss — a lead downloaded a competitor comparison guide (high intent), attended a pricing webinar (buying signal), and their company just posted a job for a relevant role (org investment signal). Synthesize these into a qualification narrative for the SDR: "This lead is showing late-stage buying signals — recommend direct outreach referencing their evaluation of Competitor X."

### M3-03: ABM Campaign Manager

- **Systems:** Demandbase, 6sense, Salesforce CRM, HubSpot, LinkedIn Ads, Vertex AI
- **Trigger:** Event (target account identified) + Scheduled (weekly)
- **HITL:** Demand Gen Manager review
- **Layer:** 3 (Custom ADK)
- **Integration & Orchestration:** Sync target account lists from Demandbase/6sense, create personalized ad campaigns in LinkedIn, coordinate email and content touches in HubSpot, update account engagement scores in Salesforce
- **Traditional ML / Analytics:** Account propensity scoring, buying stage prediction, engagement heat mapping across account stakeholders, channel effectiveness by account tier
- **LLM Reasoning:** Research a target account using publicly available information — annual reports, press releases, leadership changes, technology stack — and generate personalized outreach strategies. Reason about which pain points resonate based on the company's industry, size, and recent initiatives: "This manufacturing company just announced a digital transformation initiative — lead with operational efficiency messaging, not brand awareness."

### M3-04: Paid Media Optimizer

- **Systems:** Google Ads, Meta Ads Manager, LinkedIn Ads, HubSpot, BigQuery, Looker
- **Trigger:** Scheduled (daily)
- **HITL:** Digital Marketing Mgr review (for budget shifts > 20%)
- **Layer:** 4 (Data Agent)
- **Integration & Orchestration:** Pull performance data from ad platforms via APIs, aggregate in BigQuery, feed Looker dashboards, push bid adjustments and budget reallocations back to platforms
- **Traditional ML / Analytics:** Bid optimization models, budget pacing algorithms, cross-channel attribution, audience performance segmentation, creative fatigue detection, ROAS prediction
- **LLM Reasoning:** Interpret why a campaign's performance degraded — read the ad copy, landing page, and competitive landscape to diagnose whether it's creative fatigue, audience saturation, or competitive pressure. Generate optimization recommendations: "Campaign CTR dropped 30% in week 3 — creative fatigue detected. The 'ROI calculator' angle is saturated in this audience. Recommend testing 'customer story' creative with social proof messaging."

### M3-05: Webinar & Event Engine

- **Systems:** Zoom, HubSpot, Salesforce CRM, Google Calendar, Slack, Vertex AI
- **Trigger:** Event (webinar scheduled)
- **HITL:** --
- **Layer:** 2 (Agent Designer)
- **Integration & Orchestration:** Create webinar in Zoom, set up registration in HubSpot, build email promotion sequences, configure reminder cadence, sync registrants to Salesforce, trigger post-event follow-up workflows
- **Traditional ML / Analytics:** Attendance prediction based on registration patterns, optimal promotion timing, attendee engagement scoring during webinar, registration-to-attendance conversion prediction
- **LLM Reasoning:** Generate webinar promotional copy adapted for different channels (email, social, website), create speaker briefs, and draft follow-up sequences that reference specific topics discussed. Post-event: analyze Q&A questions to identify hot topics and generate personalized follow-up messages for high-intent attendees.

### M3-06: Lead Nurture Optimizer

- **Systems:** HubSpot, Marketo, Salesforce CRM, Vertex AI
- **Trigger:** Scheduled (weekly)
- **HITL:** --
- **Layer:** 3 (Custom ADK)
- **Integration & Orchestration:** Monitor nurture sequence performance in MAP, identify stalled leads, adjust sequence timing and content, re-enroll disengaged leads in alternate paths
- **Traditional ML / Analytics:** Engagement decay modeling, optimal re-engagement timing, content recommendation based on similar lead journeys, sequence drop-off analysis
- **LLM Reasoning:** Diagnose why leads are stalling in a nurture sequence — "Leads from the 'Data Platform Guide' download are dropping off at email 3 (product demo CTA) because they're still in research phase. Recommend inserting a comparison guide email before the demo ask." Generate adaptive nurture content that responds to behavioral signals.

### M3-07: Landing Page Optimizer

- **Systems:** WordPress, Unbounce, Google Analytics 4, HubSpot, Google Optimize, Vertex AI
- **Trigger:** Event (landing page published) + Scheduled (weekly review)
- **HITL:** --
- **Layer:** 3 (Custom ADK)
- **Integration & Orchestration:** Monitor landing page performance in GA4, set up A/B tests in Google Optimize, track form submission rates, push conversion data to HubSpot
- **Traditional ML / Analytics:** Conversion rate prediction, heatmap-based layout optimization, form field analysis (optimal number/types), load time impact modeling
- **LLM Reasoning:** Review a landing page's copy, structure, and CTA and generate optimization recommendations grounded in conversion principles. "The headline focuses on features ('Advanced Analytics Dashboard') but the audience segment cares about outcomes — test 'Cut Reporting Time by 60%' as the headline. The form asks for phone number, which reduces conversion by ~25% for top-of-funnel offers."

### M3-08: Campaign ROI Analyzer

- **Systems:** Salesforce CRM, HubSpot, Google Ads, BigQuery, Looker
- **Trigger:** Scheduled (weekly) + Event (campaign completed)
- **HITL:** --
- **Layer:** 4 (Data Agent)
- **Integration & Orchestration:** Pull campaign cost data from ad platforms and MAP, match to pipeline and revenue data in Salesforce, aggregate in BigQuery, generate campaign ROI reports in Looker
- **Traditional ML / Analytics:** Multi-touch attribution modeling (linear, time-decay, data-driven), CAC calculation by campaign, pipeline velocity analysis, cohort-based ROI tracking
- **LLM Reasoning:** Explain campaign ROI in business terms — not just "this campaign generated $500K pipeline" but "the webinar series targeting enterprise accounts generated $500K pipeline at $45 CAC, 3x below our paid search CAC for the same segment, with 40% faster velocity. Recommend doubling webinar investment and reducing paid search allocation for enterprise." Generate executive-ready campaign performance narratives.

---

## M4: Digital Marketing & SEO/SEM (7 Agents)

### M4-01: SEO Audit & Recommendation Engine

- **Systems:** Ahrefs, SEMrush, Google Search Console, WordPress, Screaming Frog, Vertex AI
- **Trigger:** Scheduled (monthly)
- **HITL:** SEO/SEM Specialist review
- **Layer:** 3 (Custom ADK)
- **Integration & Orchestration:** Run technical crawl via Screaming Frog/Ahrefs, pull ranking data from Search Console, compare with competitor positions in SEMrush, generate audit report, create fix tickets
- **Traditional ML / Analytics:** Technical SEO scoring, ranking trend analysis, backlink quality assessment, page speed impact modeling, crawl budget optimization
- **LLM Reasoning:** Interpret why specific pages aren't ranking despite strong technical SEO — analyze content relevance, search intent alignment, and competitor content depth. "This page targets 'marketing automation guide' but Google is ranking comparison pages — the intent has shifted from informational to commercial. Recommend restructuring as a comparison guide with editorial picks."

### M4-02: Keyword Strategy Agent

- **Systems:** SEMrush, Ahrefs, Google Trends, Google Search Console, BigQuery
- **Trigger:** Scheduled (monthly) + Chat
- **HITL:** --
- **Layer:** 4 (Data Agent)
- **Integration & Orchestration:** Pull keyword rankings and search volume data, aggregate competitor keyword gaps, monitor Google Trends for emerging queries, maintain keyword universe in BigQuery
- **Traditional ML / Analytics:** Keyword difficulty scoring, traffic potential estimation, ranking probability modeling, topic cluster mapping, keyword cannibalization detection
- **LLM Reasoning:** Analyze search intent behind keyword clusters and reason about content strategy implications. "The keyword 'CRM implementation' has mixed intent — 40% looking for guides, 30% seeking vendors, 30% troubleshooting. Recommend creating three content pieces addressing each intent rather than one catch-all page." Identify emerging topic opportunities from search trend patterns.

### M4-03: PPC Bid Management Agent

- **Systems:** Google Ads, Microsoft Ads, BigQuery, Looker
- **Trigger:** Scheduled (daily)
- **HITL:** SEO/SEM Specialist review (for budget changes > 15%)
- **Layer:** 4 (Data Agent)
- **Integration & Orchestration:** Pull campaign performance from ad platforms, calculate optimal bids, push bid adjustments via API, feed performance dashboards, alert on budget pacing issues
- **Traditional ML / Analytics:** Automated bidding optimization, quality score prediction, auction insight analysis, dayparting optimization, device bid modifiers, geographic performance modeling
- **LLM Reasoning:** Interpret competitive dynamics in search auctions — "Competitor Y entered the auction for 'enterprise CRM' keywords with aggressive bids, pushing our avg. CPC up 40%. Their ad copy focuses on pricing — recommend differentiating with capability messaging and adjusting max CPC based on our higher conversion rate from qualified traffic."

### M4-04: Ad Copy Generator & Tester

- **Systems:** Google Ads, Meta Ads Manager, LinkedIn Ads, Vertex AI
- **Trigger:** Event (new campaign or creative refresh needed)
- **HITL:** --
- **Layer:** 1 (OOTB)
- **Integration & Orchestration:** Generate ad copy variations, push to ad platforms, set up A/B tests, track performance, pause underperformers, scale winners
- **Traditional ML / Analytics:** CTR prediction by ad format, creative element performance analysis, headline/description combination optimization
- **LLM Reasoning:** Generate ad copy that fits platform-specific constraints (Google RSA character limits, LinkedIn's professional tone) while maintaining persuasive messaging. Adapt messaging angles for different audience segments and funnel stages. "For the remarketing audience that viewed pricing, lead with ROI proof points and urgency. For cold audience, lead with pain point recognition and educational value."

### M4-05: Website Personalization Engine

- **Systems:** Google Optimize, Google Analytics 4, Salesforce CRM, HubSpot, Vertex AI
- **Trigger:** Event (visitor session)
- **HITL:** --
- **Layer:** 3 (Custom ADK)
- **Integration & Orchestration:** Receive visitor context (referral source, account match, behavioral history), select personalization rules, serve appropriate content variants, track engagement
- **Traditional ML / Analytics:** Visitor segmentation, content recommendation engine, propensity scoring for conversion, real-time A/B test evaluation
- **LLM Reasoning:** Determine the right personalization strategy based on multi-signal context — a visitor from a Fortune 500 company who arrived via a competitor comparison keyword and has visited pricing twice should see enterprise-focused messaging with a direct "talk to sales" CTA, not a generic newsletter signup. Reason about personalization that feels helpful, not creepy.

### M4-06: Technical SEO Monitor

- **Systems:** Google Search Console, Ahrefs, Screaming Frog, Slack, Vertex AI
- **Trigger:** Scheduled (daily) + Event (crawl error detected)
- **HITL:** --
- **Layer:** 2 (Agent Designer)
- **Integration & Orchestration:** Run daily crawl checks, monitor Search Console for indexing issues, alert on 404 errors/redirect chains/canonicalization issues, track Core Web Vitals, create fix tickets
- **Traditional ML / Analytics:** Crawl budget analysis, indexation rate tracking, page speed trend monitoring, mobile usability scoring
- **LLM Reasoning:** Diagnose complex technical SEO issues that automated tools flag but can't explain. "Your /resources/ subdirectory has a 15% indexation rate despite correct robots.txt — the issue is thin content signals. 47 pages have fewer than 200 words of unique content and are being soft-penalized. Recommend consolidating resource pages and adding substantive content."

### M4-07: Conversion Rate Optimization Agent

- **Systems:** Google Analytics 4, Google Optimize, Hotjar, HubSpot, BigQuery, Vertex AI
- **Trigger:** Scheduled (weekly)
- **HITL:** --
- **Layer:** 4 (Data Agent)
- **Integration & Orchestration:** Pull funnel data from GA4, heatmap/recording data from Hotjar, form analytics from HubSpot, aggregate test results, generate optimization backlog
- **Traditional ML / Analytics:** Funnel drop-off analysis, statistical significance calculation for A/B tests, multivariate test design, session recording clustering by behavior pattern
- **LLM Reasoning:** Analyze user behavior patterns and generate hypotheses for conversion optimization. "Mobile users from paid social drop off at the demo request form at 3x desktop rate — the form requires 8 fields on mobile. Hypothesis: reducing to 4 fields (name, email, company, use case) with progressive profiling will increase mobile conversion by 35-50%."

---

## M5: Social Media & Community (6 Agents)

### M5-01: Social Content Calendar Manager

- **Systems:** Sprout Social, Hootsuite, HubSpot, Canva, Google Sheets, Vertex AI
- **Trigger:** Scheduled (weekly)
- **HITL:** Social Media Mgr approval
- **Layer:** 2 (Agent Designer)
- **Integration & Orchestration:** Maintain publishing calendar in Sprout Social/Hootsuite, schedule posts, coordinate with campaign calendar, manage approval workflows, track publishing cadence
- **Traditional ML / Analytics:** Optimal posting time analysis by platform and audience, content type performance tracking, posting frequency optimization
- **LLM Reasoning:** Generate a week's worth of social content aligned with the marketing calendar, industry events, and trending topics. Each post adapted for the platform — LinkedIn professional thought leadership, Twitter/X concise and provocative, Instagram visual-first with storytelling captions. Balance promotional, educational, and engagement content in the right ratios.

### M5-02: Social Listening & Sentiment Analyzer

- **Systems:** Sprout Social, Brandwatch, BigQuery, Vertex AI
- **Trigger:** Scheduled (daily) + Event (sentiment spike detected)
- **HITL:** --
- **Layer:** 3 (Custom ADK)
- **Integration & Orchestration:** Pull social mentions and conversations from Sprout Social/Brandwatch, aggregate in BigQuery, detect sentiment shifts, alert on brand mentions in crisis contexts
- **Traditional ML / Analytics:** Sentiment scoring, topic clustering, mention volume trend analysis, share of voice calculation, influencer identification
- **LLM Reasoning:** Interpret the nuance in social conversations — sarcasm, implied criticism, and cultural context that sentiment models miss. "A thread with 50+ replies criticizing our latest ad isn't a crisis — it's engagement bait from a competitor's community manager. The genuine customer sentiment in the thread is actually positive. Recommend engaging with authentic customer stories rather than addressing the manufactured controversy."

### M5-03: Community Engagement Responder

- **Systems:** Sprout Social, Hootsuite, Zendesk, Salesforce CRM, Vertex AI
- **Trigger:** Event (mention or message received)
- **HITL:** Social Media Mgr review (for escalation)
- **Layer:** 1 (OOTB)
- **Integration & Orchestration:** Receive social mentions and DMs, classify by intent (support, sales, feedback, engagement), route support to Zendesk, flag sales opportunities to CRM, queue engagement responses for approval
- **Traditional ML / Analytics:** Intent classification, urgency scoring, customer value lookup, response time tracking
- **LLM Reasoning:** Draft contextually appropriate responses to social media mentions that maintain brand voice while addressing specific situations. Distinguish between a customer complaining about a real product issue (empathetic, helpful), a prospect asking about features (informative, inviting), and a troll (ignore or light engagement). Generate responses that feel human, not corporate.

### M5-04: Influencer Discovery & Tracking

- **Systems:** Sprout Social, LinkedIn, YouTube, BigQuery, Vertex AI
- **Trigger:** Scheduled (monthly)
- **HITL:** Social Media Mgr approval
- **Layer:** 3 (Custom ADK)
- **Integration & Orchestration:** Scan social platforms for industry influencers, track engagement rates and audience quality, maintain influencer database in BigQuery, alert on partnership opportunities
- **Traditional ML / Analytics:** Influencer scoring (reach x engagement x relevance), audience overlap analysis, fake follower detection, ROI tracking for influencer campaigns
- **LLM Reasoning:** Evaluate influencer content quality beyond metrics — does this person actually understand the industry, or do they just have followers? Analyze their recent content to assess brand alignment: "This influencer has 50K followers but their content has shifted from enterprise tech to crypto. Audience alignment has dropped from 72% to 31% — recommend deprioritizing."

### M5-05: Social Media Analytics Dashboard

- **Systems:** Sprout Social, Hootsuite, Google Analytics 4, BigQuery, Looker
- **Trigger:** Scheduled (weekly)
- **HITL:** --
- **Layer:** 4 (Data Agent)
- **Integration & Orchestration:** Pull platform-specific metrics from Sprout Social/Hootsuite, correlate with website traffic from GA4, aggregate in BigQuery, feed Looker social performance dashboards
- **Traditional ML / Analytics:** Engagement rate benchmarking, follower growth modeling, content type performance ranking, viral coefficient estimation, cross-platform attribution
- **LLM Reasoning:** Generate weekly social media performance narratives that explain the "so what" behind the numbers. "LinkedIn engagement up 23% WoW driven by the CEO's post on AI adoption — this single organic post generated more engagement than our entire paid social budget last week. Recommend building an executive thought leadership program to amplify this pattern."

### M5-06: UGC & Advocacy Manager

- **Systems:** Sprout Social, HubSpot, Salesforce CRM, Google Drive, Vertex AI
- **Trigger:** Event (UGC detected) + Scheduled (monthly review)
- **HITL:** Brand Manager approval
- **Layer:** 2 (Agent Designer)
- **Integration & Orchestration:** Monitor for user-generated content and customer mentions, curate and request permissions, maintain advocacy program tracking, coordinate with customer success for testimonial requests
- **Traditional ML / Analytics:** UGC quality scoring, advocate engagement tracking, testimonial pipeline management, sentiment analysis on customer content
- **LLM Reasoning:** Evaluate whether user-generated content is usable for marketing — not just sentiment but quality, relevance, and brand alignment. Draft permission request messages and suggest how to amplify the best UGC. "This customer's LinkedIn post about implementing our product has authentic enthusiasm and specific results ($2M saved) — request permission and feature in next case study campaign."

---

## M6: Marketing Analytics & Attribution (8 Agents)

### M6-01: Multi-Touch Attribution Engine

- **Systems:** Google Analytics 4, Salesforce CRM, HubSpot, BigQuery, Looker
- **Trigger:** Scheduled (weekly)
- **HITL:** --
- **Layer:** 4 (Data Agent)
- **Integration & Orchestration:** Pull touchpoint data from GA4, CRM, and MAP, stitch cross-device journeys, run attribution models, publish results to Looker dashboards
- **Traditional ML / Analytics:** Data-driven attribution modeling (Shapley value, Markov chains), multi-touch path analysis, channel interaction effects, incrementality estimation
- **LLM Reasoning:** Interpret attribution results for non-technical stakeholders. "The data-driven model attributes 35% of enterprise pipeline to organic search, but this is misleading — organic search is the last recorded touch because enterprise buyers google our brand name before filling out a form. The real pipeline driver is the webinar series (first meaningful touch for 60% of enterprise deals). Recommend shifting to first-touch for brand terms and data-driven for non-brand."

### M6-02: Marketing Dashboard Generator

- **Systems:** BigQuery, Looker, Google Analytics 4, Salesforce CRM, HubSpot
- **Trigger:** Scheduled (daily refresh) + Chat (ad-hoc)
- **HITL:** --
- **Layer:** 4 (Data Agent)
- **Integration & Orchestration:** Aggregate data from all marketing systems into BigQuery, maintain dashboard data models, auto-refresh Looker dashboards, generate scheduled reports via email
- **Traditional ML / Analytics:** KPI trend calculation, anomaly detection, benchmark comparison, automated chart generation, statistical significance flags
- **LLM Reasoning:** Answer ad-hoc questions in natural language: "How did our Q1 campaigns perform vs. Q4?" Pull the data, calculate the comparisons, and generate a narrative response with charts: "Q1 MQL volume was up 15% vs. Q4 driven primarily by the 'AI Transformation' webinar series. However, MQL-to-SQL conversion dropped 8% — the webinar attracted broader audiences with lower buying intent. Net pipeline impact was flat."

### M6-03: A/B Test Analyzer

- **Systems:** Google Optimize, HubSpot, Google Analytics 4, BigQuery, Vertex AI
- **Trigger:** Event (test reaches significance) + Scheduled (weekly review)
- **HITL:** --
- **Layer:** 4 (Data Agent)
- **Integration & Orchestration:** Monitor running A/B tests across platforms, calculate statistical significance, alert when tests reach conclusion, archive results in BigQuery, generate test reports
- **Traditional ML / Analytics:** Bayesian and frequentist significance testing, sample size calculation, segment-level analysis, interaction effect detection, sequential testing for early stopping
- **LLM Reasoning:** Interpret A/B test results beyond "variant B won" — explain what the result means for strategy. "The long-form landing page beat the short-form by 23% for enterprise visitors but performed 15% worse for SMB — this confirms that enterprise buyers need more information before committing. Recommend segment-specific page variants rather than a single winner."

### M6-04: Customer Journey Mapper

- **Systems:** Google Analytics 4, Salesforce CRM, HubSpot, 6sense, BigQuery
- **Trigger:** Scheduled (monthly)
- **HITL:** --
- **Layer:** 3 (Custom ADK)
- **Integration & Orchestration:** Stitch anonymous and known touchpoints across GA4, CRM, and MAP, build journey maps per segment, identify common paths and drop-off points
- **Traditional ML / Analytics:** Sequential pattern mining on conversion paths, journey clustering, touchpoint transition probabilities, time-between-touch analysis, journey length distribution
- **LLM Reasoning:** Interpret journey patterns and generate strategic insights. "Enterprise accounts with 10+ stakeholder touches convert at 4x the rate of those with fewer than 5 — this isn't just more engagement, it's multi-threading. The accounts that convert have different personas engaging (technical evaluator, business sponsor, procurement) while non-converters have repetitive touches from a single person. Recommend ABM plays that deliberately engage multiple stakeholders."

### M6-05: Marketing Mix Modeler

- **Systems:** BigQuery, Google Ads, Meta Ads, Salesforce CRM, Looker, Vertex AI
- **Trigger:** Scheduled (quarterly)
- **HITL:** CMO review
- **Layer:** 4 (Data Agent)
- **Integration & Orchestration:** Aggregate channel spend and revenue data over 24+ months, pull external variables (seasonality, market index), run MMM, deliver results to CMO
- **Traditional ML / Analytics:** Marketing mix modeling (Bayesian regression), response curve estimation per channel, saturation point detection, budget optimization with constraints, cross-channel synergy measurement
- **LLM Reasoning:** Translate complex MMM output into actionable strategy. "The model shows content marketing has the highest marginal ROI but is approaching saturation — adding more blog content won't move the needle. However, video content (webinars, product demos) shows strong synergy with paid search: deals that engaged with both channels converted 2.3x faster. Recommend reallocating $200K from incremental blog content to video production."

### M6-06: Funnel Velocity Analyzer

- **Systems:** Salesforce CRM, HubSpot, BigQuery, Looker
- **Trigger:** Scheduled (weekly)
- **HITL:** --
- **Layer:** 4 (Data Agent)
- **Integration & Orchestration:** Pull stage-by-stage conversion data from CRM and MAP, calculate velocity metrics, detect bottlenecks, feed funnel dashboards in Looker
- **Traditional ML / Analytics:** Stage conversion rate trending, cycle time analysis, bottleneck detection, cohort-based funnel analysis, pipeline velocity prediction
- **LLM Reasoning:** Diagnose funnel bottlenecks with context. "MQL-to-SQL conversion dropped from 28% to 19% this quarter — not because lead quality declined (ICP fit scores are stable) but because the SDR team is understaffed by 3 reps following attrition. The math: each SDR handles 150 leads/month, current capacity is 450, but MQL volume is 680. Recommend temporary qualification automation or SDR hiring acceleration."

### M6-07: Predictive Pipeline Forecaster

- **Systems:** Salesforce CRM, HubSpot, 6sense, BigQuery, Vertex AI
- **Trigger:** Scheduled (weekly)
- **HITL:** --
- **Layer:** 4 (Data Agent)
- **Integration & Orchestration:** Pull pipeline data from CRM, marketing engagement from HubSpot, intent signals from 6sense, run forecast models, deliver pipeline projections to sales and marketing leadership
- **Traditional ML / Analytics:** Pipeline conversion prediction, deal scoring, weighted pipeline calculation, scenario modeling (best/expected/worst), historical accuracy tracking
- **LLM Reasoning:** Provide pipeline forecast with confidence explanations. "Q2 pipeline forecast: $12.4M (82% confidence). Key risks: 3 deals worth $2.1M total are single-threaded — only one contact engaged. Upside: 2 accounts showing surging 6sense intent signals haven't entered pipeline yet but match our ideal profile. Recommend: marketing air cover (targeted ads + content) for the at-risk deals, and SDR outreach to the high-intent accounts."

### M6-08: Data Quality & Governance Agent

- **Systems:** Salesforce CRM, HubSpot, BigQuery, Vertex AI
- **Trigger:** Scheduled (daily)
- **HITL:** Marketing Ops Lead review
- **Layer:** 2 (Agent Designer)
- **Integration & Orchestration:** Scan CRM and MAP records for data quality issues (duplicates, missing fields, invalid entries), run deduplication, flag inconsistencies, generate data health reports
- **Traditional ML / Analytics:** Duplicate detection via fuzzy matching, field completeness scoring, data decay rate tracking, record linkage across systems
- **LLM Reasoning:** Interpret ambiguous data quality issues — "John Smith at Acme Corp" and "J. Smith at Acme Corporation" are likely the same person, but "John Smith at Acme Corp" and "John Smith at Acme Industries" may not be. Reason about merge/no-merge decisions using contextual clues (email domain, phone, engagement history). Generate data quality reports that prioritize business impact over record count.

---

## M7: Brand & Communications (7 Agents)

### M7-01: Brand Health Monitor

- **Systems:** Brandwatch, Sprout Social, Google Trends, SEMrush, BigQuery, Looker
- **Trigger:** Scheduled (weekly) + Event (brand mention spike)
- **HITL:** --
- **Layer:** 4 (Data Agent)
- **Integration & Orchestration:** Pull brand mention data from Brandwatch, search interest from Google Trends, share of voice from SEMrush, aggregate in BigQuery, feed brand health dashboard
- **Traditional ML / Analytics:** Brand awareness tracking (aided/unaided proxy), share of voice calculation, sentiment trend analysis, brand association clustering, competitive brand positioning
- **LLM Reasoning:** Interpret what brand health metrics mean strategically. "Brand search volume is up 18% but sentiment dropped 5 points — the increase is driven by a viral negative review thread, not organic awareness growth. The sentiment issue is concentrated in the SMB segment where our recent pricing change was poorly received. Recommend targeted comms addressing pricing value proposition for SMB."

### M7-02: Press Release & Comms Drafter

- **Systems:** Google Docs, WordPress, PR Newswire, Cision, Slack, Vertex AI
- **Trigger:** Event (announcement approved) + Chat
- **HITL:** Brand Manager approval
- **Layer:** 1 (OOTB)
- **Integration & Orchestration:** Receive announcement brief, generate press release draft in Google Docs, route for approval chain, coordinate distribution via PR Newswire/Cision, prepare supporting materials
- **Traditional ML / Analytics:** Historical press release performance (pickup rate, media mentions), optimal release timing, journalist interest prediction
- **LLM Reasoning:** Transform internal announcement documents into polished press releases that follow AP style, include relevant context, and anticipate journalist questions. Adapt tone for different announcement types — product launch (excitement), partnership (strategic), financial results (measured). Generate a media Q&A document that prepares spokespeople for likely follow-up questions.

### M7-03: Crisis Communications Advisor

- **Systems:** Brandwatch, Sprout Social, Google News API, Slack, Vertex AI
- **Trigger:** Event (crisis signal detected)
- **HITL:** CMO + Legal approval
- **Layer:** 3 (Custom ADK)
- **Integration & Orchestration:** Monitor for crisis signals (sudden sentiment drops, media inquiries, viral negative content), alert crisis team via Slack, aggregate crisis intelligence, track response effectiveness
- **Traditional ML / Analytics:** Anomaly detection on brand mentions, sentiment velocity tracking, crisis escalation scoring, media spread modeling
- **LLM Reasoning:** Assess crisis severity and generate response strategy. "This is a Tier 2 crisis — a former employee's LinkedIn post alleging toxic culture has 500 reactions and 2 journalists have requested comment. Recommended response: acknowledge within 4 hours via official LinkedIn, focus on specific actions taken (not generic values statements), have CEO respond personally. Do NOT issue press release — that amplifies beyond current reach. Draft holding statement for journalist inquiries."

### M7-04: Executive Thought Leadership Agent

- **Systems:** LinkedIn, Google Docs, WordPress, Vertex AI
- **Trigger:** Scheduled (weekly) + Chat
- **HITL:** Brand Manager review
- **Layer:** 1 (OOTB)
- **Integration & Orchestration:** Monitor industry trends, generate thought leadership content ideas, draft LinkedIn posts for executives, maintain publishing calendar, track engagement
- **Traditional ML / Analytics:** Engagement prediction by topic and format, optimal posting time, audience growth tracking
- **LLM Reasoning:** Draft thought leadership content in each executive's authentic voice — the CEO's posts should read differently from the CTO's. Generate perspectives on industry developments that demonstrate genuine insight, not obvious commentary. "The CEO's voice is direct, uses personal anecdotes, and challenges conventional wisdom. Draft a post about AI adoption that opens with a counterintuitive observation from a recent customer conversation."

### M7-05: Brand Guidelines Enforcer

- **Systems:** Google Drive, Bynder/Brandfolder, Canva, Figma, Vertex AI
- **Trigger:** Event (asset submitted for review)
- **HITL:** Brand Manager review (for violations)
- **Layer:** 3 (Custom ADK)
- **Integration & Orchestration:** Hook into design and content submission workflows, scan assets against brand guidelines database, flag violations, provide specific correction guidance
- **Traditional ML / Analytics:** Color palette compliance checking (hex code matching), logo usage detection, font/typography verification, layout template compliance
- **LLM Reasoning:** Assess brand compliance beyond pixel-level checks — does the messaging tone match the brand voice? Is the photography style consistent with brand guidelines? "This sales deck uses approved colors and logo but the messaging uses fear-based language ('don't get left behind') which conflicts with our brand's empowering, positive tone. Suggested alternative messaging provided."

### M7-06: Internal Communications Drafter

- **Systems:** Google Workspace, Slack, Salesforce (for company updates), Vertex AI
- **Trigger:** Event (internal announcement needed) + Chat
- **HITL:** VP Marketing approval
- **Layer:** 1 (OOTB)
- **Integration & Orchestration:** Receive internal comms request, generate draft in Google Docs, route through approval chain, distribute via email/Slack, track read rates
- **Traditional ML / Analytics:** Read rate tracking, click-through analysis, optimal send timing for internal comms
- **LLM Reasoning:** Draft internal communications that inform and align — not just corporate announcements but narratives that help employees understand the "why." "This reorganization announcement needs to explain not just the new structure but why it matters for each team's daily work. The engineering team cares about reporting lines, marketing cares about campaign ownership, sales cares about territory alignment."

### M7-07: Analyst & Influencer Relations Tracker

- **Systems:** Salesforce CRM, Google Workspace, LinkedIn, Cision, BigQuery
- **Trigger:** Scheduled (monthly) + Event (analyst inquiry)
- **HITL:** --
- **Layer:** 2 (Agent Designer)
- **Integration & Orchestration:** Maintain analyst and media contact database, track engagement history, schedule briefing preparation, monitor coverage, manage inquiry routing
- **Traditional ML / Analytics:** Coverage sentiment tracking, analyst influence scoring, briefing effectiveness measurement, coverage-to-pipeline correlation
- **LLM Reasoning:** Prepare analyst briefing materials that anticipate questions based on the analyst's recent publications and known perspectives. "This Gartner analyst recently published a note skeptical of AI-generated content quality — prepare data points on our human-in-the-loop approach and customer quality metrics to proactively address this concern."

---

## M8: Marketing Operations & MarTech (7 Agents)

### M8-01: MarTech Stack Health Monitor

- **Systems:** HubSpot, Marketo, Salesforce CRM, Google Analytics 4, BigQuery, Vertex AI
- **Trigger:** Scheduled (daily)
- **HITL:** Marketing Ops Lead review
- **Layer:** 2 (Agent Designer)
- **Integration & Orchestration:** Monitor API health and data sync status across MarTech stack, detect integration failures, track license utilization, alert on system issues
- **Traditional ML / Analytics:** Sync failure pattern detection, system utilization tracking, integration latency monitoring, data freshness scoring
- **LLM Reasoning:** Diagnose complex integration failures that automated monitoring flags but can't explain. "HubSpot-to-Salesforce sync failed for 47 records — not a system issue but a field mapping problem. The 'Industry' picklist was updated in Salesforce but the mapping in HubSpot still references the old values. Fix: update HubSpot field mapping to include 'Technology - AI/ML' which was added to Salesforce last week."

### M8-02: Lead Routing & Assignment Engine

- **Systems:** Salesforce CRM, HubSpot, LeanData, Vertex AI
- **Trigger:** Event (MQL created)
- **HITL:** --
- **Layer:** 2 (Agent Designer)
- **Integration & Orchestration:** Receive MQL notification, match to account hierarchy, apply territory rules, assign to appropriate SDR/AE, create follow-up tasks, track assignment-to-contact time
- **Traditional ML / Analytics:** Round-robin balancing with capacity weighting, account matching (fuzzy company name + domain matching), territory optimization
- **LLM Reasoning:** Handle ambiguous routing cases — "This lead works at 'Acme Digital Solutions' — is this part of the Acme Corp enterprise account (AE: Sarah) or a separate company (SDR pool)? Check domain registration, LinkedIn company page connection, and historical relationship signals to make the right routing decision rather than creating a duplicate account."

### M8-03: Campaign Ops Workflow Builder

- **Systems:** HubSpot, Marketo, Salesforce Marketing Cloud, Vertex AI
- **Trigger:** Chat (request for new workflow)
- **HITL:** Marketing Ops Lead approval
- **Layer:** 1 (OOTB)
- **Integration & Orchestration:** Interpret workflow requirements, configure automation in MAP, set up triggers, conditions, and actions, test workflow logic, deploy to production
- **Traditional ML / Analytics:** Workflow performance benchmarking, bottleneck detection, A/B testing of workflow variations
- **LLM Reasoning:** Translate natural language workflow descriptions into MAP-specific configurations. "I need a nurture sequence for webinar no-shows that sends the recording, then a related asset, then a demo offer — but only if they haven't already booked a demo." Parse this into a specific HubSpot/Marketo workflow with correct branching logic, timing, and exclusion criteria.

### M8-04: List Management & Segmentation Agent

- **Systems:** HubSpot, Marketo, Salesforce CRM, BigQuery
- **Trigger:** Event (campaign targeting request) + Scheduled (segment refresh)
- **HITL:** --
- **Layer:** 2 (Agent Designer)
- **Integration & Orchestration:** Build audience lists from CRM/MAP based on criteria, apply suppression rules (opt-outs, competitors, existing customers where inappropriate), sync lists to ad platforms, maintain dynamic segments
- **Traditional ML / Analytics:** Segment overlap analysis, list quality scoring, decay rate tracking, deliverability impact assessment
- **LLM Reasoning:** Interpret complex segmentation requests — "I need enterprise accounts in manufacturing that have shown intent around digital transformation but haven't engaged with us in 90+ days, excluding accounts with open opportunities." Translate into the correct filters across CRM, MAP, and intent data platforms, flagging potential data availability gaps.

### M8-05: Email Deliverability Manager

- **Systems:** HubSpot, Marketo, Salesforce Marketing Cloud, Google Postmaster, Vertex AI
- **Trigger:** Scheduled (daily) + Event (deliverability issue detected)
- **HITL:** --
- **Layer:** 3 (Custom ADK)
- **Integration & Orchestration:** Monitor email deliverability metrics (bounce rate, spam complaints, inbox placement), check domain reputation via Google Postmaster, manage suppression lists, alert on deliverability drops
- **Traditional ML / Analytics:** Deliverability trend analysis, IP reputation scoring, engagement-based list segmentation, optimal volume ramping calculation
- **LLM Reasoning:** Diagnose deliverability issues with root cause analysis. "Inbox placement dropped from 92% to 78% for Gmail recipients this week — correlating with a large batch send to a re-engagement segment on Tuesday. Sending to disengaged recipients hurt domain reputation. Recommend: pause re-engagement sends for 2 weeks, increase engagement threshold for Gmail recipients, and implement a sunset policy for 180+ day non-openers."

### M8-06: UTM & Tracking Governance Agent

- **Systems:** Google Analytics 4, HubSpot, Google Sheets, BigQuery
- **Trigger:** Event (campaign created) + Scheduled (weekly audit)
- **HITL:** --
- **Layer:** 2 (Agent Designer)
- **Integration & Orchestration:** Enforce UTM naming conventions on all campaign URLs, detect non-compliant tracking parameters, auto-generate tracking URLs from campaign briefs, maintain UTM taxonomy reference
- **Traditional ML / Analytics:** UTM compliance rate tracking, orphaned parameter detection, attribution data quality scoring
- **LLM Reasoning:** Catch UTM governance issues that pattern matching misses — "utm_campaign=webinar-ai-2025" and "utm_campaign=2025-ai-webinar" refer to the same campaign but will be reported separately. Suggest canonical naming and identify historical data that needs cleanup for accurate attribution reporting.

### M8-07: Marketing Compliance & Consent Manager

- **Systems:** OneTrust, HubSpot, Salesforce CRM, BigQuery, Vertex AI
- **Trigger:** Scheduled (daily) + Event (regulation change detected)
- **HITL:** Marketing Ops Lead + Legal review
- **Layer:** 3 (Custom ADK)
- **Integration & Orchestration:** Monitor consent records across systems, enforce GDPR/CCPA/CAN-SPAM compliance, manage opt-out synchronization, audit consent workflows, generate compliance reports
- **Traditional ML / Analytics:** Consent coverage rate tracking, compliance gap detection, opt-out rate trending, cross-system consent synchronization validation
- **LLM Reasoning:** Interpret new privacy regulations and assess impact on marketing operations. "The proposed Colorado AI Act will require disclosure when AI is used to make 'consequential decisions' about consumers — does our lead scoring that determines ad targeting qualify? Analysis: likely yes for retargeting suppression based on AI scores. Recommend: add disclosure to privacy policy and implement human review for AI-driven suppression decisions."

---

## M9: Customer & Market Intelligence (7 Agents)

### M9-01: Market Research Synthesizer

- **Systems:** Google Workspace, Gartner, Forrester, G2, BigQuery, Vertex AI
- **Trigger:** Chat + Scheduled (quarterly market review)
- **HITL:** Product Marketing Mgr review
- **Layer:** 1 (OOTB)
- **Integration & Orchestration:** Ingest analyst reports, market data feeds, and competitive intelligence, aggregate research in BigQuery, generate research summaries, distribute to stakeholders
- **Traditional ML / Analytics:** Market sizing estimation, growth rate trending, segment share calculation, competitive positioning mapping
- **LLM Reasoning:** Synthesize a 40-page Gartner report, 3 analyst briefings, and 50 G2 reviews into a 2-page market intelligence brief. Identify the non-obvious insights — not just "the market is growing" but "enterprise buyers are shifting evaluation criteria from feature completeness to implementation speed, which favors our approach but requires repositioning our sales deck from feature comparison to time-to-value."

### M9-02: Win/Loss Analysis Agent

- **Systems:** Salesforce CRM, Gong, Google Workspace, Vertex AI
- **Trigger:** Event (deal closed won/lost)
- **HITL:** --
- **Layer:** 3 (Custom ADK)
- **Integration & Orchestration:** Trigger on deal close, pull CRM opportunity data, retrieve Gong call recordings/transcripts, send win/loss survey to buyer, aggregate findings in BigQuery
- **Traditional ML / Analytics:** Win rate trending by segment/competitor/deal size, competitive win rate calculation, loss reason classification, price sensitivity analysis
- **LLM Reasoning:** Analyze Gong call transcripts to identify the real reasons for wins and losses — not the CRM dropdown selections but what the buyer actually said. "The CRM says 'lost on price' but the Gong transcript from the final call reveals the buyer said 'we went with Competitor X because they had a native integration with our data warehouse' — this is a product gap, not a pricing issue. This pattern appears in 4 of the last 7 enterprise losses."

### M9-03: Customer Voice & Review Monitor

- **Systems:** G2, Trustpilot, Gartner Peer Insights, App Store, BigQuery, Vertex AI
- **Trigger:** Scheduled (daily) + Event (negative review posted)
- **HITL:** Product Marketing Mgr review (for negative)
- **Layer:** 3 (Custom ADK)
- **Integration & Orchestration:** Scrape/ingest reviews from G2, Trustpilot, Gartner Peer Insights, aggregate in BigQuery, alert on negative reviews, track review volume and ratings
- **Traditional ML / Analytics:** Rating trend analysis, topic extraction from reviews, sentiment scoring, competitive review comparison, review response impact analysis
- **LLM Reasoning:** Read customer reviews and extract product intelligence — "Three enterprise reviews this month mention 'reporting limitations' — specifically the inability to create custom dashboards without engineering support. This aligns with the product team's planned Q3 self-serve reporting feature. Draft a response acknowledging the feedback and referencing the upcoming improvement without over-promising."

### M9-04: Persona & ICP Refiner

- **Systems:** Salesforce CRM, HubSpot, 6sense, Clearbit, BigQuery, Vertex AI
- **Trigger:** Scheduled (quarterly)
- **HITL:** Product Marketing Mgr + CMO review
- **Layer:** 3 (Custom ADK)
- **Integration & Orchestration:** Pull closed-won deal profiles from CRM, engagement data from HubSpot, firmographic enrichment from Clearbit, intent data from 6sense, aggregate in BigQuery
- **Traditional ML / Analytics:** ICP scoring model (which firmographic/technographic attributes predict conversion), persona clustering, segment profitability analysis, lookalike modeling
- **LLM Reasoning:** Analyze patterns across winning deals to refine ICP and persona definitions. "Our fastest-growing segment is mid-market manufacturing companies undergoing digital transformation — but our current ICP focuses on company size and industry alone. The winning pattern includes: recently hired a VP of Digital, using legacy ERP, and engaging with 'modernization' content. Recommend updating ICP to include digital maturity signals."

### M9-05: Competitive Battle Card Generator

- **Systems:** Salesforce CRM, Gong, SEMrush, G2, Vertex AI
- **Trigger:** Event (competitive deal flagged) + Scheduled (monthly refresh)
- **HITL:** Product Marketing Mgr approval
- **Layer:** 1 (OOTB)
- **Integration & Orchestration:** Pull competitive intelligence from CRM (competitor mentions), Gong (competitive call analysis), SEMrush (competitor positioning), G2 (comparison data), generate battle cards in Google Docs
- **Traditional ML / Analytics:** Competitive win/loss rates, feature comparison scoring, pricing analysis, deal velocity comparison
- **LLM Reasoning:** Generate battle cards that help sellers win against specific competitors — not generic feature comparisons but contextual guidance. "When competing against Competitor X on enterprise deals: lead with our SOC 2 Type II compliance (they have Type I only), avoid pricing discussions until after demo (our value becomes clear with implementation speed), and reference the 3 competitive displacements in manufacturing this quarter."

### M9-06: Sales Enablement Content Agent

- **Systems:** Salesforce CRM, Highspot, Google Workspace, Vertex AI
- **Trigger:** Event (deal stage change) + Chat
- **HITL:** --
- **Layer:** 1 (OOTB)
- **Integration & Orchestration:** Monitor deal stage progression in CRM, recommend relevant content from Highspot based on deal context, push content cards to sales reps, track content usage and influence on deal outcomes
- **Traditional ML / Analytics:** Content-to-deal correlation, content effectiveness scoring by deal stage and segment, usage pattern analysis
- **LLM Reasoning:** Recommend the right content for the right deal moment — "This enterprise deal is in technical evaluation with the CTO involved. The standard product deck won't work — recommend: (1) the technical architecture whitepaper, (2) the security compliance one-pager, and (3) the manufacturing case study with the 'reduced integration time by 60%' metric. The CTO's LinkedIn shows interests in API-first architectures — lead with that angle."

### M9-07: Market Trend & Signal Detector

- **Systems:** Google Trends, SEMrush, LinkedIn, Google News API, BigQuery, Vertex AI
- **Trigger:** Scheduled (weekly) + Event (trend spike detected)
- **HITL:** --
- **Layer:** 3 (Custom ADK)
- **Integration & Orchestration:** Monitor search trends, industry news feeds, LinkedIn topic activity, and technology adoption signals, aggregate in BigQuery, alert on emerging trends
- **Traditional ML / Analytics:** Trend velocity measurement, early signal detection, topic clustering, adoption curve modeling
- **LLM Reasoning:** Distinguish meaningful market shifts from noise. "Search volume for 'AI marketing automation' is up 300% YoY — but is this genuine buyer interest or media hype? Analysis: job postings for 'AI marketing' roles are up only 40%, while search queries increasingly include 'vs' and 'comparison' modifiers — indicating real evaluation activity, not just curiosity. This is a genuine market shift. Recommend: create comparison content targeting these queries within 30 days."
