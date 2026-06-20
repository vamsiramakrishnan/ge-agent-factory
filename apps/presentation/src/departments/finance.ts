import { User, Briefcase, Calculator, Receipt, CreditCard, Landmark, Building2, ShieldCheck, BarChart3, FileSpreadsheet, TrendingDown, Clock, Database } from "lucide-react";
import { DepartmentConfig } from "./types";

export const financeDepartment: DepartmentConfig = {
  key: "finance",
  label: "Finance",
  shortLabel: "Finance",
  icon: Calculator,
  accentColor: "#0d9488",
  activeBg: "bg-teal-600",
  domainRange: [20, 28],

  subtitle: "9 Domains • 68 Agents • 12 Personas",
  description: "End-to-end finance transformation — Plan → Record → Pay → Collect → Manage → Comply → Assure → Measure → Analyze. Every agent grounded in real accounting standards, real ERP systems, and the three-layer capability model.",

  periodicTableTitle: "The Periodic Table of Finance Agents",
  periodicTableSubtitle: "68 AI agents across 9 finance domains — Plan → Record → Pay → Collect → Manage → Comply → Assure → Measure → Analyze.",

  domainColors: {
    20: "#0d9488", 21: "#3b82f6", 22: "#d97706", 23: "#0891b2",
    24: "#7c3aed", 25: "#e11d48", 26: "#64748b", 27: "#ca8a04",
    28: "#334155",
  },

  challenge: {
    title: "The Finance Burden",
    items: [
      { icon: Clock, title: "Close Cycle Drag", desc: "Month-end close takes 8-10 days — half spent chasing reconciliations and manual journal entries." },
      { icon: TrendingDown, title: "Forecast Inaccuracy", desc: "Budgets are stale by month 2. Rolling forecasts rely on spreadsheets disconnected from actuals." },
      { icon: Database, title: "Fragmented Systems", desc: "Financial data spread across ERP, planning tools, tax systems, and dozens of spreadsheets." },
    ],
    stat: "65%",
    statLabel: "Time on Close & Compliance",
    statDesc: "Finance teams spend 65% of their time on transaction processing, reconciliations, and compliance — leaving only 35% for strategic analysis and business partnering.",
  },

  personas: [
    { title: "Chief Financial Officer", desc: "Owns financial strategy, board reporting, investor relations, M&A, capital allocation, and enterprise risk oversight", metrics: "EPS, revenue growth, margins, ROIC, capital structure", domains: [20,24,28], icon: User, color: "#0f766e" },
    { title: "VP Finance / Controller", desc: "Ensures accurate financial reporting, manages close process, maintains accounting policies and ASC compliance", metrics: "Close cycle, restatement risk, audit findings, GAAP compliance", domains: [20,21,27,28], icon: Briefcase, color: "#1d4ed8" },
    { title: "FP&A Director", desc: "Leads budgeting, forecasting, variance analysis, and strategic planning — the CFO's analytical engine", metrics: "Forecast accuracy, variance explanation, scenario coverage", domains: [20], icon: BarChart3, color: "#0f766e" },
    { title: "FP&A Analyst", desc: "Builds models, runs scenarios, answers ad-hoc questions, and prepares executive presentations", metrics: "Model throughput, data freshness, response time to requests", domains: [20,28], icon: BarChart3, color: "#0f766e" },
    { title: "AP Manager", desc: "Manages invoice processing, vendor payments, policy compliance, and working capital optimization", metrics: "Touchless rate, DPO, duplicate payments, discount capture", domains: [22], icon: Receipt, color: "#b45309" },
    { title: "AR Manager", desc: "Oversees collections, cash application, credit risk assessment, and dispute resolution", metrics: "DSO, bad debt rate, cash application rate, dispute resolution time", domains: [23], icon: CreditCard, color: "#0e7490" },
    { title: "Treasurer", desc: "Manages cash, FX exposure, investments, banking relationships, debt covenants, and liquidity", metrics: "Cash forecast accuracy, FX hedge effectiveness, investment yield", domains: [24], icon: Landmark, color: "#4338ca" },
    { title: "Tax Director", desc: "Manages tax provision, transfer pricing, compliance filings, and audit defense across jurisdictions", metrics: "ETR, audit adjustments, filing accuracy, Pillar Two readiness", domains: [25], icon: Building2, color: "#9f1239" },
    { title: "Chief Audit Executive", desc: "Leads internal audit, SOX testing, risk assessment, fraud detection, and audit committee reporting", metrics: "Finding closure rate, control effectiveness, risk coverage", domains: [26], icon: ShieldCheck, color: "#475569" },
    { title: "Cost Accountant", desc: "Manages standard costing, variances, product profitability, inventory valuation, and cost allocation", metrics: "Standard cost accuracy, variance analysis, margin visibility", domains: [27], icon: FileSpreadsheet, color: "#a16207" },
    { title: "Financial Reporting Mgr", desc: "Produces consolidated financials, manages XBRL/SEC filings, and oversees management reporting", metrics: "Filing timeliness, restatement count, report automation rate", domains: [28], icon: BarChart3, color: "#1e293b" },
    { title: "GL Accountant", desc: "Posts journal entries, performs account reconciliations, manages close tasks, and handles intercompany", metrics: "Reconciliation rate, JE accuracy, close task completion", domains: [21], icon: FileSpreadsheet, color: "#1d4ed8" },
  ],

  dayInLife: [
    {
      persona: "FP&A Analyst",
      intro: "The FP&A Analyst builds models, runs scenarios, and answers ad-hoc requests — juggling Excel, Anaplan, and SAP to turn raw financial data into strategic insight.",
      blocks: [
        { time: "8:00", activity: "Downloading actuals from SAP into Excel, manually mapping GL accounts to budget categories for the monthly variance report.", processes: ["Variance Analysis", "Data Extraction"], agentOpportunity: "Rolling Forecast Engine auto-refreshed overnight; Variance Analysis Agent flagged 5 items needing attention" },
        { time: "9:00", activity: "Building a variance bridge in PowerPoint — manually calculating budget vs. actual by department and writing explanations.", processes: ["Reporting", "Variance Analysis"], agentOpportunity: "Variance Analysis Agent already generated the bridge with root cause narratives per department" },
        { time: "10:00", activity: "Running 3 revenue forecast scenarios by manually adjusting cells in a 50-tab Excel model with broken links.", processes: ["Forecasting", "Scenario Planning"], agentOpportunity: "Scenario Modeling Agent runs Monte Carlo across 20+ variables in minutes with probability distributions" },
        { time: "11:00", activity: "Fielding Slack messages: 'how much did Marketing spend last month?' — querying SAP and reformatting in Excel.", processes: ["Ad-Hoc Analysis", "Stakeholder Support"], agentOpportunity: "FP&A Query Assistant answers natural language questions with context and citations instantly" },
        { time: "1:00", activity: "Preparing the CFO's board deck — copy-pasting charts from Looker into Google Slides and writing commentary.", processes: ["Board Reporting", "Presentation"], agentOpportunity: "Board Deck Generator assembled the full deck with management discussion narrative from the data" },
        { time: "2:30", activity: "Modeling a CapEx request — building NPV/IRR analysis from scratch for a $5M project in Excel.", processes: ["CapEx Analysis", "Investment Evaluation"], agentOpportunity: "CapEx Analyzer auto-calculated NPV/IRR with sensitivity analysis and comparable historical projects" },
        { time: "4:00", activity: "Reconciling headcount plan to budget — cross-referencing Workday data with Anaplan model, fixing mismatches.", processes: ["Headcount Planning", "Budget Reconciliation"], agentOpportunity: "Headcount Planning Agent synced HRIS data with financial plan and flagged 6 misalignments" },
      ]
    },
    {
      persona: "AP Manager",
      intro: "The AP Manager keeps the payment engine running — processing invoices, managing vendor payments, catching duplicates, and optimizing working capital.",
      blocks: [
        { time: "8:00", activity: "Processing 120 invoices from overnight email — manually keying data from scanned PDFs into SAP.", processes: ["Invoice Processing", "Data Entry"], agentOpportunity: "Invoice Processing Agent auto-extracted and matched 95 invoices; surfaced 25 exceptions for review" },
        { time: "9:00", activity: "Investigating 15 three-way match exceptions — comparing PO, invoice, and goods receipt line by line.", processes: ["Exception Management", "Three-Way Match"], agentOpportunity: "Matching Agent auto-resolved 11 (tolerance, rounding); escalated 4 genuine issues with context" },
        { time: "10:00", activity: "Checking for duplicate invoices before the payment run — running a report and scanning amounts manually.", processes: ["Fraud Prevention", "Payment Processing"], agentOpportunity: "Duplicate Detector flagged 3 potential duplicates with explanations for each" },
        { time: "11:00", activity: "Running the payment file — manually deciding which invoices to pay based on cash position and discount opportunities.", processes: ["Payment Optimization", "Working Capital"], agentOpportunity: "Payment Optimizer recommended paying $4.2M in early-discount invoices (18.2% annualized return)" },
        { time: "1:00", activity: "Updating vendor bank details — verifying changes against documentation, terrified of payment fraud.", processes: ["Vendor Management", "Fraud Prevention"], agentOpportunity: "Vendor Master Manager validated the bank change against D&B records and flagged a suspicious mismatch" },
        { time: "2:30", activity: "Reviewing AP aging report — tracking which invoices are in dispute and when resolution is expected.", processes: ["AP Analytics", "Dispute Management"], agentOpportunity: "AP Aging Analyzer generated narrative: disputed invoices total $2.1M, resolution expected by month-end" },
        { time: "4:00", activity: "Reviewing expense reports for policy compliance — looking for split-purchasing, excessive travel costs.", processes: ["Policy Compliance", "Expense Review"], agentOpportunity: "Policy Compliance Monitor flagged 7 potential split-purchase violations with evidence" },
      ]
    },
    {
      persona: "Controller",
      intro: "The Controller orchestrates the close — ensuring financial accuracy, managing accounting policies, and keeping the audit committee confident in the numbers.",
      blocks: [
        { time: "8:00", activity: "Reviewing the close checklist — chasing 5 team members who haven't completed their reconciliation tasks.", processes: ["Close Management", "Team Coordination"], agentOpportunity: "Close Orchestrator shows 92% task completion; 3 items auto-escalated with predicted delay impact" },
        { time: "9:00", activity: "Reading through 30+ account reconciliation workpapers looking for exceptions and incomplete substantiation.", processes: ["Account Reconciliation", "Quality Review"], agentOpportunity: "Account Reconciliation Agent flagged 4 accounts with exceptions; 26 auto-certified with evidence" },
        { time: "10:00", activity: "Investigating a $500K anomaly in the trial balance — tracing through journal entries to find the source.", processes: ["GL Review", "Anomaly Investigation"], agentOpportunity: "GL Anomaly Detector traced it to a misclassified expense entry — generated the correcting JE" },
        { time: "11:00", activity: "Reviewing revenue recognition memos for 3 new contracts — manually applying ASC 606 five-step model.", processes: ["Revenue Recognition", "Technical Accounting"], agentOpportunity: "Revenue Recognition Engine applied ASC 606 analysis with cited guidance; memos ready for review" },
        { time: "1:00", activity: "Working on the quarterly tax provision — waiting for the tax team's workpapers and checking last quarter's rates.", processes: ["Tax Provision", "Quarter-End"], agentOpportunity: "Tax Provision Calculator computed the provision with ASC 740 workpapers; ready for Tax Director" },
        { time: "2:30", activity: "Consolidating 8 entity financials — chasing intercompany reconciliation breaks across currencies and time zones.", processes: ["Consolidation", "Intercompany"], agentOpportunity: "Consolidation Agent eliminated IC transactions; IC Reconciliation resolved 95% of breaks" },
        { time: "4:00", activity: "Reviewing the financial statements package — checking disclosures, XBRL tags, and footnote completeness.", processes: ["Financial Reporting", "SEC Filing"], agentOpportunity: "Financial Statement Generator produced the package; Filing Orchestrator validated XBRL and disclosures" },
      ]
    },
  ],

  raci: {
    personas: ["CFO","Controller","FP&A Dir","FP&A Analyst","AP Mgr","AR Mgr","Treasurer","Tax Dir","CAE","Cost Acct","Rpt Mgr","GL Acct"],
    matrix: [
      // F1  F2  F3  F4  F5  F6  F7  F8  F9
      ["R","C","I","I","R","C","C","C","R"],  // CFO
      ["R","R","C","C","C","R","C","R","R"],  // Controller
      ["R","I","I","I","I","I","I","I","C"],  // FP&A Director
      ["R","I","I","I","I","I","I","I","R"],  // FP&A Analyst
      ["I","I","R","I","I","I","I","I","I"],  // AP Manager
      ["I","I","I","R","I","I","I","I","I"],  // AR Manager
      ["C","I","C","I","R","I","I","I","I"],  // Treasurer
      ["I","I","I","I","I","R","I","I","I"],  // Tax Director
      ["I","C","I","I","I","C","R","C","I"],  // CAE
      ["I","I","I","I","I","I","I","R","I"],  // Cost Accountant
      ["C","C","I","I","I","I","I","I","R"],  // Reporting Manager
      ["I","R","I","I","I","I","I","I","I"],  // GL Accountant
    ],
  },

  techLandscape: {
    asIs: [
      { label: "ERP", tools: "SAP S/4HANA FI/CO, Oracle Financials" },
      { label: "Planning", tools: "Anaplan, SAP BPC, Adaptive" },
      { label: "Close", tools: "BlackLine, FloQast" },
      { label: "AP Automation", tools: "Coupa, Basware, Kofax" },
      { label: "AR / Collections", tools: "HighRadius, Billtrust" },
      { label: "Treasury", tools: "Kyriba, GTreasury" },
      { label: "Tax", tools: "Avalara, Vertex, Longview" },
      { label: "Audit", tools: "AuditBoard, TeamMate" },
      { label: "Reporting", tools: "Workiva, Looker, Spreadsheets" },
    ],
    toBe: [
      { label: "Source Systems", description: "ERP, Planning, Close, AP, AR, Treasury, Tax, Audit — connected via APIs" },
      { label: "Gemini Enterprise Agent Layer", description: "68 autonomous agents across 9 domains — Plan → Record → Pay → Collect → Manage → Comply → Assure → Measure → Analyze" },
      { label: "Unified Finance Data Lake", description: "BigQuery — single source of truth for all financial data, metrics, and compliance artifacts" },
      { label: "Insights & Actions", description: "Real-time dashboards, proactive alerts, automated close workflows, board-ready narratives" },
    ],
    painPoint: "8-10 day close, stale forecasts, manual reconciliations, fragmented compliance",
    benefit: "3-day close, continuous forecasting, autonomous processing, real-time controls",
  },

  integrationSystems: ["SAP S/4HANA FI/CO", "Anaplan", "BlackLine", "HighRadius", "Kyriba", "Avalara", "AuditBoard", "Workiva"],
  externalAgents: ["SAP FI Agents", "BlackLine Agents", "Kyriba Agents"],
  transformationSteps: [
    { domain: "General Ledger", activity: "Reconcile accounts", asIs: "Manual workpaper preparation, 30+ accounts per close", toBe: "Account Reconciliation Agent auto-certifies 90% with evidence", agentName: "Account Reconciliation", impact: "Reconciliation effort reduced 80%" },
    { domain: "FP&A", activity: "Analyze budget variances", asIs: "Manual bridge calculations in Excel, days to produce", toBe: "Variance Analysis Agent generates root cause narratives automatically", agentName: "Variance Analysis", impact: "From days to minutes" },
    { domain: "Accounts Payable", activity: "Process invoices", asIs: "Manual data entry from PDFs, 60% touchless rate", toBe: "Invoice Processing Agent auto-extracts and matches, 95%+ touchless", agentName: "Invoice Processing", impact: "Touchless rate from 60% to 95%" },
    { domain: "Tax & Compliance", activity: "Calculate tax provision", asIs: "3-4 week manual provision process with spreadsheets", toBe: "Tax Provision Calculator computes ASC 740 provision in days", agentName: "Tax Provision", impact: "Provision cycle from weeks to days" },
  ],
};
