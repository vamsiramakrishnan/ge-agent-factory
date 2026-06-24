import { User, Briefcase, Megaphone, PenTool, Target, Globe, MessageSquare, BarChart3, Award, Wrench, Users, MapPin, Clock, TrendingDown, Database } from "lucide-react";
import { DepartmentConfig } from "./types";

export const marketingDepartment: DepartmentConfig = {
  key: "marketing",
  label: "Marketing",
  shortLabel: "Marketing",
  icon: Megaphone,
  accentColor: "#8b5cf6",
  activeBg: "bg-violet-600",
  domainRange: [29, 37],

  subtitle: "9 Domains • 65 Agents • 12 Personas",
  description: "End-to-end marketing transformation — Research → Plan → Create → Distribute → Engage → Convert → Measure → Optimize. Every agent grounded in real MarTech systems, real campaign data, and the three-layer capability model.",

  periodicTableTitle: "The Periodic Table of Marketing Agents",
  periodicTableSubtitle: "65 AI agents across 9 marketing domains — Research → Plan → Create → Distribute → Engage → Convert → Measure → Optimize.",

  domainColors: {
    29: "#8b5cf6", 30: "#d946ef", 31: "#f43f5e", 32: "#0284c7",
    33: "#059669", 34: "#d97706", 35: "#7c3aed", 36: "#64748b",
    37: "#0891b2",
  },

  challenge: {
    title: "The Marketing Burden",
    items: [
      { icon: Clock, title: "Content & Campaign Drag", desc: "Campaign setup takes 2-3 weeks — half spent on manual list pulls, creative approvals, and MarTech configuration." },
      { icon: TrendingDown, title: "Attribution Blindness", desc: "70% of marketing spend lacks reliable attribution. Decisions rely on last-touch and gut feel, not data-driven models." },
      { icon: Database, title: "Fragmented MarTech Stack", desc: "Marketing data spread across MAP, CRM, ad platforms, SEO tools, analytics, and dozens of point solutions with no single source of truth." },
    ],
    stat: "70%",
    statLabel: "Budget Without Attribution",
    statDesc: "Marketing teams struggle to attribute 70% of their budget to business outcomes — leaving CMOs unable to defend spend, optimize channels, or forecast pipeline with confidence.",
  },

  personas: [
    { title: "Chief Marketing Officer", desc: "Owns marketing strategy, brand stewardship, board-level reporting, budget allocation, and growth targets across all channels", metrics: "Pipeline contribution, CAC, brand awareness, marketing ROI, revenue influence", domains: [29, 35, 34], icon: User, color: "#7c3aed" },
    { title: "VP Marketing", desc: "Drives cross-functional execution, pipeline targets, team leadership, budget management, and agency relationships", metrics: "MQL volume, pipeline velocity, team productivity, budget efficiency", domains: [29, 31, 36], icon: Briefcase, color: "#7c3aed" },
    { title: "Brand Manager", desc: "Guards brand identity, messaging consistency, creative standards, reputation management, and brand health metrics", metrics: "Brand awareness, sentiment score, share of voice, guideline compliance", domains: [35, 30], icon: Award, color: "#6d28d9" },
    { title: "Content Strategist", desc: "Leads editorial planning, content production, asset management, SEO content strategy, and content performance", metrics: "Content output, organic traffic, engagement rate, content-attributed pipeline", domains: [30, 33], icon: PenTool, color: "#c026d3" },
    { title: "Demand Gen Manager", desc: "Executes campaigns, drives pipeline generation, manages lead nurturing, and optimizes conversion funnels", metrics: "MQLs, SQLs, pipeline generated, conversion rates, CPL", domains: [31, 34], icon: Target, color: "#e11d48" },
    { title: "Digital Marketing Mgr", desc: "Manages website, paid media, email, marketing automation, and digital channel performance end-to-end", metrics: "Website traffic, email engagement, paid media ROAS, digital pipeline", domains: [31, 32], icon: Globe, color: "#0284c7" },
    { title: "Social Media Mgr", desc: "Oversees social publishing, community engagement, influencer relations, social listening, and social ROI", metrics: "Engagement rate, follower growth, social pipeline, response time", domains: [33], icon: MessageSquare, color: "#059669" },
    { title: "Marketing Analyst", desc: "Owns attribution, dashboards, A/B testing, ROI analysis, and data governance across all marketing channels", metrics: "Attribution accuracy, dashboard adoption, test velocity, data quality", domains: [34, 37], icon: BarChart3, color: "#d97706" },
    { title: "SEO/SEM Specialist", desc: "Manages organic search, paid search, keyword strategy, technical SEO, and ad campaign optimization", metrics: "Organic traffic, keyword rankings, paid CPC, quality score, ROAS", domains: [32], icon: Globe, color: "#0284c7" },
    { title: "Marketing Ops Lead", desc: "Manages MarTech stack, data hygiene, workflow automation, lead management, integration, and compliance", metrics: "System uptime, lead routing speed, data quality score, MarTech ROI", domains: [36, 34], icon: Wrench, color: "#475569" },
    { title: "Product Marketing Mgr", desc: "Drives positioning, competitive intelligence, sales enablement, launch planning, and messaging frameworks", metrics: "Win rate vs. competitors, sales content usage, launch metrics, PMF score", domains: [37, 35], icon: Users, color: "#0e7490" },
    { title: "Field Marketing Mgr", desc: "Executes regional events, ABM programs, partner marketing, and local demand generation for territory teams", metrics: "Event pipeline, regional MQLs, ABM engagement, partner sourced pipeline", domains: [31, 33], icon: MapPin, color: "#e11d48" },
  ],

  dayInLife: [
    {
      persona: "Demand Gen Manager",
      intro: "The Demand Gen Manager drives pipeline through campaigns — juggling HubSpot, Salesforce, Google Ads, and spreadsheets to turn marketing spend into qualified pipeline.",
      blocks: [
        { time: "8:00", activity: "Pulling yesterday's lead data from HubSpot and Salesforce, manually reconciling MQL counts that don't match between systems.", processes: ["Lead Management", "Data Reconciliation"], agentOpportunity: "Lead Scoring Agent auto-synced overnight; MQL dashboard refreshed with attribution and no discrepancies" },
        { time: "9:00", activity: "Building a target account list for a new campaign — cross-referencing Salesforce accounts with 6sense intent data in a spreadsheet.", processes: ["ABM Targeting", "List Building"], agentOpportunity: "ABM Campaign Manager identified 120 accounts showing surging intent signals and auto-built the target list" },
        { time: "10:00", activity: "Setting up a nurture email sequence in HubSpot — manually creating 5 emails, enrollment triggers, and branch logic.", processes: ["Campaign Setup", "Email Automation"], agentOpportunity: "Campaign Builder generated the full sequence from the brief, including personalized content paths by segment" },
        { time: "11:00", activity: "Reviewing Google Ads and LinkedIn campaign performance — exporting data to build a cross-channel report in Google Sheets.", processes: ["Paid Media Reporting", "Channel Analysis"], agentOpportunity: "Paid Media Optimizer auto-generated the cross-channel report with optimization recommendations and bid adjustments" },
        { time: "1:00", activity: "Preparing for a weekly pipeline review — manually calculating campaign-sourced vs. campaign-influenced pipeline in Salesforce reports.", processes: ["Pipeline Analysis", "Attribution"], agentOpportunity: "Campaign ROI Analyzer generated the full pipeline attribution report with multi-touch insights" },
        { time: "2:30", activity: "Investigating why MQL-to-SQL conversion dropped — looking at lead quality across campaigns one by one.", processes: ["Funnel Analysis", "Lead Quality"], agentOpportunity: "Funnel Velocity Analyzer flagged the root cause: SDR capacity constraint, not lead quality decline" },
        { time: "4:00", activity: "Planning next quarter's campaign calendar — estimating budgets and targets in a spreadsheet with formulas from last quarter.", processes: ["Campaign Planning", "Budget Forecasting"], agentOpportunity: "Budget Allocator forecasted channel-level ROI and recommended optimal budget allocation with confidence ranges" },
      ]
    },
    {
      persona: "Content Strategist",
      intro: "The Content Strategist plans, produces, and optimizes content across channels — balancing editorial quality, SEO requirements, and campaign deadlines with limited creative resources.",
      blocks: [
        { time: "8:00", activity: "Reviewing the content calendar — checking which pieces are on track, which writers are behind, and what gaps exist for upcoming campaigns.", processes: ["Content Planning", "Project Management"], agentOpportunity: "Campaign Calendar Orchestrator flagged 3 at-risk deliverables and suggested repurposing existing assets to fill gaps" },
        { time: "9:00", activity: "Writing a content brief for a blog post — manually researching keywords in SEMrush, reviewing competitor articles, and outlining the piece.", processes: ["Content Brief", "Keyword Research"], agentOpportunity: "Content Brief Generator produced a comprehensive brief with keyword gaps, competitor analysis, and recommended angle" },
        { time: "10:00", activity: "Editing a 3,000-word whitepaper draft — checking brand voice consistency, technical accuracy, and SEO optimization.", processes: ["Content Editing", "Brand Compliance"], agentOpportunity: "Brand Voice Checker flagged 4 tone inconsistencies and suggested rewrites; SEO Audit checked optimization" },
        { time: "11:00", activity: "Repurposing a webinar recording into social posts, a blog summary, and an email newsletter — spending 2 hours on derivative content.", processes: ["Content Repurposing", "Multi-Channel"], agentOpportunity: "Content Repurposing Agent generated 5 LinkedIn posts, 3 tweet threads, an email section, and a blog summary in minutes" },
        { time: "1:00", activity: "Meeting with the design team to brief a landing page and social graphics — manually writing creative specs.", processes: ["Creative Briefing", "Design Coordination"], agentOpportunity: "Creative Asset Generator produced design specs with copy variations, CTA options, and brand-compliant templates" },
        { time: "2:30", activity: "Analyzing content performance — downloading GA4 data, cross-referencing with HubSpot lead data, trying to figure out which content drives pipeline.", processes: ["Content Analytics", "Attribution"], agentOpportunity: "Content Performance Analyzer generated a content-to-pipeline report with decay alerts and optimization recommendations" },
        { time: "4:00", activity: "Searching the DAM for approved assets — finding outdated logos, expired stock photos, and inconsistent naming that makes discovery impossible.", processes: ["Asset Management", "DAM Maintenance"], agentOpportunity: "DAM Lifecycle Manager flagged 23 outdated assets, suggested replacements, and cleaned up taxonomy tags" },
      ]
    },
    {
      persona: "Marketing Analyst",
      intro: "The Marketing Analyst builds dashboards, runs attribution models, and answers stakeholder questions — translating marketing data into strategic decisions.",
      blocks: [
        { time: "8:00", activity: "Refreshing the weekly marketing dashboard in Looker — fixing a broken data connection between GA4 and BigQuery that happened overnight.", processes: ["Dashboard Maintenance", "Data Pipeline"], agentOpportunity: "MarTech Health Monitor detected and auto-resolved the sync failure; dashboard refreshed on schedule" },
        { time: "9:00", activity: "Building a multi-touch attribution report — manually stitching GA4 sessions with HubSpot touches and Salesforce pipeline in SQL.", processes: ["Attribution Modeling", "Data Engineering"], agentOpportunity: "Multi-Touch Attribution Engine auto-stitched cross-system journeys and generated attribution with Shapley values" },
        { time: "10:00", activity: "Fielding Slack questions: 'What's our CAC by channel this quarter?' — running queries across 3 systems and formatting in a slide.", processes: ["Ad-Hoc Analysis", "Stakeholder Support"], agentOpportunity: "Marketing Dashboard answered the natural language question with a formatted response and supporting visualization" },
        { time: "11:00", activity: "Analyzing an A/B test on a landing page — calculating significance, checking for novelty effects, and writing up findings.", processes: ["Experimentation", "Statistical Analysis"], agentOpportunity: "A/B Test Analyzer auto-calculated significance with segment-level analysis and strategic interpretation" },
        { time: "1:00", activity: "Investigating a sudden drop in email open rates — checking deliverability, list quality, and send patterns across multiple tools.", processes: ["Deliverability Analysis", "Root Cause"], agentOpportunity: "Email Deliverability Manager diagnosed the cause: domain reputation impact from re-engagement send, with a remediation plan" },
        { time: "2:30", activity: "Running the quarterly marketing mix model in R — updating the dataset, re-training the model, and preparing results for the CMO.", processes: ["Marketing Mix Modeling", "Executive Reporting"], agentOpportunity: "Marketing Mix Modeler ran the updated model with channel saturation curves and budget optimization recommendations" },
        { time: "4:00", activity: "Auditing UTM parameters across recent campaigns — finding 15 variations of the same campaign name that break attribution.", processes: ["Data Governance", "UTM Hygiene"], agentOpportunity: "UTM Governance Agent flagged and consolidated the 15 variants before they reached the reporting layer" },
      ]
    },
  ],

  raci: {
    personas: ["CMO", "VP Mktg", "Brand Mgr", "Content", "Demand Gen", "Digital Mktg", "Social", "Analyst", "SEO/SEM", "Mkt Ops", "PMM", "Field Mktg"],
    matrix: [
      // M1  M2  M3  M4  M5  M6  M7  M8  M9
      ["R","C","C","I","I","R","R","C","C"],  // CMO
      ["R","C","R","C","I","C","C","R","I"],  // VP Marketing
      ["C","R","I","I","I","I","R","I","C"],  // Brand Manager
      ["I","R","C","C","R","I","C","I","I"],  // Content Strategist
      ["C","I","R","C","I","R","I","I","C"],  // Demand Gen Manager
      ["I","I","R","R","C","C","I","C","I"],  // Digital Marketing Mgr
      ["I","C","I","I","R","I","C","I","I"],  // Social Media Mgr
      ["I","I","I","I","I","R","I","C","R"],  // Marketing Analyst
      ["I","I","I","R","I","C","I","I","I"],  // SEO/SEM Specialist
      ["C","I","C","I","I","C","I","R","I"],  // Marketing Ops Lead
      ["C","C","C","I","I","C","R","I","R"],  // Product Marketing Mgr
      ["I","I","R","I","C","I","I","I","I"],  // Field Marketing Mgr
    ],
  },

  techLandscape: {
    asIs: [
      { label: "Marketing Automation", tools: "HubSpot, Marketo, Salesforce Marketing Cloud" },
      { label: "CRM", tools: "Salesforce, HubSpot CRM" },
      { label: "Advertising", tools: "Google Ads, Meta Ads Manager, LinkedIn Ads" },
      { label: "SEO / SEM", tools: "SEMrush, Ahrefs, Google Search Console" },
      { label: "Analytics", tools: "Google Analytics 4, Adobe Analytics, Looker" },
      { label: "Social", tools: "Sprout Social, Hootsuite, Brandwatch" },
      { label: "Content / Creative", tools: "Contentful, WordPress, Figma, Canva" },
      { label: "ABM / Intent", tools: "6sense, Demandbase, Clearbit" },
      { label: "Reporting", tools: "Looker, BigQuery, Google Sheets" },
    ],
    toBe: [
      { label: "Source Systems", description: "MAP, CRM, Ad Platforms, SEO Tools, Social, ABM, Content — connected via APIs" },
      { label: "Gemini Enterprise Agent Layer", description: "65 autonomous agents across 9 domains — Research → Plan → Create → Distribute → Engage → Convert → Measure → Optimize" },
      { label: "Unified Marketing Data Lake", description: "BigQuery — single source of truth for all marketing data, attribution, and campaign intelligence" },
      { label: "Insights & Actions", description: "Real-time dashboards, predictive pipeline, autonomous campaign optimization, and data-driven budget allocation" },
    ],
    painPoint: "2-3 week campaign cycles, broken attribution, manual reporting, disconnected MarTech",
    benefit: "Same-day campaigns, full-funnel attribution, autonomous optimization, unified marketing intelligence",
  },

  integrationSystems: ["HubSpot", "Marketo", "Salesforce", "Google Ads", "Meta Ads", "SEMrush", "GA4", "Contentful"],
  externalAgents: ["HubSpot Agents", "Salesforce Agents", "Google Ads Agents"],
  transformationSteps: [
    { domain: "Demand Generation", activity: "Build and optimize campaigns", asIs: "Manual campaign setup, A/B testing takes weeks", toBe: "Campaign Builder orchestrates multi-channel campaigns with ML optimization", agentName: "Campaign Builder", impact: "Campaign launch time reduced 70%" },
    { domain: "Content & Creative", activity: "Create marketing content", asIs: "3-5 day content creation cycle, manual brand checks", toBe: "Content Drafter generates on-brand content with voice consistency scoring", agentName: "Content Drafter", impact: "Content cycle from days to hours" },
    { domain: "Marketing Analytics", activity: "Attribute pipeline to channels", asIs: "Last-touch attribution, no cross-channel visibility", toBe: "Multi-Touch Attribution Engine models full customer journey impact", agentName: "Attribution Engine", impact: "Attribution accuracy from 30% to 85%" },
    { domain: "Digital & SEO", activity: "Optimize search presence", asIs: "Monthly manual SEO audits, reactive fixes", toBe: "SEO Audit Engine continuously monitors 200+ ranking factors", agentName: "SEO Audit Engine", impact: "From monthly to continuous optimization" },
  ],
};
