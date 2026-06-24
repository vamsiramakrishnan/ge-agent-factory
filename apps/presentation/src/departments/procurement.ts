import { User, Briefcase, Target, Layers, Search, FileSignature, CreditCard, AlertTriangle, Star, ShoppingCart, TrendingUp, TrendingDown, FileX, Clock } from "lucide-react";
import { DepartmentConfig } from "./types";

export const procurementDepartment: DepartmentConfig = {
  key: "procurement",
  label: "Procurement",
  shortLabel: "Procurement",
  icon: Briefcase,
  accentColor: "#ea580c",
  activeBg: "bg-orange-600",
  domainRange: [11, 19],

  subtitle: "9 Domains • 78 Agents • 12 Personas",
  description: "End-to-end procurement transformation — Plan → Source → Contract → Purchase → Pay → Manage → Analyze. Every agent grounded in real enterprise systems, real vendor names, and the three-layer capability model.",

  periodicTableTitle: "The Periodic Table of Procurement Agents",
  periodicTableSubtitle: "78 AI agents across 9 procurement domains — Plan → Source → Contract → Purchase → Pay → Manage → Analyze.",

  domainColors: {
    11: "#ea580c", 12: "#0d9488", 13: "#7c3aed", 14: "#dc2626", 15: "#ca8a04",
    16: "#78716c", 17: "#db2777", 18: "#4f46e5", 19: "#0891b2",
  },

  challenge: {
    title: "The Procurement Burden",
    items: [
      { icon: TrendingDown, title: "Savings Leakage", desc: "40-50% of identified savings never realized — no one tracks why." },
      { icon: FileX, title: "Maverick Spend", desc: "20-30% of addressable spend bypasses contracts and catalogs." },
      { icon: Clock, title: "Sourcing Bottleneck", desc: "Strategic RFx events take 90-120 days from requisition to award." },
    ],
    stat: "70%",
    statLabel: "Time on Transactions",
    statDesc: "Procurement teams spend 70% of their time on transactional operations — POs, invoices, approvals — instead of strategic sourcing.",
  },

  personas: [
    { title: "Chief Procurement Officer", desc: "Owns procurement strategy, savings targets, board reporting, transformation agenda, M&A due diligence", metrics: "Savings rate, spend under mgmt, category maturity", domains: [11,12,19], icon: User, color: "#ea580c" },
    { title: "VP / Director Procurement", desc: "Oversees category teams, stakeholder alignment, budget ownership, and procurement org effectiveness", metrics: "Team KPIs, stakeholder CSAT, pipeline coverage", domains: [11,12,17,19], icon: Briefcase, color: "#ea580c" },
    { title: "Category Manager", desc: "Executes category strategy, runs sourcing events, manages supplier relationships, and tracks market dynamics", metrics: "Savings delivery, contract coverage, supplier performance", domains: [12,13,17], icon: Target, color: "#0d9488" },
    { title: "Strategic Sourcing Lead", desc: "Manages RFx events end-to-end — from market analysis through negotiation to contract handoff", metrics: "Time-to-source, bid quality, negotiation outcomes", domains: [12,13,14], icon: Layers, color: "#0d9488" },
    { title: "Contract Manager", desc: "Handles contract drafting, redline negotiation, obligation tracking, renewals, and compliance monitoring", metrics: "Cycle time, deviation rate, renewal capture, compliance", domains: [14], icon: FileSignature, color: "#dc2626" },
    { title: "P2P Operations Manager", desc: "Drives req-to-pay process efficiency, exception management, touchless rates, and cycle time improvement", metrics: "Touchless PO rate, exception rate, cycle time, DPO", domains: [15], icon: CreditCard, color: "#ca8a04" },
    { title: "Buyer / Purchasing Agent", desc: "Processes transactional POs, manages catalogs, handles spot buys, and follows up with suppliers", metrics: "PO throughput, catalog adoption, order accuracy", domains: [15,18], icon: ShoppingCart, color: "#ca8a04" },
    { title: "Supplier Risk Analyst", desc: "Assesses supplier financial health, sanctions screening, disruption monitoring, and audit coordination", metrics: "Risk coverage, screening accuracy, disruption response", domains: [16], icon: AlertTriangle, color: "#57534e" },
    { title: "Supplier Relationship Mgr", desc: "Manages scorecards, quarterly business reviews, development programs, innovation capture, and escalations", metrics: "Scorecard accuracy, OTIF, quality PPM, QBR cadence", domains: [17], icon: Star, color: "#db2777" },
    { title: "Procurement Analytics Lead", desc: "Builds spend cubes, dashboards, forecasting models, benchmarking studies, and executive reports", metrics: "Spend visibility, data quality, forecast accuracy", domains: [19], icon: TrendingUp, color: "#0891b2" },
    { title: "Indirect Procurement Lead", desc: "Controls tail spend, curates catalogs, manages services procurement, and enforces T&E compliance", metrics: "Tail spend %, catalog coverage, maverick rate", domains: [18], icon: ShoppingCart, color: "#4f46e5" },
    { title: "Sourcing Specialist", desc: "Conducts supplier research, bid analysis, market intelligence gathering, and qualification support", metrics: "Supplier shortlists, market reports, qualification speed", domains: [12,13], icon: Search, color: "#7c3aed" },
  ],

  dayInLife: [
    {
      persona: "Category Manager",
      intro: "The Category Manager owns end-to-end category strategy — from spend analysis and supplier market research through sourcing events to ongoing supplier performance management.",
      blocks: [
        { time: "8:00", activity: "Manually pulling spend data from 3 systems (Ariba, Coupa, ERP) into Excel, reconciling supplier name variants to build a category view.", processes: ["Spend Analytics", "Category Strategy"], agentOpportunity: "Spend Cube Builder enriched overnight; Category Spend Dashboard open on arrival" },
        { time: "9:00", activity: "Responding to stakeholder emails asking 'why is this supplier on contract?' and 'can I buy from someone else?'", processes: ["Policy & Compliance", "Stakeholder Mgmt"], agentOpportunity: "Policy Assistant handles FAQ; Stakeholder Satisfaction Analyzer flags recurring friction" },
        { time: "10:00", activity: "Building a sourcing strategy deck from scratch for quarterly category review — pulling market data, supplier landscape, savings targets.", processes: ["Category Strategy", "Market Intelligence"], agentOpportunity: "Category Strategy Generator drafted strategy with savings targets, market context, risk profile" },
        { time: "11:00", activity: "Calling 4 colleagues across BUs to understand demand for an upcoming RFP — each BU has different specs for the same part.", processes: ["Demand Planning", "Spec Management"], agentOpportunity: "Demand Forecasting Agent aggregated BU signals; Spec Standardization identified consolidation" },
        { time: "1:00", activity: "Manually comparing 6 supplier bids in a spreadsheet with ad-hoc weighting criteria that change each time.", processes: ["Sourcing & Bidding", "Evaluation"], agentOpportunity: "Bid Evaluation Agent scored all bids on weighted criteria with Pareto frontier visualization" },
        { time: "2:30", activity: "Searching ThomasNet and LinkedIn for alternative suppliers — need to diversify away from single-source dependency.", processes: ["Supplier Discovery", "Risk Mitigation"], agentOpportunity: "Supplier Discovery Agent matched 12 qualified candidates with capability scores" },
        { time: "4:00", activity: "Writing a QBR deck for tomorrow's supplier business review — pulling scorecard data, open actions, market context.", processes: ["Supplier Performance", "Relationship Mgmt"], agentOpportunity: "Business Review Prep Agent assembled scorecard trends, action items, and market context into slides" },
      ]
    },
    {
      persona: "P2P Ops Manager",
      intro: "The P2P Operations Manager owns the requisition-to-payment process — driving touchless rates, resolving exceptions, and keeping the transactional engine running efficiently.",
      blocks: [
        { time: "8:00", activity: "Reviewing 47 stuck requisitions in approval queues — chasing approvers via email who haven't responded in 3+ days.", processes: ["Req Processing", "Approval Workflow"], agentOpportunity: "Smart Routing cleared 80% automatically; Approval Workflow Optimizer flagged 3 bottleneck approvers" },
        { time: "9:00", activity: "Investigating 12 three-way match exceptions from the overnight invoice batch — PO vs GR vs invoice discrepancies.", processes: ["Invoice Processing", "Exception Mgmt"], agentOpportunity: "Exception Handler auto-resolved 9 (qty tolerance, tax rounding); surfaced 3 genuine issues" },
        { time: "10:00", activity: "Manually keying invoice data from scanned PDFs into SAP — small suppliers who don't use EDI or portals.", processes: ["Invoice Processing", "Data Entry"], agentOpportunity: "Document AI extracted all fields; Invoice Agent validated against PO and vendor master" },
        { time: "11:00", activity: "Running a report to find duplicate payments before the afternoon payment run — checking amounts, dates, vendor patterns.", processes: ["Payment Processing", "Fraud Prevention"], agentOpportunity: "Duplicate Payment Detector already flagged 4 potential duplicates with confidence scores" },
        { time: "1:00", activity: "Fielding Slack messages from requesters asking 'where's my PO?' and 'when will this invoice be paid?'", processes: ["Service Delivery", "Stakeholder Support"], agentOpportunity: "Requisition Intake Agent provides real-time status; requesters self-serve via chat" },
        { time: "2:30", activity: "Compiling monthly P2P metrics manually for the operations review — touchless rate, cycle time, exception rate.", processes: ["P2P Analytics", "Reporting"], agentOpportunity: "P2P Cycle Time Analyzer auto-generates metrics; Looker dashboard refreshes daily" },
        { time: "4:00", activity: "Reviewing P-card statements — matching receipts, categorizing transactions, flagging policy violations.", processes: ["Card Program", "Compliance"], agentOpportunity: "P-Card Reconciliation Agent auto-categorized, matched receipts, flagged 6 policy exceptions" },
      ]
    },
    {
      persona: "Analytics Lead",
      intro: "The Procurement Analytics Lead transforms raw spend and operational data into actionable intelligence — building spend cubes, forecasting models, and executive reports.",
      blocks: [
        { time: "8:00", activity: "Running SQL queries to refresh the spend cube — fixing supplier name mismatches, reclassifying transactions that the taxonomy missed.", processes: ["Spend Analytics", "Data Quality"], agentOpportunity: "Spend Cube Builder ran overnight ETL; entity resolution cleaned 98% of supplier names" },
        { time: "9:00", activity: "Building a one-off report for the CPO on savings realization vs. target — manually reconciling pipeline data with actual PO prices.", processes: ["Savings Tracking", "Executive Reporting"], agentOpportunity: "Savings Realization Tracker auto-classifies and tracks; Value Reporter generates board deck" },
        { time: "10:00", activity: "Researching steel price trends on Platts — manually updating a forecast spreadsheet that feeds into budget planning.", processes: ["Commodity Intelligence", "Forecasting"], agentOpportunity: "Commodity Price Forecaster tracks 40+ indices with ML time-series, alerts on volatility" },
        { time: "11:00", activity: "Analyzing which categories have the most off-contract spend — pulling PO data and comparing against contract coverage.", processes: ["Spend Analytics", "Compliance"], agentOpportunity: "Maverick Spend Detector already classified root causes; Sourcing Channel Optimizer recommended fixes" },
        { time: "1:00", activity: "Preparing Hackett benchmark comparison slides for the CPO's leadership meeting — manually matching internal KPIs to peer data.", processes: ["Benchmarking", "Executive Reporting"], agentOpportunity: "Benchmark Intelligence Agent compared internal KPIs against Hackett/CAPS peers automatically" },
        { time: "2:30", activity: "Running 'what if we consolidate to 2 suppliers?' analysis in Excel — manually modeling cost, risk, and capacity scenarios.", processes: ["Scenario Modeling", "Strategy Support"], agentOpportunity: "What-If Simulator ran Monte Carlo across cost/risk/capacity scenarios in minutes" },
        { time: "4:00", activity: "Responding to ad-hoc data requests from category managers — 'how much did we spend with Supplier X last year?'", processes: ["Ad-Hoc Analytics", "Stakeholder Support"], agentOpportunity: "KPI Dashboard self-serves 80% of requests; Demand Pattern Analyzer surfaces insights proactively" },
      ]
    },
  ],

  raci: {
    personas: ["CPO","VP Procure","Cat Mgr","Sourcing Lead","Contract Mgr","P2P Ops Mgr","Buyer","Risk Analyst","SRM","Analytics","Indirect","Spec Sourcing"],
    matrix: [
      ["R","R","C","C","I","C","C","I","R"],
      ["R","R","C","C","I","C","R","C","R"],
      ["C","R","R","C","I","C","R","I","C"],
      ["C","R","R","R","I","I","C","I","C"],
      ["I","C","I","R","I","I","I","I","I"],
      ["I","I","I","I","R","I","I","C","C"],
      ["I","I","I","I","R","I","I","R","I"],
      ["I","I","C","I","I","R","C","I","C"],
      ["I","C","C","C","I","C","R","I","C"],
      ["C","C","I","I","C","C","C","I","R"],
      ["I","I","I","I","C","I","I","R","C"],
      ["I","R","R","I","I","I","I","I","I"],
    ],
  },

  techLandscape: {
    asIs: [
      { label: "Source-to-Pay", tools: "SAP Ariba, Coupa, Jaggaer" },
      { label: "ERP", tools: "SAP S/4HANA, Oracle EBS" },
      { label: "CLM", tools: "Icertis, DocuSign CLM, Agiloft" },
      { label: "Supplier Risk", tools: "D&B, RapidRatings, Resilinc" },
      { label: "Spend Analytics", tools: "SpendHQ, Sievo" },
      { label: "AP Automation", tools: "Basware, Kofax, Tungsten" },
      { label: "VMS / Services", tools: "SAP Fieldglass, Beeline" },
      { label: "Market Data", tools: "S&P Platts, ICIS, Mintec" },
      { label: "T&E", tools: "SAP Concur, Navan" },
    ],
    toBe: [
      { label: "Source Systems", description: "ERP, S2P, CLM, AP, VMS, Market Data — connected via APIs and EDI" },
      { label: "Gemini Enterprise Agent Layer", description: "78 autonomous agents across 9 domains — Plan → Source → Contract → Purchase → Pay → Manage → Analyze" },
      { label: "Unified Procurement Data Lake", description: "BigQuery — spend cube, supplier master, contract repository, market intelligence" },
      { label: "Insights & Actions", description: "Real-time dashboards, proactive alerts, automated workflows, executive reports" },
    ],
    painPoint: "Fragmented spend visibility, manual processes, disconnected risk monitoring",
    benefit: "Unified spend intelligence, autonomous P2P, real-time supply chain visibility",
  },

  integrationSystems: ["SAP Ariba", "Coupa", "SAP S/4HANA", "Icertis", "Basware", "D&B", "S&P Platts", "BigQuery"],
  externalAgents: ["SAP Ariba Agents", "Coupa Agents", "Icertis Agents"],
  transformationSteps: [
    { domain: "Strategic Sourcing", activity: "Evaluate supplier bids", asIs: "Manual spreadsheet comparison with ad-hoc weighting", toBe: "Bid Evaluation Agent scores all bids on weighted criteria with Pareto analysis", agentName: "Bid Evaluation", impact: "Evaluation time reduced 75%" },
    { domain: "Contract Lifecycle", activity: "Review contract redlines", asIs: "Legal reads every clause, 2-3 week cycle", toBe: "Clause Risk Analyzer identifies meaning-level changes and scores risk", agentName: "Clause Risk Analyzer", impact: "Contract cycle from 45 days to 12 days" },
    { domain: "Procure-to-Pay", activity: "Match invoices to POs", asIs: "Manual three-way match, 25-35% exception rate", toBe: "Exception Handler auto-resolves tolerance issues, surfaces genuine problems", agentName: "Three-Way Match", impact: "Exception rate reduced to 5-8%" },
    { domain: "Supplier Risk", activity: "Monitor supply chain disruptions", asIs: "Quarterly manual reviews, tier-1 only", toBe: "Disruption Monitor tracks multi-tier supply network continuously", agentName: "Disruption Monitor", impact: "From quarterly to real-time monitoring" },
  ],
};
