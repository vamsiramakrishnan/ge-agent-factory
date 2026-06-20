import { User, Users, UserPlus, BarChart3, Shield, Heart, GraduationCap, Scale, Settings, LineChart, Zap, Layout } from "lucide-react";
import { DepartmentConfig } from "./types";

export const hrDepartment: DepartmentConfig = {
  key: "hr",
  label: "HR & People Ops",
  shortLabel: "HR",
  icon: Users,
  accentColor: "#3b82f6",
  activeBg: "bg-blue-600",
  domainRange: [1, 10],

  subtitle: "10 Domains • 82 Agents • 12 Personas",
  description: "The complete HR transformation — from workforce planning through talent acquisition, performance management, and people analytics. Every agent grounded in real personas, real systems, and real workflows.",

  periodicTableTitle: "The Periodic Table of HR Agents",
  periodicTableSubtitle: "82 AI agents across 10 HR domains. Click any element to explore its workflow, triggers, and human-in-the-loop checkpoints.",

  domainColors: {
    1: "#3b82f6", 2: "#10b981", 3: "#8b5cf6", 4: "#ef4444", 5: "#f59e0b",
    6: "#64748b", 7: "#ec4899", 8: "#6366f1", 9: "#06b6d4", 10: "#334155",
  },

  challenge: {
    title: "The Legacy Friction",
    items: [
      { icon: Users, title: "Talent Bottlenecks", desc: "Manual screening takes 60% of recruiter time." },
      { icon: Zap, title: "Onboarding Lag", desc: "Average 45 days to full productivity." },
      { icon: Layout, title: "Siloed Data", desc: "People data trapped in disconnected legacy systems." },
    ],
    stat: "42%",
    statLabel: "Efficiency Gap",
    statDesc: "Current HR processes are losing nearly half their potential impact to administrative overhead.",
  },

  personas: [
    { title: "CHRO", desc: "Owns people strategy, M&A integration, executive comp, DEI, ESG metrics", metrics: "Board reporting, workforce ROI", domains: [1,3,4,7,9], icon: User, color: "#005bbf" },
    { title: "VP Talent Acquisition", desc: "Leads recruiting strategy, employer branding, sourcing channels, hiring velocity", metrics: "Time-to-fill, offer acceptance, diversity hiring", domains: [2,9], icon: UserPlus, color: "#10b981" },
    { title: "HR Business Partner", desc: "Embedded strategic advisor translating business objectives into people interventions", metrics: "Org design, succession, engagement action plans", domains: [1,3,6,7,10], icon: Users, color: "#8b5cf6" },
    { title: "Comp & Benefits Mgr", desc: "Designs total rewards philosophy including salary bands, incentives, equity, and benefits", metrics: "Pay equity, benchmarking, enrollment, FLSA/ACA", domains: [4], icon: Scale, color: "#ef4444" },
    { title: "HR Ops / People Ops", desc: "Runs HRIS administration, employee data integrity, shared-service delivery, and process optimization", metrics: "SLA management, data quality, query resolution", domains: [8], icon: Settings, color: "#6366f1" },
    { title: "L&D Manager", desc: "Owns capability-building strategy, training catalog, leadership development, learning tech", metrics: "Skills-gap analysis, content curation, ROI, compliance", domains: [5], icon: GraduationCap, color: "#f59e0b" },
    { title: "ER Specialist", desc: "Manages grievances, investigations, disciplinary actions, accommodations, and policy interpretation", metrics: "Case resolution, legal risk, documentation, mediation", domains: [6], icon: Shield, color: "#4b5563" },
    { title: "DEI Program Mgr", desc: "Drives diversity, equity, inclusion initiatives and tracks representation metrics", metrics: "ERG management, inclusive hiring, pay-gap reporting", domains: [9], icon: Heart, color: "#06b6d4" },
    { title: "People Analytics", desc: "Transforms workforce data into insights via dashboards, predictive models, and analyses", metrics: "Attrition modeling, engagement drivers, HR data governance", domains: [10], icon: LineChart, color: "#111827" },
    { title: "Payroll Specialist", desc: "Ensures accurate, timely payroll processing and regulatory adherence across jurisdictions", metrics: "Tax filings, labor-law compliance, audit readiness", domains: [8,6], icon: Settings, color: "#6366f1" },
    { title: "Recruiter / TA Partner", desc: "Executes end-to-end hiring: sourcing, screening, interviewing, and closing candidates", metrics: "Boolean sourcing, ATS management, offer negotiation", domains: [2], icon: UserPlus, color: "#10b981" },
    { title: "HRIS / HR Tech Analyst", desc: "Configures, maintains, and optimizes the HR technology ecosystem and integrations", metrics: "System admin, data migrations, workflow automation", domains: [10,8], icon: BarChart3, color: "#111827" },
  ],

  dayInLife: [
    {
      persona: "HRBP",
      intro: "The HRBP operates as an embedded strategic advisor, translating business objectives into people interventions across multiple domains daily.",
      blocks: [
        { time: "8:00", activity: "Review org health dashboard: attrition trends by team, open requisitions aging, engagement pulse scores for assigned BUs.", processes: ["Workforce Analytics", "Strategic Planning"], agentOpportunity: "Data Lake Query Agent auto-generates morning briefing" },
        { time: "9:00", activity: "Workforce planning session with BU VP: model headcount needs for Q3 expansion, discuss contractor-to-FTE conversion for 12 roles.", processes: ["Strategic Workforce Planning", "Org Design"], agentOpportunity: "Scenario Modeling Agent runs live what-if models during meeting" },
        { time: "10:30", activity: "Succession planning review: assess readiness of 3 VP-track candidates, review 9-box placements, identify development gaps.", processes: ["Succession Planning", "HiPo Program"], agentOpportunity: "Successor Readiness Agent provides multi-signal potential scores" },
        { time: "11:30", activity: "Manager coaching: prepare for difficult conversation about underperforming team lead; review PIP criteria and progressive discipline options.", processes: ["Disciplinary Action", "Performance Improvement"], agentOpportunity: "Discipline Advisor Agent surfaces precedent cases and consistent action recommendations" },
        { time: "1:00", activity: "Engagement action plan review: team scored 3.2/5 on manager effectiveness; work with L&D on targeted management training intervention.", processes: ["Engagement Surveys", "Leadership Development"], agentOpportunity: "Engagement Synthesizer Agent identifies specific driver gaps by team" },
        { time: "2:30", activity: "Change management: draft communications for upcoming restructuring of 2 departments affecting 85 employees.", processes: ["Org Restructuring", "Change Management"], agentOpportunity: "Change Comms Drafter Agent creates tier-specific messaging packages" },
        { time: "4:00", activity: "Compensation review: partner with Comp Manager to analyze pay equity gaps in engineering org before merit cycle.", processes: ["Comp Benchmarking", "Pay Equity"], agentOpportunity: "Pay Equity Audit Agent runs continuous regression with real-time gap detection" },
      ]
    },
    {
      persona: "Recruiter",
      intro: "The Recruiter executes end-to-end hiring for assigned roles — sourcing, screening, interviewing, and closing — while juggling 20-30 open requisitions simultaneously.",
      blocks: [
        { time: "8:00", activity: "Review ATS dashboard: 5 new applications overnight, 2 interview reschedule requests, 1 offer pending for 3 days.", processes: ["Sourcing & Pipeline", "Interview & Selection"], agentOpportunity: "Resume Screening Agent already ranked overnight applications by fit score" },
        { time: "9:00", activity: "Source for senior engineer role: Boolean search on LinkedIn, review referral submissions, evaluate 3 agency candidates.", processes: ["Sourcing & Pipeline"], agentOpportunity: "Candidate Sourcing Agent runs multi-channel search and generates personalized outreach" },
        { time: "10:30", activity: "Interview coordination: schedule panel interviews for 4 candidates across 3 time zones with 12 interviewers.", processes: ["Interview & Selection"], agentOpportunity: "Interview Scheduling Agent handles multi-panel coordination automatically" },
        { time: "12:00", activity: "Debrief meeting: review scorecards from yesterday's interviews, facilitate hiring decision for product manager role.", processes: ["Interview & Selection", "Offer & Pre-boarding"], agentOpportunity: "Debrief Summarizer Agent creates structured consensus analysis from scorecards" },
        { time: "1:30", activity: "Offer preparation: work with Comp Manager to model competitive offer for finalist, compare to market data.", processes: ["Offer & Pre-boarding", "Comp Benchmarking"], agentOpportunity: "Offer Package Modeler Agent generates market-calibrated scenarios instantly" },
        { time: "3:00", activity: "New hire onboarding follow-up: check Day-7 status for 2 recent starts, ensure IT provisioning complete, buddy assigned.", processes: ["Onboarding & Integration"], agentOpportunity: "Onboarding Orchestration Agent tracks all tasks with proactive escalation" },
        { time: "4:00", activity: "Pipeline review with TA Lead: present hiring velocity metrics, flag 3 aging requisitions, discuss sourcing strategy pivot.", processes: ["Requisition & Approval", "Workforce Analytics"], agentOpportunity: "Req Prioritization Agent provides data-driven priority scoring for the pipeline" },
      ]
    },
    {
      persona: "People Analytics",
      intro: "The People Analytics Analyst transforms raw HR data into actionable intelligence — building dashboards, predictive models, and ad-hoc analyses that drive evidence-based decisions.",
      blocks: [
        { time: "8:00", activity: "Data pipeline monitoring: check ETL job status for overnight HRIS-to-warehouse sync, investigate data quality alert on missing termination records.", processes: ["Workforce Analytics", "Employee Data Mgmt"], agentOpportunity: "HRIS Data Quality Monitor Agent detects and auto-fixes quality issues continuously" },
        { time: "9:00", activity: "Attrition model refresh: retrain predictive flight-risk model with Q4 data, evaluate feature importance changes, validate against recent departures.", processes: ["Workforce Analytics"], agentOpportunity: "Attrition Prediction Agent runs ML models weekly with automated retraining" },
        { time: "10:00", activity: "HRBP request: ad-hoc analysis on engineering team productivity correlated with engagement scores and manager check-in frequency.", processes: ["Workforce Analytics", "Engagement Surveys"], agentOpportunity: "HR Data Lake Query Agent translates natural language questions to SQL instantly" },
        { time: "11:00", activity: "Engagement survey deep-dive: run driver analysis on latest results, identify top 5 factors differentiating high vs low engagement teams.", processes: ["Engagement Surveys", "Workforce Analytics"], agentOpportunity: "Engagement-Outcome Correlation Agent performs statistical driver analysis automatically" },
        { time: "1:00", activity: "Pay equity support: build multi-variate regression model, control for tenure, performance, location, job family.", processes: ["Workforce Analytics", "DEI Strategy"], agentOpportunity: "Pay Equity Audit Agent runs continuous regression with automatic gap flagging" },
        { time: "2:30", activity: "Executive dashboard development: build real-time Looker dashboard showing headcount, attrition, hiring velocity, cost-per-hire, diversity metrics.", processes: ["Workforce Analytics", "Strategic Planning"], agentOpportunity: "Workforce Cost Modeling Agent calculates fully-loaded costs in real-time" },
        { time: "4:00", activity: "Workforce planning support: run scenario models showing headcount projections under 3 growth scenarios with attrition impact modeling.", processes: ["Strategic Planning", "Workforce Analytics"], agentOpportunity: "Scenario Modeling Agent runs 50+ scenarios in minutes vs weeks" },
      ]
    },
  ],

  raci: {
    personas: ["CHRO","VP TA","HRBP","Comp Mgr","HR Ops","L&D Mgr","ER Spec","DEI Mgr","Analytics","Payroll","Recruiter","HRIS"],
    matrix: [
      ["R","C","R","R","C","C","R","I","R","C"],
      ["C","R","I","C","I","I","C","I","C","C"],
      ["R","C","R","C","C","R","R","I","C","C"],
      ["C","C","C","R","I","I","I","I","C","C"],
      ["I","I","I","I","I","I","I","R","I","C"],
      ["C","C","C","I","R","I","C","I","I","I"],
      ["I","I","C","I","I","R","C","C","I","I"],
      ["C","C","C","C","C","C","R","I","R","C"],
      ["C","C","C","C","C","I","C","C","C","R"],
      ["I","I","I","C","I","C","I","R","I","I"],
      ["I","R","I","I","I","I","I","I","C","I"],
      ["I","I","I","I","I","I","I","R","I","R"],
    ],
  },

  techLandscape: {
    asIs: [
      { label: "HRIS", tools: "Workday, SAP SuccessFactors" },
      { label: "ATS", tools: "Greenhouse, Lever, iCIMS" },
      { label: "Payroll", tools: "ADP, Ceridian" },
      { label: "LMS", tools: "Cornerstone, LinkedIn Learning" },
      { label: "Service Desk", tools: "ServiceNow" },
      { label: "Survey", tools: "Qualtrics, Culture Amp" },
      { label: "Comp", tools: "Mercer, Radford, Payscale" },
      { label: "Analytics", tools: "Spreadsheets, Tableau, Looker" },
      { label: "Communication", tools: "Email, Slack, Intranet" },
    ],
    toBe: [
      { label: "Source Systems", description: "HRIS, ATS, Payroll, LMS, Service Desk, Survey, Comp — connected via APIs" },
      { label: "Gemini Enterprise Agent Layer", description: "82 autonomous agents across 4 tiers — orchestrating, reasoning, executing" },
      { label: "Unified People Data Lake", description: "BigQuery — single source of truth for all people data, events, and metrics" },
      { label: "Insights & Actions", description: "Real-time dashboards, proactive notifications, automated workflows" },
    ],
    painPoint: "Fragmented data, manual integrations, siloed insights",
    benefit: "Unified data, autonomous orchestration, real-time insights",
  },

  integrationSystems: ["Workday", "SAP SuccessFactors", "ADP", "Greenhouse", "ServiceNow", "Qualtrics", "Cornerstone", "Google Workspace"],
  externalAgents: ["Workday Agents", "SAP Agents", "ServiceNow Agents"],
  transformationSteps: [
    { domain: "Talent Acquisition", activity: "Screen candidates", asIs: "Manual resume review, 60% of recruiter time", toBe: "Resume Screening Agent ranks by fit score overnight", agentName: "Resume Screening", impact: "Screening time reduced 85%" },
    { domain: "HR Operations", activity: "Process lifecycle transactions", asIs: "Manual HRIS entry, post-hoc validation", toBe: "Data Change Orchestrator validates and triggers downstream", agentName: "Data Change Orchestrator", impact: "Transaction processing automated" },
    { domain: "Performance Mgmt", activity: "Write performance reviews", asIs: "Managers spend 4-6 hours per direct report", toBe: "Performance Narrative Agent drafts from continuous feedback", agentName: "Performance Narrative", impact: "Review drafting reduced to 30 minutes" },
    { domain: "Compensation", activity: "Benchmark compensation", asIs: "Annual manual survey pulls, 2-3 data sources", toBe: "Market Benchmarking Agent tracks 10+ sources continuously", agentName: "Market Benchmarking", impact: "Refresh cycle from annual to monthly" },
  ],
};
