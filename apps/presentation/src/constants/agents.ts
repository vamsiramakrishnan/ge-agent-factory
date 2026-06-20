export type TriggerType = "event" | "chat" | "scheduled";

export interface AgentElement {
  id: string;
  agentId: string;
  shortName: string;
  domain: number;
  layer: 1 | 2 | 3 | 4;
  triggerType: TriggerType;
  hitl?: boolean;
  hitlActor?: string;
  hitlAction?: string;
}

export const TRIGGER_CONFIG = {
  event: { icon: "Zap", label: "Event-Driven", color: "text-teal-700", bg: "bg-teal-50 border-teal-200" },
  chat: { icon: "MessageCircle", label: "Chat-Initiated", color: "text-sky-700", bg: "bg-sky-50 border-sky-200" },
  scheduled: { icon: "Clock", label: "Scheduled", color: "text-amber-700", bg: "bg-amber-50 border-amber-200" },
} as const;

export const AGENTS: AgentElement[] = [
  // Domain 1
  { id: "uc-101", agentId: "A-101", shortName: "Scenario Modeling", domain: 1, layer: 3, triggerType: "scheduled" },
  { id: "uc-102", agentId: "A-102", shortName: "Market Intel", domain: 1, layer: 4, triggerType: "scheduled" },
  { id: "uc-103", agentId: "A-103", shortName: "Plan Drafter", domain: 1, layer: 1, triggerType: "chat" },
  { id: "uc-104", agentId: "A-104", shortName: "Org Analyzer", domain: 1, layer: 4, triggerType: "scheduled" },
  { id: "uc-105", agentId: "A-105", shortName: "Change Comms", domain: 1, layer: 1, triggerType: "event" },
  { id: "uc-106", agentId: "A-106", shortName: "Restructure Impact", domain: 1, layer: 3, triggerType: "event", hitl: true, hitlActor: "CHRO", hitlAction: "Approve impact plan" },
  { id: "uc-107", agentId: "A-107", shortName: "JD Optimizer", domain: 1, layer: 1, triggerType: "chat" },
  { id: "uc-108", agentId: "A-108", shortName: "Arch Sync", domain: 1, layer: 2, triggerType: "event" },
  // Domain 2
  { id: "uc-201", agentId: "A-201", shortName: "Req Intake", domain: 2, layer: 2, triggerType: "chat", hitl: true, hitlActor: "HRBP", hitlAction: "Validate requisition" },
  { id: "uc-202", agentId: "A-202", shortName: "Req Priority", domain: 2, layer: 4, triggerType: "scheduled" },
  { id: "uc-203", agentId: "A-203", shortName: "Sourcing", domain: 2, layer: 2, triggerType: "event" },
  { id: "uc-204", agentId: "A-204", shortName: "Resume Screen", domain: 2, layer: 3, triggerType: "event", hitl: true, hitlActor: "Recruiter", hitlAction: "Review shortlist" },
  { id: "uc-205", agentId: "A-205", shortName: "Channel Analytics", domain: 2, layer: 4, triggerType: "scheduled" },
  { id: "uc-206", agentId: "A-206", shortName: "Scorecard", domain: 2, layer: 1, triggerType: "chat" },
  { id: "uc-207", agentId: "A-207", shortName: "Interview Sched", domain: 2, layer: 2, triggerType: "event" },
  { id: "uc-208", agentId: "A-208", shortName: "Debrief", domain: 2, layer: 1, triggerType: "event" },
  { id: "uc-209", agentId: "A-209", shortName: "Offer Modeler", domain: 2, layer: 3, triggerType: "event", hitl: true, hitlActor: "Comp Manager", hitlAction: "Approve offer" },
  { id: "uc-210", agentId: "A-210", shortName: "Pre-boarding", domain: 2, layer: 2, triggerType: "event" },
  { id: "uc-211", agentId: "A-211", shortName: "Onboarding", domain: 2, layer: 2, triggerType: "event" },
  { id: "uc-212", agentId: "A-212", shortName: "New Hire Q&A", domain: 2, layer: 1, triggerType: "chat" },
  { id: "uc-213", agentId: "A-213", shortName: "Onboard Analytics", domain: 2, layer: 4, triggerType: "scheduled" },
  // Domain 3
  { id: "uc-301", agentId: "A-301", shortName: "Goal Drafting", domain: 3, layer: 1, triggerType: "chat" },
  { id: "uc-302", agentId: "A-302", shortName: "OKR Tracker", domain: 3, layer: 2, triggerType: "scheduled" },
  { id: "uc-303", agentId: "A-303", shortName: "1:1 Prep", domain: 3, layer: 2, triggerType: "scheduled" },
  { id: "uc-304", agentId: "A-304", shortName: "Feedback Trends", domain: 3, layer: 4, triggerType: "scheduled" },
  { id: "uc-305", agentId: "A-305", shortName: "Perf Narrative", domain: 3, layer: 1, triggerType: "event", hitl: true, hitlActor: "Manager", hitlAction: "Review & edit narrative" },
  { id: "uc-306", agentId: "A-306", shortName: "Calibration", domain: 3, layer: 4, triggerType: "event" },
  { id: "uc-307", agentId: "A-307", shortName: "Review Orch", domain: 3, layer: 2, triggerType: "scheduled" },
  { id: "uc-308", agentId: "A-308", shortName: "Successor", domain: 3, layer: 3, triggerType: "scheduled", hitl: true, hitlActor: "CHRO", hitlAction: "Validate succession map" },
  { id: "uc-309", agentId: "A-309", shortName: "Succession Pipe", domain: 3, layer: 4, triggerType: "scheduled" },
  { id: "uc-310", agentId: "A-310", shortName: "HiPo ID", domain: 3, layer: 3, triggerType: "scheduled", hitl: true, hitlActor: "CHRO", hitlAction: "Approve HiPo nominations" },
  { id: "uc-311", agentId: "A-311", shortName: "HiPo Journey", domain: 3, layer: 2, triggerType: "event" },
  // Domain 4
  { id: "uc-401", agentId: "A-401", shortName: "Benchmarking", domain: 4, layer: 4, triggerType: "scheduled" },
  { id: "uc-402", agentId: "A-402", shortName: "Comp Philosophy", domain: 4, layer: 1, triggerType: "chat" },
  { id: "uc-403", agentId: "A-403", shortName: "Merit Modeler", domain: 4, layer: 3, triggerType: "scheduled", hitl: true, hitlActor: "Comp Manager", hitlAction: "Approve merit budgets" },
  { id: "uc-404", agentId: "A-404", shortName: "Pay Equity", domain: 4, layer: 3, triggerType: "scheduled", hitl: true, hitlActor: "CHRO", hitlAction: "Approve remediation plan" },
  { id: "uc-405", agentId: "A-405", shortName: "Comp Letters", domain: 4, layer: 1, triggerType: "event" },
  { id: "uc-406", agentId: "A-406", shortName: "Benefits Q&A", domain: 4, layer: 1, triggerType: "chat" },
  { id: "uc-407", agentId: "A-407", shortName: "Benefits Analytics", domain: 4, layer: 4, triggerType: "scheduled" },
  { id: "uc-408", agentId: "A-408", shortName: "Rewards Opt", domain: 4, layer: 3, triggerType: "event", hitl: true, hitlActor: "Comp Manager", hitlAction: "Approve rewards package" },
  { id: "uc-409", agentId: "A-409", shortName: "Equity Comms", domain: 4, layer: 1, triggerType: "event" },
  // Domain 5
  { id: "uc-501", agentId: "A-501", shortName: "Skills Gap", domain: 5, layer: 3, triggerType: "scheduled" },
  { id: "uc-502", agentId: "A-502", shortName: "L&D Drafter", domain: 5, layer: 1, triggerType: "chat" },
  { id: "uc-503", agentId: "A-503", shortName: "Content Summ", domain: 5, layer: 1, triggerType: "chat" },
  { id: "uc-504", agentId: "A-504", shortName: "Learning Paths", domain: 5, layer: 2, triggerType: "chat" },
  { id: "uc-505", agentId: "A-505", shortName: "Compliance Gen", domain: 5, layer: 1, triggerType: "event" },
  { id: "uc-506", agentId: "A-506", shortName: "Compliance Track", domain: 5, layer: 2, triggerType: "scheduled" },
  { id: "uc-507", agentId: "A-507", shortName: "Leadership", domain: 5, layer: 1, triggerType: "chat" },
  { id: "uc-508", agentId: "A-508", shortName: "Program Impact", domain: 5, layer: 4, triggerType: "scheduled" },
  // Domain 6
  { id: "uc-601", agentId: "A-601", shortName: "ER Case Intel", domain: 6, layer: 3, triggerType: "event", hitl: true, hitlActor: "ER Lead", hitlAction: "Review investigation findings" },
  { id: "uc-602", agentId: "A-602", shortName: "Case Analytics", domain: 6, layer: 4, triggerType: "scheduled" },
  { id: "uc-603", agentId: "A-603", shortName: "PIP Docs", domain: 6, layer: 1, triggerType: "event", hitl: true, hitlActor: "Manager", hitlAction: "Review PIP document" },
  { id: "uc-604", agentId: "A-604", shortName: "Discipline", domain: 6, layer: 2, triggerType: "event", hitl: true, hitlActor: "HRBP", hitlAction: "Approve discipline action" },
  { id: "uc-605", agentId: "A-605", shortName: "Policy Q&A", domain: 6, layer: 1, triggerType: "chat" },
  { id: "uc-606", agentId: "A-606", shortName: "Policy Draft", domain: 6, layer: 1, triggerType: "chat" },
  { id: "uc-607", agentId: "A-607", shortName: "Leave Intake", domain: 6, layer: 2, triggerType: "chat" },
  { id: "uc-608", agentId: "A-608", shortName: "Leave Analytics", domain: 6, layer: 4, triggerType: "scheduled" },
  // Domain 7
  { id: "uc-701", agentId: "A-701", shortName: "Survey Design", domain: 7, layer: 2, triggerType: "scheduled" },
  { id: "uc-702", agentId: "A-702", shortName: "Engagement", domain: 7, layer: 3, triggerType: "event" },
  { id: "uc-703", agentId: "A-703", shortName: "Outcome Corr", domain: 7, layer: 4, triggerType: "scheduled" },
  { id: "uc-704", agentId: "A-704", shortName: "Recog Analytics", domain: 7, layer: 4, triggerType: "scheduled" },
  { id: "uc-705", agentId: "A-705", shortName: "Recog Nudge", domain: 7, layer: 2, triggerType: "event" },
  { id: "uc-706", agentId: "A-706", shortName: "Comms Drafter", domain: 7, layer: 1, triggerType: "chat" },
  { id: "uc-707", agentId: "A-707", shortName: "Comms Sentiment", domain: 7, layer: 4, triggerType: "scheduled" },
  // Domain 8
  { id: "uc-801", agentId: "A-801", shortName: "Data Quality", domain: 8, layer: 2, triggerType: "scheduled" },
  { id: "uc-802", agentId: "A-802", shortName: "Data Orch", domain: 8, layer: 2, triggerType: "event" },
  { id: "uc-803", agentId: "A-803", shortName: "Query Resolve", domain: 8, layer: 2, triggerType: "chat" },
  { id: "uc-804", agentId: "A-804", shortName: "Service Analytics", domain: 8, layer: 4, triggerType: "scheduled" },
  { id: "uc-805", agentId: "A-805", shortName: "Payroll Valid", domain: 8, layer: 3, triggerType: "scheduled", hitl: true, hitlActor: "Payroll Manager", hitlAction: "Approve payroll run" },
  { id: "uc-806", agentId: "A-806", shortName: "Payroll Recon", domain: 8, layer: 3, triggerType: "scheduled", hitl: true, hitlActor: "Payroll Manager", hitlAction: "Sign off reconciliation" },
  { id: "uc-807", agentId: "A-807", shortName: "Offboarding", domain: 8, layer: 2, triggerType: "event" },
  { id: "uc-808", agentId: "A-808", shortName: "Exit Insights", domain: 8, layer: 1, triggerType: "scheduled" },
  { id: "uc-809", agentId: "A-809", shortName: "Attrition Analytics", domain: 8, layer: 4, triggerType: "scheduled" },
  // Domain 9
  { id: "uc-901", agentId: "A-901", shortName: "DEI Dashboard", domain: 9, layer: 4, triggerType: "scheduled" },
  { id: "uc-902", agentId: "A-902", shortName: "Inclusive Hiring", domain: 9, layer: 4, triggerType: "scheduled", hitl: true, hitlActor: "TA Lead", hitlAction: "Review hiring equity data" },
  { id: "uc-903", agentId: "A-903", shortName: "DEI Programs", domain: 9, layer: 1, triggerType: "chat" },
  { id: "uc-904", agentId: "A-904", shortName: "ERG Impact", domain: 9, layer: 4, triggerType: "scheduled" },
  // Domain 10
  { id: "uc-1001", agentId: "A-1001", shortName: "Data Lake", domain: 10, layer: 4, triggerType: "chat" },
  { id: "uc-1002", agentId: "A-1002", shortName: "Attrition Pred", domain: 10, layer: 3, triggerType: "scheduled", hitl: true, hitlActor: "HRBP", hitlAction: "Review risk scores & intervene" },
  { id: "uc-1003", agentId: "A-1003", shortName: "Cost Modeling", domain: 10, layer: 3, triggerType: "chat" },
  { id: "uc-1004", agentId: "A-1004", shortName: "Tech Intel", domain: 10, layer: 2, triggerType: "scheduled" },
  { id: "uc-1005", agentId: "A-1005", shortName: "Vendor Eval", domain: 10, layer: 1, triggerType: "chat" },

  // ═══════════════════════════════════════════════
  // PROCUREMENT DOMAINS (11-19)
  // ═══════════════════════════════════════════════

  // Domain 11 - Procurement Strategy & Demand Planning
  { id: "uc-1101", agentId: "A-1101", shortName: "Category Strategy", domain: 11, layer: 3, triggerType: "scheduled", hitl: true, hitlActor: "Category Director", hitlAction: "Approve category strategy" },
  { id: "uc-1102", agentId: "A-1102", shortName: "Demand Forecast", domain: 11, layer: 4, triggerType: "scheduled" },
  { id: "uc-1103", agentId: "A-1103", shortName: "Make vs Buy", domain: 11, layer: 3, triggerType: "event", hitl: true, hitlActor: "CPO", hitlAction: "Approve make-vs-buy decision" },
  { id: "uc-1104", agentId: "A-1104", shortName: "Policy Assistant", domain: 11, layer: 1, triggerType: "chat" },
  { id: "uc-1105", agentId: "A-1105", shortName: "Savings Pipeline", domain: 11, layer: 4, triggerType: "scheduled" },
  { id: "uc-1106", agentId: "A-1106", shortName: "Maturity Assess", domain: 11, layer: 3, triggerType: "scheduled", hitl: true, hitlActor: "CPO", hitlAction: "Review maturity assessment" },
  { id: "uc-1107", agentId: "A-1107", shortName: "Stakeholder CSAT", domain: 11, layer: 4, triggerType: "scheduled" },

  // Domain 12 - Strategic Sourcing & Category Management
  { id: "uc-1201", agentId: "A-1201", shortName: "Spend Classify", domain: 12, layer: 4, triggerType: "scheduled" },
  { id: "uc-1202", agentId: "A-1202", shortName: "Market Intel", domain: 12, layer: 3, triggerType: "scheduled" },
  { id: "uc-1203", agentId: "A-1203", shortName: "Should-Cost", domain: 12, layer: 3, triggerType: "event", hitl: true, hitlActor: "Category Manager", hitlAction: "Review should-cost model" },
  { id: "uc-1204", agentId: "A-1204", shortName: "RFx Builder", domain: 12, layer: 3, triggerType: "event", hitl: true, hitlActor: "Sourcing Lead", hitlAction: "Approve RFx package" },
  { id: "uc-1205", agentId: "A-1205", shortName: "Bid Evaluation", domain: 12, layer: 3, triggerType: "event", hitl: true, hitlActor: "Sourcing Committee", hitlAction: "Award decision" },
  { id: "uc-1206", agentId: "A-1206", shortName: "Auction Advisor", domain: 12, layer: 3, triggerType: "event" },
  { id: "uc-1207", agentId: "A-1207", shortName: "Negotiation Prep", domain: 12, layer: 3, triggerType: "event" },
  { id: "uc-1208", agentId: "A-1208", shortName: "Category Spend", domain: 12, layer: 4, triggerType: "scheduled" },
  { id: "uc-1209", agentId: "A-1209", shortName: "Sole Source", domain: 12, layer: 1, triggerType: "event", hitl: true, hitlActor: "CPO", hitlAction: "Approve sole source justification" },
  { id: "uc-1210", agentId: "A-1210", shortName: "Category Roadmap", domain: 12, layer: 3, triggerType: "scheduled", hitl: true, hitlActor: "Category Director", hitlAction: "Approve roadmap" },
  { id: "uc-1211", agentId: "A-1211", shortName: "Spec Standard", domain: 12, layer: 3, triggerType: "scheduled", hitl: true, hitlActor: "Engineering", hitlAction: "Validate spec consolidation" },
  { id: "uc-1212", agentId: "A-1212", shortName: "Channel Optimizer", domain: 12, layer: 4, triggerType: "scheduled" },

  // Domain 13 - Supplier Discovery & Qualification
  { id: "uc-1301", agentId: "A-1301", shortName: "Discovery Match", domain: 13, layer: 3, triggerType: "event" },
  { id: "uc-1302", agentId: "A-1302", shortName: "Pre-Qual Screen", domain: 13, layer: 3, triggerType: "event", hitl: true, hitlActor: "Sourcing Lead", hitlAction: "Review qualification" },
  { id: "uc-1303", agentId: "A-1303", shortName: "Financial Health", domain: 13, layer: 4, triggerType: "scheduled" },
  { id: "uc-1304", agentId: "A-1304", shortName: "Diversity Track", domain: 13, layer: 4, triggerType: "scheduled" },
  { id: "uc-1305", agentId: "A-1305", shortName: "Onboard Orch", domain: 13, layer: 2, triggerType: "event" },
  { id: "uc-1306", agentId: "A-1306", shortName: "Capability Assess", domain: 13, layer: 3, triggerType: "event" },
  { id: "uc-1307", agentId: "A-1307", shortName: "Consolidation", domain: 13, layer: 4, triggerType: "scheduled", hitl: true, hitlActor: "Category Manager", hitlAction: "Approve consolidation plan" },
  { id: "uc-1308", agentId: "A-1308", shortName: "Sanctions Screen", domain: 13, layer: 3, triggerType: "event", hitl: true, hitlActor: "Compliance", hitlAction: "Review screening results" },

  // Domain 14 - Contract Lifecycle Management
  { id: "uc-1401", agentId: "A-1401", shortName: "Contract Author", domain: 14, layer: 3, triggerType: "event", hitl: true, hitlActor: "Legal", hitlAction: "Review contract draft" },
  { id: "uc-1402", agentId: "A-1402", shortName: "Clause Risk", domain: 14, layer: 3, triggerType: "event", hitl: true, hitlActor: "Legal Counsel", hitlAction: "Review risk assessment" },
  { id: "uc-1403", agentId: "A-1403", shortName: "Obligation Mine", domain: 14, layer: 3, triggerType: "event" },
  { id: "uc-1404", agentId: "A-1404", shortName: "Renewal Monitor", domain: 14, layer: 2, triggerType: "scheduled", hitl: true, hitlActor: "Contract Manager", hitlAction: "Decide renewal action" },
  { id: "uc-1405", agentId: "A-1405", shortName: "Redline Compare", domain: 14, layer: 3, triggerType: "event" },
  { id: "uc-1406", agentId: "A-1406", shortName: "Compliance Audit", domain: 14, layer: 4, triggerType: "scheduled" },
  { id: "uc-1407", agentId: "A-1407", shortName: "Agreement Graph", domain: 14, layer: 4, triggerType: "event" },
  { id: "uc-1408", agentId: "A-1408", shortName: "Contract Dash", domain: 14, layer: 4, triggerType: "scheduled" },
  { id: "uc-1409", agentId: "A-1409", shortName: "FM Advisor", domain: 14, layer: 3, triggerType: "chat", hitl: true, hitlActor: "Legal + CPO", hitlAction: "Approve termination strategy" },

  // Domain 15 - Procure-to-Pay Operations
  { id: "uc-1501", agentId: "A-1501", shortName: "Req Routing", domain: 15, layer: 2, triggerType: "event" },
  { id: "uc-1502", agentId: "A-1502", shortName: "PO Auto-Gen", domain: 15, layer: 2, triggerType: "event" },
  { id: "uc-1503", agentId: "A-1503", shortName: "3-Way Match", domain: 15, layer: 3, triggerType: "event", hitl: true, hitlActor: "AP Manager", hitlAction: "Approve exception above threshold" },
  { id: "uc-1504", agentId: "A-1504", shortName: "Invoice Extract", domain: 15, layer: 3, triggerType: "event" },
  { id: "uc-1505", agentId: "A-1505", shortName: "Dup Payment", domain: 15, layer: 4, triggerType: "scheduled", hitl: true, hitlActor: "AP Manager", hitlAction: "Confirm duplicate flags" },
  { id: "uc-1506", agentId: "A-1506", shortName: "Maverick Nudge", domain: 15, layer: 3, triggerType: "event" },
  { id: "uc-1507", agentId: "A-1507", shortName: "Payment Optimize", domain: 15, layer: 4, triggerType: "scheduled", hitl: true, hitlActor: "Treasury", hitlAction: "Approve payment strategy" },
  { id: "uc-1508", agentId: "A-1508", shortName: "GR Validator", domain: 15, layer: 2, triggerType: "event" },
  { id: "uc-1509", agentId: "A-1509", shortName: "P2P Cycle Time", domain: 15, layer: 4, triggerType: "scheduled" },
  { id: "uc-1510", agentId: "A-1510", shortName: "Approval Opt", domain: 15, layer: 4, triggerType: "scheduled", hitl: true, hitlActor: "P2P Ops Manager", hitlAction: "Approve workflow changes" },
  { id: "uc-1511", agentId: "A-1511", shortName: "P-Card Recon", domain: 15, layer: 2, triggerType: "event" },

  // Domain 16 - Supplier Risk & Compliance
  { id: "uc-1601", agentId: "A-1601", shortName: "Risk Scoring", domain: 16, layer: 4, triggerType: "scheduled" },
  { id: "uc-1602", agentId: "A-1602", shortName: "Disruption Mon", domain: 16, layer: 3, triggerType: "scheduled" },
  { id: "uc-1603", agentId: "A-1603", shortName: "Sanctions Watch", domain: 16, layer: 3, triggerType: "event", hitl: true, hitlActor: "Compliance Manager", hitlAction: "Review sanctions matches" },
  { id: "uc-1604", agentId: "A-1604", shortName: "Reg Compliance", domain: 16, layer: 3, triggerType: "scheduled", hitl: true, hitlActor: "Compliance Manager", hitlAction: "Review regulatory gaps" },
  { id: "uc-1605", agentId: "A-1605", shortName: "Sub-Tier Map", domain: 16, layer: 3, triggerType: "scheduled", hitl: true, hitlActor: "Supply Chain Lead", hitlAction: "Review sub-tier findings" },
  { id: "uc-1606", agentId: "A-1606", shortName: "Audit Tracker", domain: 16, layer: 2, triggerType: "event" },
  { id: "uc-1607", agentId: "A-1607", shortName: "Concentration", domain: 16, layer: 4, triggerType: "scheduled", hitl: true, hitlActor: "CPO", hitlAction: "Review concentration risks" },
  { id: "uc-1608", agentId: "A-1608", shortName: "Insurance Mon", domain: 16, layer: 2, triggerType: "scheduled" },

  // Domain 17 - Supplier Performance & Relationship Management
  { id: "uc-1701", agentId: "A-1701", shortName: "Scorecard Gen", domain: 17, layer: 4, triggerType: "scheduled" },
  { id: "uc-1702", agentId: "A-1702", shortName: "Quality Analyze", domain: 17, layer: 3, triggerType: "event" },
  { id: "uc-1703", agentId: "A-1703", shortName: "Delivery Perf", domain: 17, layer: 4, triggerType: "scheduled" },
  { id: "uc-1704", agentId: "A-1704", shortName: "QBR Prep", domain: 17, layer: 1, triggerType: "scheduled" },
  { id: "uc-1705", agentId: "A-1705", shortName: "Supplier Dev", domain: 17, layer: 3, triggerType: "event", hitl: true, hitlActor: "Category Manager", hitlAction: "Approve development plan" },
  { id: "uc-1706", agentId: "A-1706", shortName: "Relationship Health", domain: 17, layer: 3, triggerType: "scheduled" },
  { id: "uc-1707", agentId: "A-1707", shortName: "Innovation Track", domain: 17, layer: 3, triggerType: "event", hitl: true, hitlActor: "Category Manager", hitlAction: "Evaluate innovation proposal" },

  // Domain 18 - Indirect & Tail Spend Management
  { id: "uc-1801", agentId: "A-1801", shortName: "Tail Spend", domain: 18, layer: 4, triggerType: "scheduled" },
  { id: "uc-1802", agentId: "A-1802", shortName: "Catalog Curate", domain: 18, layer: 2, triggerType: "event" },
  { id: "uc-1803", agentId: "A-1803", shortName: "Spot Buy", domain: 18, layer: 3, triggerType: "event", hitl: true, hitlActor: "Buyer", hitlAction: "Approve spot buy above threshold" },
  { id: "uc-1804", agentId: "A-1804", shortName: "MRO Optimize", domain: 18, layer: 4, triggerType: "scheduled" },
  { id: "uc-1805", agentId: "A-1805", shortName: "T&E Compliance", domain: 18, layer: 2, triggerType: "event" },
  { id: "uc-1806", agentId: "A-1806", shortName: "SOW Manager", domain: 18, layer: 3, triggerType: "event", hitl: true, hitlActor: "Procurement Lead", hitlAction: "Review scope change" },

  // Domain 19 - Spend Analytics & Procurement Intelligence
  { id: "uc-1901", agentId: "A-1901", shortName: "Spend Cube", domain: 19, layer: 4, triggerType: "scheduled" },
  { id: "uc-1902", agentId: "A-1902", shortName: "Savings Track", domain: 19, layer: 4, triggerType: "scheduled" },
  { id: "uc-1903", agentId: "A-1903", shortName: "Commodity Price", domain: 19, layer: 4, triggerType: "scheduled" },
  { id: "uc-1904", agentId: "A-1904", shortName: "Procurement KPI", domain: 19, layer: 4, triggerType: "scheduled" },
  { id: "uc-1905", agentId: "A-1905", shortName: "TCO Modeler", domain: 19, layer: 3, triggerType: "event", hitl: true, hitlActor: "Category Manager", hitlAction: "Validate TCO assumptions" },
  { id: "uc-1906", agentId: "A-1906", shortName: "Value Reporter", domain: 19, layer: 1, triggerType: "scheduled", hitl: true, hitlActor: "CPO", hitlAction: "Review executive report" },
  { id: "uc-1907", agentId: "A-1907", shortName: "Price Variance", domain: 19, layer: 4, triggerType: "scheduled" },
  { id: "uc-1908", agentId: "A-1908", shortName: "Demand Pattern", domain: 19, layer: 4, triggerType: "scheduled" },
  { id: "uc-1909", agentId: "A-1909", shortName: "Benchmark Intel", domain: 19, layer: 3, triggerType: "chat" },
  { id: "uc-1910", agentId: "A-1910", shortName: "What-If Sim", domain: 19, layer: 3, triggerType: "chat" },

  // ═══════════════════════════════════════════════
  // FINANCE DOMAINS (20-28)
  // ═══════════════════════════════════════════════

  // Domain 20 - FP&A (9 agents)
  { id: "uc-2001", agentId: "A-2001", shortName: "Budget Builder", domain: 20, layer: 3, triggerType: "scheduled", hitl: true, hitlActor: "CFO", hitlAction: "Approve consolidated budget" },
  { id: "uc-2002", agentId: "A-2002", shortName: "Rolling Forecast", domain: 20, layer: 4, triggerType: "scheduled" },
  { id: "uc-2003", agentId: "A-2003", shortName: "Variance Analysis", domain: 20, layer: 4, triggerType: "scheduled" },
  { id: "uc-2004", agentId: "A-2004", shortName: "Scenario Model", domain: 20, layer: 3, triggerType: "chat" },
  { id: "uc-2005", agentId: "A-2005", shortName: "CapEx Analyzer", domain: 20, layer: 3, triggerType: "event", hitl: true, hitlActor: "CFO", hitlAction: "Approve CapEx investment" },
  { id: "uc-2006", agentId: "A-2006", shortName: "Headcount Plan", domain: 20, layer: 3, triggerType: "scheduled" },
  { id: "uc-2007", agentId: "A-2007", shortName: "Revenue Forecast", domain: 20, layer: 4, triggerType: "scheduled" },
  { id: "uc-2008", agentId: "A-2008", shortName: "Board Deck Gen", domain: 20, layer: 1, triggerType: "scheduled", hitl: true, hitlActor: "CFO", hitlAction: "Review board presentation" },
  { id: "uc-2009", agentId: "A-2009", shortName: "FP&A Assistant", domain: 20, layer: 1, triggerType: "chat" },

  // Domain 21 - General Ledger & Close (8 agents)
  { id: "uc-2101", agentId: "A-2101", shortName: "JE Auto-Post", domain: 21, layer: 2, triggerType: "event" },
  { id: "uc-2102", agentId: "A-2102", shortName: "IC Recon", domain: 21, layer: 3, triggerType: "scheduled" },
  { id: "uc-2103", agentId: "A-2103", shortName: "Acct Recon", domain: 21, layer: 3, triggerType: "scheduled", hitl: true, hitlActor: "Controller", hitlAction: "Review material reconciliations" },
  { id: "uc-2104", agentId: "A-2104", shortName: "Close Orchestr", domain: 21, layer: 2, triggerType: "scheduled" },
  { id: "uc-2105", agentId: "A-2105", shortName: "Accruals Engine", domain: 21, layer: 3, triggerType: "scheduled" },
  { id: "uc-2106", agentId: "A-2106", shortName: "TB Validator", domain: 21, layer: 4, triggerType: "scheduled" },
  { id: "uc-2107", agentId: "A-2107", shortName: "Close Analytics", domain: 21, layer: 4, triggerType: "scheduled" },
  { id: "uc-2108", agentId: "A-2108", shortName: "GL Anomaly", domain: 21, layer: 4, triggerType: "scheduled" },

  // Domain 22 - Accounts Payable (7 agents)
  { id: "uc-2201", agentId: "A-2201", shortName: "Invoice Process", domain: 22, layer: 3, triggerType: "event" },
  { id: "uc-2202", agentId: "A-2202", shortName: "Payment Optimize", domain: 22, layer: 4, triggerType: "scheduled", hitl: true, hitlActor: "Treasury", hitlAction: "Approve payment strategy" },
  { id: "uc-2203", agentId: "A-2203", shortName: "Dup Invoice", domain: 22, layer: 4, triggerType: "scheduled", hitl: true, hitlActor: "AP Manager", hitlAction: "Confirm duplicate flags" },
  { id: "uc-2204", agentId: "A-2204", shortName: "AP Aging", domain: 22, layer: 4, triggerType: "scheduled" },
  { id: "uc-2205", agentId: "A-2205", shortName: "Vendor Master", domain: 22, layer: 2, triggerType: "event" },
  { id: "uc-2206", agentId: "A-2206", shortName: "Early Pay Disc", domain: 22, layer: 3, triggerType: "scheduled" },
  { id: "uc-2207", agentId: "A-2207", shortName: "AP Compliance", domain: 22, layer: 3, triggerType: "scheduled" },

  // Domain 23 - Accounts Receivable & Collections (7 agents)
  { id: "uc-2301", agentId: "A-2301", shortName: "Cash Applicatn", domain: 23, layer: 3, triggerType: "event" },
  { id: "uc-2302", agentId: "A-2302", shortName: "Collections", domain: 23, layer: 4, triggerType: "scheduled" },
  { id: "uc-2303", agentId: "A-2303", shortName: "Dunning Draft", domain: 23, layer: 1, triggerType: "event" },
  { id: "uc-2304", agentId: "A-2304", shortName: "Credit Risk", domain: 23, layer: 4, triggerType: "event", hitl: true, hitlActor: "Credit Manager", hitlAction: "Approve credit limit change" },
  { id: "uc-2305", agentId: "A-2305", shortName: "AR Aging / DSO", domain: 23, layer: 4, triggerType: "scheduled" },
  { id: "uc-2306", agentId: "A-2306", shortName: "Dispute Resolve", domain: 23, layer: 3, triggerType: "event" },
  { id: "uc-2307", agentId: "A-2307", shortName: "Payment Predict", domain: 23, layer: 4, triggerType: "scheduled" },

  // Domain 24 - Treasury & Cash Management (7 agents)
  { id: "uc-2401", agentId: "A-2401", shortName: "Cash Forecast", domain: 24, layer: 4, triggerType: "scheduled" },
  { id: "uc-2402", agentId: "A-2402", shortName: "Bank Recon", domain: 24, layer: 3, triggerType: "scheduled" },
  { id: "uc-2403", agentId: "A-2403", shortName: "FX Exposure", domain: 24, layer: 4, triggerType: "scheduled" },
  { id: "uc-2404", agentId: "A-2404", shortName: "Investment Opt", domain: 24, layer: 3, triggerType: "scheduled", hitl: true, hitlActor: "Treasurer", hitlAction: "Approve portfolio rebalancing" },
  { id: "uc-2405", agentId: "A-2405", shortName: "Debt Covenant", domain: 24, layer: 3, triggerType: "scheduled" },
  { id: "uc-2406", agentId: "A-2406", shortName: "IC Netting", domain: 24, layer: 3, triggerType: "scheduled" },
  { id: "uc-2407", agentId: "A-2407", shortName: "Liquidity Dash", domain: 24, layer: 4, triggerType: "scheduled" },

  // Domain 25 - Tax & Regulatory Compliance (8 agents)
  { id: "uc-2501", agentId: "A-2501", shortName: "Tax Provision", domain: 25, layer: 3, triggerType: "scheduled", hitl: true, hitlActor: "Tax Director", hitlAction: "Approve tax provision" },
  { id: "uc-2502", agentId: "A-2502", shortName: "Transfer Price", domain: 25, layer: 4, triggerType: "scheduled" },
  { id: "uc-2503", agentId: "A-2503", shortName: "Sales Tax Auto", domain: 25, layer: 2, triggerType: "event" },
  { id: "uc-2504", agentId: "A-2504", shortName: "Filing Orchestr", domain: 25, layer: 2, triggerType: "scheduled", hitl: true, hitlActor: "Controller", hitlAction: "Approve filing submission" },
  { id: "uc-2505", agentId: "A-2505", shortName: "Tax Research", domain: 25, layer: 1, triggerType: "chat" },
  { id: "uc-2506", agentId: "A-2506", shortName: "Withholding Tax", domain: 25, layer: 2, triggerType: "event" },
  { id: "uc-2507", agentId: "A-2507", shortName: "Tax Audit Prep", domain: 25, layer: 3, triggerType: "event" },
  { id: "uc-2508", agentId: "A-2508", shortName: "Reg Change Mon", domain: 25, layer: 3, triggerType: "scheduled" },

  // Domain 26 - Internal Audit & Controls (7 agents)
  { id: "uc-2601", agentId: "A-2601", shortName: "SOX Testing", domain: 26, layer: 3, triggerType: "scheduled", hitl: true, hitlActor: "Internal Audit Lead", hitlAction: "Approve control assessment" },
  { id: "uc-2602", agentId: "A-2602", shortName: "Controls Monitor", domain: 26, layer: 4, triggerType: "scheduled" },
  { id: "uc-2603", agentId: "A-2603", shortName: "Finding Tracker", domain: 26, layer: 2, triggerType: "event" },
  { id: "uc-2604", agentId: "A-2604", shortName: "Risk Assessment", domain: 26, layer: 3, triggerType: "scheduled", hitl: true, hitlActor: "CAE", hitlAction: "Approve risk ratings" },
  { id: "uc-2605", agentId: "A-2605", shortName: "Policy Scanner", domain: 26, layer: 3, triggerType: "scheduled" },
  { id: "uc-2606", agentId: "A-2606", shortName: "Fraud Detect", domain: 26, layer: 4, triggerType: "scheduled" },
  { id: "uc-2607", agentId: "A-2607", shortName: "Audit Report", domain: 26, layer: 1, triggerType: "scheduled", hitl: true, hitlActor: "CAE", hitlAction: "Approve audit report" },

  // Domain 27 - Revenue & Cost Accounting (7 agents)
  { id: "uc-2701", agentId: "A-2701", shortName: "Rev Recognition", domain: 27, layer: 3, triggerType: "event", hitl: true, hitlActor: "Controller", hitlAction: "Approve revenue treatment" },
  { id: "uc-2702", agentId: "A-2702", shortName: "Cost Allocation", domain: 27, layer: 3, triggerType: "scheduled" },
  { id: "uc-2703", agentId: "A-2703", shortName: "Product Profit", domain: 27, layer: 4, triggerType: "scheduled" },
  { id: "uc-2704", agentId: "A-2704", shortName: "Std Cost Var", domain: 27, layer: 4, triggerType: "scheduled" },
  { id: "uc-2705", agentId: "A-2705", shortName: "ASC 606 Analyze", domain: 27, layer: 3, triggerType: "event" },
  { id: "uc-2706", agentId: "A-2706", shortName: "Inventory Value", domain: 27, layer: 3, triggerType: "scheduled" },
  { id: "uc-2707", agentId: "A-2707", shortName: "COGS Recon", domain: 27, layer: 3, triggerType: "scheduled" },

  // Domain 28 - Finance Analytics & Reporting (8 agents)
  { id: "uc-2801", agentId: "A-2801", shortName: "Fin Stmt Gen", domain: 28, layer: 1, triggerType: "scheduled" },
  { id: "uc-2802", agentId: "A-2802", shortName: "Mgmt Reporting", domain: 28, layer: 1, triggerType: "scheduled" },
  { id: "uc-2803", agentId: "A-2803", shortName: "KPI Dashboard", domain: 28, layer: 4, triggerType: "scheduled" },
  { id: "uc-2804", agentId: "A-2804", shortName: "Ad-Hoc Query", domain: 28, layer: 4, triggerType: "chat" },
  { id: "uc-2805", agentId: "A-2805", shortName: "Peer Benchmark", domain: 28, layer: 3, triggerType: "chat" },
  { id: "uc-2806", agentId: "A-2806", shortName: "Consolidation", domain: 28, layer: 3, triggerType: "scheduled" },
  { id: "uc-2807", agentId: "A-2807", shortName: "ESG Reporter", domain: 28, layer: 3, triggerType: "scheduled", hitl: true, hitlActor: "CFO", hitlAction: "Approve ESG disclosures" },
  { id: "uc-2808", agentId: "A-2808", shortName: "IR Prep", domain: 28, layer: 1, triggerType: "scheduled", hitl: true, hitlActor: "CFO", hitlAction: "Review earnings materials" },

  // ═══════════════════════════════════════════════
  // MARKETING DOMAINS (29-37)
  // ═══════════════════════════════════════════════

  // Domain 29 - Marketing Strategy & Planning (7 agents)
  { id: "uc-2901", agentId: "A-2901", shortName: "Mkt Plan Gen", domain: 29, layer: 3, triggerType: "scheduled", hitl: true, hitlActor: "CMO", hitlAction: "Approve marketing plan" },
  { id: "uc-2902", agentId: "A-2902", shortName: "Budget Allocator", domain: 29, layer: 4, triggerType: "scheduled", hitl: true, hitlActor: "VP Marketing", hitlAction: "Approve budget allocation" },
  { id: "uc-2903", agentId: "A-2903", shortName: "Competitive Intel", domain: 29, layer: 3, triggerType: "scheduled" },
  { id: "uc-2904", agentId: "A-2904", shortName: "GTM Planner", domain: 29, layer: 3, triggerType: "event", hitl: true, hitlActor: "VP Marketing", hitlAction: "Approve launch plan" },
  { id: "uc-2905", agentId: "A-2905", shortName: "Audience Segment", domain: 29, layer: 4, triggerType: "scheduled" },
  { id: "uc-2906", agentId: "A-2906", shortName: "Campaign Calendar", domain: 29, layer: 2, triggerType: "scheduled" },
  { id: "uc-2907", agentId: "A-2907", shortName: "OKR Tracker", domain: 29, layer: 4, triggerType: "scheduled" },

  // Domain 30 - Content & Creative Operations (8 agents)
  { id: "uc-3001", agentId: "A-3001", shortName: "Content Brief", domain: 30, layer: 1, triggerType: "chat", hitl: true, hitlActor: "Content Strategist", hitlAction: "Review content brief" },
  { id: "uc-3002", agentId: "A-3002", shortName: "Long-Form Draft", domain: 30, layer: 1, triggerType: "event", hitl: true, hitlActor: "Content Strategist", hitlAction: "Review content draft" },
  { id: "uc-3003", agentId: "A-3003", shortName: "Creative Asset", domain: 30, layer: 3, triggerType: "event", hitl: true, hitlActor: "Brand Manager", hitlAction: "Approve creative assets" },
  { id: "uc-3004", agentId: "A-3004", shortName: "Content Perf", domain: 30, layer: 4, triggerType: "scheduled" },
  { id: "uc-3005", agentId: "A-3005", shortName: "Email Copy Opt", domain: 30, layer: 1, triggerType: "event" },
  { id: "uc-3006", agentId: "A-3006", shortName: "Content Reuse", domain: 30, layer: 1, triggerType: "event", hitl: true, hitlActor: "Content Strategist", hitlAction: "Approve repurposed content" },
  { id: "uc-3007", agentId: "A-3007", shortName: "Brand Voice", domain: 30, layer: 3, triggerType: "event" },
  { id: "uc-3008", agentId: "A-3008", shortName: "DAM Manager", domain: 30, layer: 2, triggerType: "scheduled" },

  // Domain 31 - Demand Generation & Campaigns (8 agents)
  { id: "uc-3101", agentId: "A-3101", shortName: "Campaign Builder", domain: 31, layer: 3, triggerType: "event", hitl: true, hitlActor: "Demand Gen Manager", hitlAction: "Approve campaign setup" },
  { id: "uc-3102", agentId: "A-3102", shortName: "Lead Scoring", domain: 31, layer: 4, triggerType: "event" },
  { id: "uc-3103", agentId: "A-3103", shortName: "ABM Campaign", domain: 31, layer: 3, triggerType: "event", hitl: true, hitlActor: "Demand Gen Manager", hitlAction: "Review ABM strategy" },
  { id: "uc-3104", agentId: "A-3104", shortName: "Paid Media Opt", domain: 31, layer: 4, triggerType: "scheduled", hitl: true, hitlActor: "Digital Marketing Mgr", hitlAction: "Approve budget shifts > 20%" },
  { id: "uc-3105", agentId: "A-3105", shortName: "Webinar Engine", domain: 31, layer: 2, triggerType: "event" },
  { id: "uc-3106", agentId: "A-3106", shortName: "Nurture Optimizer", domain: 31, layer: 3, triggerType: "scheduled" },
  { id: "uc-3107", agentId: "A-3107", shortName: "Landing Page Opt", domain: 31, layer: 3, triggerType: "scheduled" },
  { id: "uc-3108", agentId: "A-3108", shortName: "Campaign ROI", domain: 31, layer: 4, triggerType: "scheduled" },

  // Domain 32 - Digital Marketing & SEO/SEM (7 agents)
  { id: "uc-3201", agentId: "A-3201", shortName: "SEO Audit", domain: 32, layer: 3, triggerType: "scheduled", hitl: true, hitlActor: "SEO/SEM Specialist", hitlAction: "Review SEO recommendations" },
  { id: "uc-3202", agentId: "A-3202", shortName: "Keyword Strategy", domain: 32, layer: 4, triggerType: "scheduled" },
  { id: "uc-3203", agentId: "A-3203", shortName: "PPC Bid Mgmt", domain: 32, layer: 4, triggerType: "scheduled", hitl: true, hitlActor: "SEO/SEM Specialist", hitlAction: "Approve budget changes > 15%" },
  { id: "uc-3204", agentId: "A-3204", shortName: "Ad Copy Gen", domain: 32, layer: 1, triggerType: "event" },
  { id: "uc-3205", agentId: "A-3205", shortName: "Web Personalize", domain: 32, layer: 3, triggerType: "event" },
  { id: "uc-3206", agentId: "A-3206", shortName: "Tech SEO Monitor", domain: 32, layer: 2, triggerType: "scheduled" },
  { id: "uc-3207", agentId: "A-3207", shortName: "CRO Agent", domain: 32, layer: 4, triggerType: "scheduled" },

  // Domain 33 - Social Media & Community (6 agents)
  { id: "uc-3301", agentId: "A-3301", shortName: "Social Calendar", domain: 33, layer: 2, triggerType: "scheduled", hitl: true, hitlActor: "Social Media Mgr", hitlAction: "Approve weekly content" },
  { id: "uc-3302", agentId: "A-3302", shortName: "Social Listening", domain: 33, layer: 3, triggerType: "scheduled" },
  { id: "uc-3303", agentId: "A-3303", shortName: "Community Engage", domain: 33, layer: 1, triggerType: "event", hitl: true, hitlActor: "Social Media Mgr", hitlAction: "Review escalation responses" },
  { id: "uc-3304", agentId: "A-3304", shortName: "Influencer Track", domain: 33, layer: 3, triggerType: "scheduled", hitl: true, hitlActor: "Social Media Mgr", hitlAction: "Approve partnerships" },
  { id: "uc-3305", agentId: "A-3305", shortName: "Social Analytics", domain: 33, layer: 4, triggerType: "scheduled" },
  { id: "uc-3306", agentId: "A-3306", shortName: "UGC Advocacy", domain: 33, layer: 2, triggerType: "event", hitl: true, hitlActor: "Brand Manager", hitlAction: "Approve UGC usage" },

  // Domain 34 - Marketing Analytics & Attribution (8 agents)
  { id: "uc-3401", agentId: "A-3401", shortName: "Attribution", domain: 34, layer: 4, triggerType: "scheduled" },
  { id: "uc-3402", agentId: "A-3402", shortName: "Mkt Dashboard", domain: 34, layer: 4, triggerType: "scheduled" },
  { id: "uc-3403", agentId: "A-3403", shortName: "A/B Test Analyze", domain: 34, layer: 4, triggerType: "event" },
  { id: "uc-3404", agentId: "A-3404", shortName: "Journey Mapper", domain: 34, layer: 3, triggerType: "scheduled" },
  { id: "uc-3405", agentId: "A-3405", shortName: "Mix Modeler", domain: 34, layer: 4, triggerType: "scheduled", hitl: true, hitlActor: "CMO", hitlAction: "Review budget recommendations" },
  { id: "uc-3406", agentId: "A-3406", shortName: "Funnel Velocity", domain: 34, layer: 4, triggerType: "scheduled" },
  { id: "uc-3407", agentId: "A-3407", shortName: "Pipeline Forecast", domain: 34, layer: 4, triggerType: "scheduled" },
  { id: "uc-3408", agentId: "A-3408", shortName: "Data Quality", domain: 34, layer: 2, triggerType: "scheduled", hitl: true, hitlActor: "Marketing Ops Lead", hitlAction: "Review data quality issues" },

  // Domain 35 - Brand & Communications (7 agents)
  { id: "uc-3501", agentId: "A-3501", shortName: "Brand Health", domain: 35, layer: 4, triggerType: "scheduled" },
  { id: "uc-3502", agentId: "A-3502", shortName: "Press Release", domain: 35, layer: 1, triggerType: "event", hitl: true, hitlActor: "Brand Manager", hitlAction: "Approve press release" },
  { id: "uc-3503", agentId: "A-3503", shortName: "Crisis Comms", domain: 35, layer: 3, triggerType: "event", hitl: true, hitlActor: "CMO", hitlAction: "Approve crisis response" },
  { id: "uc-3504", agentId: "A-3504", shortName: "Exec Thought Lead", domain: 35, layer: 1, triggerType: "scheduled", hitl: true, hitlActor: "Brand Manager", hitlAction: "Review executive content" },
  { id: "uc-3505", agentId: "A-3505", shortName: "Brand Enforce", domain: 35, layer: 3, triggerType: "event", hitl: true, hitlActor: "Brand Manager", hitlAction: "Review violations" },
  { id: "uc-3506", agentId: "A-3506", shortName: "Internal Comms", domain: 35, layer: 1, triggerType: "event", hitl: true, hitlActor: "VP Marketing", hitlAction: "Approve internal comms" },
  { id: "uc-3507", agentId: "A-3507", shortName: "Analyst Relations", domain: 35, layer: 2, triggerType: "scheduled" },

  // Domain 36 - Marketing Operations & MarTech (7 agents)
  { id: "uc-3601", agentId: "A-3601", shortName: "MarTech Health", domain: 36, layer: 2, triggerType: "scheduled", hitl: true, hitlActor: "Marketing Ops Lead", hitlAction: "Review system issues" },
  { id: "uc-3602", agentId: "A-3602", shortName: "Lead Routing", domain: 36, layer: 2, triggerType: "event" },
  { id: "uc-3603", agentId: "A-3603", shortName: "Workflow Builder", domain: 36, layer: 1, triggerType: "chat", hitl: true, hitlActor: "Marketing Ops Lead", hitlAction: "Approve workflow" },
  { id: "uc-3604", agentId: "A-3604", shortName: "List Mgmt", domain: 36, layer: 2, triggerType: "event" },
  { id: "uc-3605", agentId: "A-3605", shortName: "Deliverability", domain: 36, layer: 3, triggerType: "scheduled" },
  { id: "uc-3606", agentId: "A-3606", shortName: "UTM Governance", domain: 36, layer: 2, triggerType: "event" },
  { id: "uc-3607", agentId: "A-3607", shortName: "Compliance Mgr", domain: 36, layer: 3, triggerType: "scheduled", hitl: true, hitlActor: "Marketing Ops Lead", hitlAction: "Review compliance gaps" },

  // Domain 37 - Customer & Market Intelligence (7 agents)
  { id: "uc-3701", agentId: "A-3701", shortName: "Market Research", domain: 37, layer: 1, triggerType: "chat", hitl: true, hitlActor: "Product Marketing Mgr", hitlAction: "Review research brief" },
  { id: "uc-3702", agentId: "A-3702", shortName: "Win/Loss Analyze", domain: 37, layer: 3, triggerType: "event" },
  { id: "uc-3703", agentId: "A-3703", shortName: "Review Monitor", domain: 37, layer: 3, triggerType: "scheduled", hitl: true, hitlActor: "Product Marketing Mgr", hitlAction: "Review negative feedback" },
  { id: "uc-3704", agentId: "A-3704", shortName: "ICP Refiner", domain: 37, layer: 3, triggerType: "scheduled", hitl: true, hitlActor: "CMO", hitlAction: "Approve ICP changes" },
  { id: "uc-3705", agentId: "A-3705", shortName: "Battle Cards", domain: 37, layer: 1, triggerType: "event", hitl: true, hitlActor: "Product Marketing Mgr", hitlAction: "Approve battle card" },
  { id: "uc-3706", agentId: "A-3706", shortName: "Sales Enablement", domain: 37, layer: 1, triggerType: "event" },
  { id: "uc-3707", agentId: "A-3707", shortName: "Trend Detector", domain: 37, layer: 3, triggerType: "scheduled" },

  // ═══════════════════════════════════════════════
  // IT DOMAINS (38-46)
  // ═══════════════════════════════════════════════

  // Domain 38 - IT Strategy & Portfolio Management (7 agents)
  { id: "uc-3801", agentId: "A-3801", shortName: "Portfolio Prioritize", domain: 38, layer: 3, triggerType: "scheduled", hitl: true, hitlActor: "CIO", hitlAction: "Approve portfolio ranking" },
  { id: "uc-3802", agentId: "A-3802", shortName: "Tech Radar", domain: 38, layer: 4, triggerType: "scheduled" },
  { id: "uc-3803", agentId: "A-3803", shortName: "IT Budget Forecast", domain: 38, layer: 4, triggerType: "scheduled" },
  { id: "uc-3804", agentId: "A-3804", shortName: "DX Tracker", domain: 38, layer: 4, triggerType: "scheduled" },
  { id: "uc-3805", agentId: "A-3805", shortName: "Vendor Rational", domain: 38, layer: 3, triggerType: "scheduled", hitl: true, hitlActor: "IT Vendor Mgr", hitlAction: "Approve consolidation plan" },
  { id: "uc-3806", agentId: "A-3806", shortName: "IT OKR Dashboard", domain: 38, layer: 4, triggerType: "scheduled" },
  { id: "uc-3807", agentId: "A-3807", shortName: "Strategy Q&A", domain: 38, layer: 1, triggerType: "chat" },

  // Domain 39 - Software Engineering & DevOps (9 agents)
  { id: "uc-3901", agentId: "A-3901", shortName: "CI/CD Optimizer", domain: 39, layer: 3, triggerType: "scheduled" },
  { id: "uc-3902", agentId: "A-3902", shortName: "Code Review", domain: 39, layer: 3, triggerType: "event" },
  { id: "uc-3903", agentId: "A-3903", shortName: "Tech Debt Prior", domain: 39, layer: 4, triggerType: "scheduled" },
  { id: "uc-3904", agentId: "A-3904", shortName: "Release Notes", domain: 39, layer: 1, triggerType: "event" },
  { id: "uc-3905", agentId: "A-3905", shortName: "Incident Tracer", domain: 39, layer: 3, triggerType: "event" },
  { id: "uc-3906", agentId: "A-3906", shortName: "Dep Vuln Scan", domain: 39, layer: 3, triggerType: "event", hitl: true, hitlActor: "VP Engineering", hitlAction: "Approve critical patches" },
  { id: "uc-3907", agentId: "A-3907", shortName: "Feature Flags", domain: 39, layer: 2, triggerType: "scheduled" },
  { id: "uc-3908", agentId: "A-3908", shortName: "DevEx Surveyor", domain: 39, layer: 4, triggerType: "scheduled" },
  { id: "uc-3909", agentId: "A-3909", shortName: "IaC Drift", domain: 39, layer: 3, triggerType: "scheduled" },

  // Domain 40 - Infrastructure & Cloud Operations (8 agents)
  { id: "uc-4001", agentId: "A-4001", shortName: "Cloud Cost Opt", domain: 40, layer: 4, triggerType: "scheduled", hitl: true, hitlActor: "Cloud Architect", hitlAction: "Approve reservation purchases" },
  { id: "uc-4002", agentId: "A-4002", shortName: "Capacity Plan", domain: 40, layer: 4, triggerType: "scheduled" },
  { id: "uc-4003", agentId: "A-4003", shortName: "Incident Remed", domain: 40, layer: 3, triggerType: "event", hitl: true, hitlActor: "SRE Manager", hitlAction: "Approve production remediation" },
  { id: "uc-4004", agentId: "A-4004", shortName: "SLO Monitor", domain: 40, layer: 4, triggerType: "scheduled" },
  { id: "uc-4005", agentId: "A-4005", shortName: "K8s Optimizer", domain: 40, layer: 3, triggerType: "scheduled" },
  { id: "uc-4006", agentId: "A-4006", shortName: "DB Perf Advisor", domain: 40, layer: 3, triggerType: "event" },
  { id: "uc-4007", agentId: "A-4007", shortName: "Network Health", domain: 40, layer: 2, triggerType: "scheduled" },
  { id: "uc-4008", agentId: "A-4008", shortName: "Backup DR Check", domain: 40, layer: 2, triggerType: "scheduled" },

  // Domain 41 - Cybersecurity & Threat Management (9 agents)
  { id: "uc-4101", agentId: "A-4101", shortName: "Threat Intel", domain: 41, layer: 3, triggerType: "scheduled" },
  { id: "uc-4102", agentId: "A-4102", shortName: "Vuln Prioritize", domain: 41, layer: 4, triggerType: "scheduled" },
  { id: "uc-4103", agentId: "A-4103", shortName: "SIEM Triage", domain: 41, layer: 3, triggerType: "event", hitl: true, hitlActor: "Security Analyst", hitlAction: "Review confirmed incidents" },
  { id: "uc-4104", agentId: "A-4104", shortName: "Phishing Analyze", domain: 41, layer: 3, triggerType: "event" },
  { id: "uc-4105", agentId: "A-4105", shortName: "IAM Anomaly", domain: 41, layer: 3, triggerType: "event", hitl: true, hitlActor: "CISO", hitlAction: "Approve access revocation" },
  { id: "uc-4106", agentId: "A-4106", shortName: "Compliance Scan", domain: 41, layer: 4, triggerType: "scheduled" },
  { id: "uc-4107", agentId: "A-4107", shortName: "Pentest Tracker", domain: 41, layer: 2, triggerType: "event" },
  { id: "uc-4108", agentId: "A-4108", shortName: "Sec Incident Resp", domain: 41, layer: 3, triggerType: "event", hitl: true, hitlActor: "CISO", hitlAction: "Approve containment actions" },
  { id: "uc-4109", agentId: "A-4109", shortName: "Zero Trust Eval", domain: 41, layer: 3, triggerType: "scheduled" },

  // Domain 42 - IT Service Management / ITSM (8 agents)
  { id: "uc-4201", agentId: "A-4201", shortName: "Ticket Router", domain: 42, layer: 2, triggerType: "event" },
  { id: "uc-4202", agentId: "A-4202", shortName: "KB Auto-Resolve", domain: 42, layer: 1, triggerType: "event" },
  { id: "uc-4203", agentId: "A-4203", shortName: "SLA Predictor", domain: 42, layer: 4, triggerType: "scheduled" },
  { id: "uc-4204", agentId: "A-4204", shortName: "Change Risk", domain: 42, layer: 3, triggerType: "event", hitl: true, hitlActor: "CAB", hitlAction: "Approve high-risk changes" },
  { id: "uc-4205", agentId: "A-4205", shortName: "Major Incident", domain: 42, layer: 3, triggerType: "event", hitl: true, hitlActor: "SRE Manager", hitlAction: "Approve escalation decisions" },
  { id: "uc-4206", agentId: "A-4206", shortName: "Problem Analyze", domain: 42, layer: 4, triggerType: "scheduled" },
  { id: "uc-4207", agentId: "A-4207", shortName: "Catalog Recommend", domain: 42, layer: 1, triggerType: "chat" },
  { id: "uc-4208", agentId: "A-4208", shortName: "ITSM Dashboard", domain: 42, layer: 4, triggerType: "scheduled" },

  // Domain 43 - Data & AI Platform (7 agents)
  { id: "uc-4301", agentId: "A-4301", shortName: "Pipeline Health", domain: 43, layer: 3, triggerType: "event" },
  { id: "uc-4302", agentId: "A-4302", shortName: "Data Quality", domain: 43, layer: 4, triggerType: "scheduled" },
  { id: "uc-4303", agentId: "A-4303", shortName: "Model Registry", domain: 43, layer: 3, triggerType: "event", hitl: true, hitlActor: "Data Platform Lead", hitlAction: "Approve model deployments" },
  { id: "uc-4304", agentId: "A-4304", shortName: "Feature Store", domain: 43, layer: 3, triggerType: "chat" },
  { id: "uc-4305", agentId: "A-4305", shortName: "Query Cost Opt", domain: 43, layer: 4, triggerType: "scheduled" },
  { id: "uc-4306", agentId: "A-4306", shortName: "Data Catalog", domain: 43, layer: 2, triggerType: "chat" },
  { id: "uc-4307", agentId: "A-4307", shortName: "AI Ethics Mon", domain: 43, layer: 3, triggerType: "scheduled", hitl: true, hitlActor: "Data Platform Lead", hitlAction: "Review bias findings" },

  // Domain 44 - Enterprise Architecture (7 agents)
  { id: "uc-4401", agentId: "A-4401", shortName: "ADR Drafter", domain: 44, layer: 1, triggerType: "chat" },
  { id: "uc-4402", agentId: "A-4402", shortName: "API Governance", domain: 44, layer: 2, triggerType: "event" },
  { id: "uc-4403", agentId: "A-4403", shortName: "Dependency Map", domain: 44, layer: 4, triggerType: "scheduled" },
  { id: "uc-4404", agentId: "A-4404", shortName: "Tech Lifecycle", domain: 44, layer: 3, triggerType: "scheduled", hitl: true, hitlActor: "Enterprise Architect", hitlAction: "Approve sunset decisions" },
  { id: "uc-4405", agentId: "A-4405", shortName: "Integration Adv", domain: 44, layer: 1, triggerType: "chat" },
  { id: "uc-4406", agentId: "A-4406", shortName: "Arch Compliance", domain: 44, layer: 3, triggerType: "scheduled" },
  { id: "uc-4407", agentId: "A-4407", shortName: "Ref Arch Gen", domain: 44, layer: 1, triggerType: "chat" },

  // Domain 45 - IT Governance & Compliance (7 agents)
  { id: "uc-4501", agentId: "A-4501", shortName: "Control Testing", domain: 45, layer: 3, triggerType: "scheduled", hitl: true, hitlActor: "GRC Lead", hitlAction: "Approve test results" },
  { id: "uc-4502", agentId: "A-4502", shortName: "Audit Evidence", domain: 45, layer: 2, triggerType: "event" },
  { id: "uc-4503", agentId: "A-4503", shortName: "Policy Lifecycle", domain: 45, layer: 2, triggerType: "scheduled" },
  { id: "uc-4504", agentId: "A-4504", shortName: "License Comply", domain: 45, layer: 4, triggerType: "scheduled" },
  { id: "uc-4505", agentId: "A-4505", shortName: "Risk Register", domain: 45, layer: 3, triggerType: "scheduled", hitl: true, hitlActor: "GRC Lead", hitlAction: "Approve risk ratings" },
  { id: "uc-4506", agentId: "A-4506", shortName: "Reg Change Mon", domain: 45, layer: 3, triggerType: "scheduled" },
  { id: "uc-4507", agentId: "A-4507", shortName: "GRC Dashboard", domain: 45, layer: 4, triggerType: "scheduled" },

  // Domain 46 - End User Computing & Productivity (8 agents)
  { id: "uc-4601", agentId: "A-4601", shortName: "Device Lifecycle", domain: 46, layer: 2, triggerType: "event" },
  { id: "uc-4602", agentId: "A-4602", shortName: "Access Provision", domain: 46, layer: 2, triggerType: "event" },
  { id: "uc-4603", agentId: "A-4603", shortName: "Workspace Analyt", domain: 46, layer: 4, triggerType: "scheduled" },
  { id: "uc-4604", agentId: "A-4604", shortName: "Self-Service Bot", domain: 46, layer: 1, triggerType: "chat" },
  { id: "uc-4605", agentId: "A-4605", shortName: "Endpoint Posture", domain: 46, layer: 3, triggerType: "scheduled" },
  { id: "uc-4606", agentId: "A-4606", shortName: "Room Optimizer", domain: 46, layer: 4, triggerType: "scheduled" },
  { id: "uc-4607", agentId: "A-4607", shortName: "Onboard Tech", domain: 46, layer: 2, triggerType: "event" },
  { id: "uc-4608", agentId: "A-4608", shortName: "Shadow IT Detect", domain: 46, layer: 3, triggerType: "scheduled", hitl: true, hitlActor: "End User Lead", hitlAction: "Review policy decisions" },
];
