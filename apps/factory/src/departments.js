export const DEPARTMENTS = [
  {
    id: "hr",
    label: "HR & People Ops",
    shortLabel: "HR",
    subtitle: "10 domains, 82 agents, 12 personas",
    color: "#3b82f6",
    description: "Workforce planning, talent acquisition, performance, HR operations, and people analytics grounded in real HR systems.",
    systems: ["Workday", "SAP SuccessFactors", "ADP", "Greenhouse", "ServiceNow", "Qualtrics", "Cornerstone", "Google Workspace"],
    personas: [
      { title: "HR Business Partner", pain: "Needs org health, workforce planning, succession, engagement, and change support.", metrics: "Org design, succession, engagement action plans" },
      { title: "Recruiter / TA Partner", pain: "Juggles high-volume sourcing, interview loops, offers, and onboarding handoffs.", metrics: "Time-to-fill, candidate quality, offer acceptance" },
      { title: "People Analytics", pain: "Turns raw HRIS, survey, and workforce data into decision-grade insight.", metrics: "Attrition prediction, data quality, dashboard adoption" },
    ],
    useCases: [
      { title: "Data Lake Query Agent", domain: "Workforce Analytics", asIs: "Ad-hoc HR analysis requires manual SQL and spreadsheet cleanup.", toBe: "Natural-language questions become governed BigQuery queries with cited results.", impact: "Self-service answers in minutes" },
      { title: "Interview Scheduling Agent", domain: "Talent Acquisition", asIs: "Recruiters manually coordinate panel interviews across calendars and time zones.", toBe: "Agent orchestrates candidate, interviewer, and room availability with escalation.", impact: "Scheduling effort reduced 85%" },
      { title: "Pay Equity Audit Agent", domain: "Compensation", asIs: "Pay equity checks happen during annual cycles with manual regression analysis.", toBe: "Continuous pay equity monitoring with explainable gap detection.", impact: "Monthly proactive risk detection" },
    ],
  },
  {
    id: "finance",
    label: "Finance",
    shortLabel: "Finance",
    subtitle: "9 domains, 68 agents, 12 personas",
    color: "#0d9488",
    description: "Plan, record, pay, collect, manage, comply, assure, measure, and analyze across ERP and finance data.",
    systems: ["SAP S/4HANA FI/CO", "Anaplan", "BlackLine", "HighRadius", "Kyriba", "Avalara", "AuditBoard", "Workiva"],
    personas: [
      { title: "FP&A Analyst", pain: "Builds variance bridges, scenarios, board decks, and ad-hoc answers from fragmented models.", metrics: "Forecast accuracy, model throughput, response time" },
      { title: "AP Manager", pain: "Processes invoices, resolves match exceptions, catches duplicates, and optimizes payments.", metrics: "Touchless rate, DPO, duplicate payments" },
      { title: "Controller", pain: "Owns close, reconciliations, technical accounting, consolidation, and reporting confidence.", metrics: "Close cycle, reconciliation rate, audit findings" },
    ],
    useCases: [
      { title: "Variance Analysis Agent", domain: "FP&A", asIs: "Manual budget-vs-actual bridge calculations in Excel.", toBe: "Root-cause narratives and variance bridges generated from actuals.", impact: "From days to minutes" },
      { title: "Invoice Processing Agent", domain: "Accounts Payable", asIs: "Manual data entry and three-way match review.", toBe: "Auto-extract, match, and route exceptions with evidence.", impact: "Touchless rate from 60% to 95%" },
      { title: "Account Reconciliation Agent", domain: "General Ledger", asIs: "Manual workpaper prep and reviewer sampling.", toBe: "Auto-certifies low-risk accounts and flags exceptions.", impact: "Reconciliation effort reduced 80%" },
    ],
  },
  {
    id: "procurement",
    label: "Procurement",
    shortLabel: "Procurement",
    subtitle: "9 domains, 78 agents, 12 personas",
    color: "#ea580c",
    description: "Plan, source, contract, purchase, pay, manage, and analyze using S2P, ERP, CLM, supplier, and market data.",
    systems: ["SAP Ariba", "Coupa", "SAP S/4HANA", "Icertis", "Basware", "D&B", "S&P Platts", "BigQuery"],
    personas: [
      { title: "Category Manager", pain: "Builds category strategy, sourcing events, supplier discovery, and QBRs from scattered data.", metrics: "Savings delivery, contract coverage, supplier performance" },
      { title: "P2P Operations Manager", pain: "Clears stuck requisitions, invoice exceptions, duplicate payments, and requester questions.", metrics: "Touchless PO rate, exception rate, cycle time" },
      { title: "Procurement Analytics Lead", pain: "Maintains spend cubes, savings tracking, commodity forecasts, and executive reporting.", metrics: "Spend visibility, data quality, forecast accuracy" },
    ],
    useCases: [
      { title: "Bid Evaluation Agent", domain: "Strategic Sourcing", asIs: "Supplier bids compared manually in spreadsheets.", toBe: "Weighted scoring, Pareto frontier, and award rationale generated.", impact: "Evaluation time reduced 75%" },
      { title: "Three-Way Match Agent", domain: "Procure-to-Pay", asIs: "25-35% exceptions reviewed manually line by line.", toBe: "Tolerance exceptions resolved automatically; true exceptions escalated.", impact: "Exception rate reduced to 5-8%" },
      { title: "Disruption Monitor Agent", domain: "Supplier Risk", asIs: "Quarterly tier-1 supplier reviews.", toBe: "Continuous multi-tier risk monitoring with recommended actions.", impact: "From quarterly to real time" },
    ],
  },
  {
    id: "it",
    label: "Information Technology",
    shortLabel: "IT",
    subtitle: "9 domains, 70 agents, 12 personas",
    color: "#1d4ed8",
    description: "Strategize, build, run, secure, support, platform, architect, govern, and enable across DevOps, ITSM, cloud, and security.",
    systems: ["ServiceNow", "Jira", "GitHub", "Jenkins", "Terraform", "CrowdStrike", "Datadog", "PagerDuty"],
    personas: [
      { title: "DevOps Lead", pain: "Diagnoses build failures, drift, tech debt, PR reviews, releases, and feature flags.", metrics: "Deployment frequency, lead time, change failure rate" },
      { title: "Security Analyst", pain: "Triage alerts, investigate identity anomalies, prioritize vulnerabilities, and prepare evidence.", metrics: "MTTD, remediation SLA, false positive rate" },
      { title: "IT Service Desk Manager", pain: "Routes tickets, prevents SLA breaches, manages incidents, and improves self-service.", metrics: "CSAT, first-contact resolution, SLA attainment" },
    ],
    useCases: [
      { title: "SIEM Triage Agent", domain: "Cybersecurity", asIs: "Manual review of 200+ daily SIEM alerts.", toBe: "Benign alerts auto-classified with evidence; real threats surfaced.", impact: "Analyst workload reduced 90%" },
      { title: "KB Auto-Resolver Agent", domain: "IT Service Management", asIs: "Repetitive L1 tickets routed and resolved manually.", toBe: "Self-service answers and guided remediation from knowledge base.", impact: "L1 ticket volume reduced 60%" },
      { title: "Cloud Cost Optimizer Agent", domain: "Cloud Operations", asIs: "Quarterly cost reviews and manual right-sizing.", toBe: "Continuous savings recommendations and cleanup PRs.", impact: "Cloud spend reduced 25-35%" },
    ],
  },
  {
    id: "marketing",
    label: "Marketing",
    shortLabel: "Marketing",
    subtitle: "9 domains, 65 agents, 12 personas",
    color: "#8b5cf6",
    description: "Research, plan, create, distribute, engage, convert, measure, and optimize across MarTech and campaign data.",
    systems: ["HubSpot", "Marketo", "Salesforce", "Google Ads", "Meta Ads", "SEMrush", "GA4", "Contentful"],
    personas: [
      { title: "Demand Gen Manager", pain: "Builds target lists, nurture programs, paid reports, attribution, and budget forecasts.", metrics: "MQLs, SQLs, pipeline, conversion rates" },
      { title: "Content Strategist", pain: "Plans, briefs, edits, repurposes, and measures content across channels.", metrics: "Content output, organic traffic, pipeline influence" },
      { title: "Marketing Analyst", pain: "Owns attribution, dashboards, tests, funnel analysis, and data governance.", metrics: "Attribution accuracy, test velocity, data quality" },
    ],
    useCases: [
      { title: "Campaign Builder Agent", domain: "Demand Generation", asIs: "Campaign setup takes weeks across email, ads, CRM, and lists.", toBe: "Multi-channel campaign generated and optimized from a brief.", impact: "Launch time reduced 70%" },
      { title: "Content Drafter Agent", domain: "Content & Creative", asIs: "3-5 day content cycle with manual brand checks.", toBe: "On-brand drafts with voice consistency and channel variants.", impact: "Content cycle from days to hours" },
      { title: "Attribution Engine Agent", domain: "Marketing Analytics", asIs: "Last-touch attribution and disconnected reports.", toBe: "Multi-touch journey modeling across CRM, web, and ad platforms.", impact: "Attribution accuracy from 30% to 85%" },
    ],
  },
];

export const INTERVIEW_QUESTIONS = [
  {
    id: "sponsor",
    label: "Executive Sponsor",
    prompt: "Who is sponsoring this demo, and what decision do they need to make?",
    placeholder: "e.g. CHRO deciding whether to fund HR agent pilots",
  },
  {
    id: "workflow",
    label: "Workflow Moment",
    prompt: "Which workflow moment should the demo dramatize?",
    placeholder: "e.g. Monday morning attrition review, month-end close day 2",
  },
  {
    id: "systems",
    label: "Systems To Mock",
    prompt: "Which source systems must appear credible in the mock?",
    placeholder: "e.g. Workday, Greenhouse, BigQuery, ServiceNow",
  },
  {
    id: "evidence",
    label: "Evidence",
    prompt: "What evidence should the agent cite or generate?",
    placeholder: "e.g. SQL result, policy document, scorecard, audit trail",
  },
  {
    id: "success",
    label: "Success Metric",
    prompt: "What before/after metric should prove value?",
    placeholder: "e.g. screening time down 85%, close from 8 days to 3",
  },
];

export function getDepartment(id) {
  return DEPARTMENTS.find((department) => department.id === id) || DEPARTMENTS[0];
}
