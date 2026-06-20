import { User, Briefcase, Monitor, Code, Cloud, Shield, Headphones, Database, Network, FileCheck, Laptop, AlertTriangle, Clock, Layers } from "lucide-react";
import { DepartmentConfig } from "./types";

export const itDepartment: DepartmentConfig = {
  key: "it",
  label: "Information Technology",
  shortLabel: "IT",
  icon: Monitor,
  accentColor: "#3b82f6",
  activeBg: "bg-blue-600",
  domainRange: [38, 46],

  subtitle: "9 Domains • 70 Agents • 12 Personas",
  description: "End-to-end IT transformation — Strategize → Build → Run → Secure → Support → Platform → Architect → Govern → Enable. Every agent grounded in real DevOps toolchains, real ITSM platforms, and the three-layer capability model.",

  periodicTableTitle: "The Periodic Table of IT Agents",
  periodicTableSubtitle: "70 AI agents across 9 IT domains — Strategize → Build → Run → Secure → Support → Platform → Architect → Govern → Enable.",

  domainColors: {
    38: "#3b82f6", 39: "#10b981", 40: "#7c3aed", 41: "#ef4444",
    42: "#d97706", 43: "#6366f1", 44: "#0891b2", 45: "#64748b",
    46: "#ca8a04",
  },

  challenge: {
    title: "The IT Burden",
    items: [
      { icon: AlertTriangle, title: "Alert Fatigue & Firefighting", desc: "SRE and security teams drown in 200+ daily alerts — 90% are false positives, but each requires manual investigation." },
      { icon: Clock, title: "Slow Ticket Resolution", desc: "IT service desk takes 4+ hours to resolve routine requests that could be automated — password resets, access provisioning, VPN issues." },
      { icon: Layers, title: "Tool Sprawl & Fragmentation", desc: "IT data spread across 30+ tools — monitoring, ITSM, security, DevOps — with no unified view of operational health." },
    ],
    stat: "60%",
    statLabel: "Time on Firefighting",
    statDesc: "IT teams spend 60% of their time on reactive operations — incident triage, manual ticket routing, audit evidence collection, and alert investigation — leaving only 40% for strategic projects and innovation.",
  },

  personas: [
    { title: "CIO / CTO", desc: "Owns IT strategy, digital transformation, board reporting, vendor governance, innovation portfolio, and technology roadmap", metrics: "Digital transformation ROI, IT spend ratio, innovation velocity, uptime SLA", domains: [38,44,45], icon: User, color: "#1d4ed8" },
    { title: "VP Engineering", desc: "Drives engineering velocity, manages tech debt, ensures platform reliability, and oversees SDLC governance", metrics: "DORA metrics, tech debt ratio, release frequency, engineer satisfaction", domains: [38,39], icon: Briefcase, color: "#0f766e" },
    { title: "Enterprise Architect", desc: "Defines architecture standards, maintains technology radar, governs integration patterns and reference architectures", metrics: "Architecture compliance, API reuse, technology currency, integration patterns", domains: [38,44], icon: Network, color: "#0e7490" },
    { title: "DevOps Lead", desc: "Manages CI/CD pipelines, release velocity, GitOps practices, infrastructure as code, and developer experience", metrics: "Deployment frequency, lead time, change failure rate, pipeline uptime", domains: [39,40], icon: Code, color: "#0f766e" },
    { title: "SRE Manager", desc: "Owns SLOs/SLIs, incident response, reliability engineering, capacity planning, and toil reduction programs", metrics: "MTTR, error budget burn, SLO attainment, toil reduction %", domains: [40,42], icon: Monitor, color: "#6d28d9" },
    { title: "CISO / Security Analyst", desc: "Leads threat detection, vulnerability management, compliance programs, zero trust architecture, and security operations", metrics: "MTTD, vulnerability remediation SLA, compliance posture, incident count", domains: [41,45], icon: Shield, color: "#be123c" },
    { title: "IT Service Desk Manager", desc: "Manages ticket resolution, SLA compliance, knowledge base, self-service enablement, and agent workload optimization", metrics: "CSAT, first-contact resolution, SLA attainment, self-service rate", domains: [42], icon: Headphones, color: "#b45309" },
    { title: "Data Platform Lead", desc: "Owns data infrastructure, ML pipelines, data quality, feature stores, and analytics engineering platform", metrics: "Pipeline uptime, data freshness, model accuracy, query cost efficiency", domains: [43], icon: Database, color: "#4338ca" },
    { title: "Cloud Architect", desc: "Defines cloud strategy, drives cost optimization, governs multi-cloud operations, and plans migrations", metrics: "Cloud spend efficiency, migration progress, multi-cloud coverage, cost per workload", domains: [40,44], icon: Cloud, color: "#6d28d9" },
    { title: "IT Vendor Manager", desc: "Manages software licensing, vendor evaluations, contract negotiations, and SaaS rationalization across the IT portfolio", metrics: "License utilization, vendor consolidation, contract savings, audit readiness", domains: [38,45,46], icon: Briefcase, color: "#475569" },
    { title: "Compliance & GRC Lead", desc: "Owns IT controls, SOC 2 and ISO 27001 readiness, audit programs, policy management, and risk register", metrics: "Compliance score, audit findings, policy currency, risk treatment rate", domains: [41,45], icon: FileCheck, color: "#475569" },
    { title: "End User Support Lead", desc: "Manages endpoint fleet, productivity tools, onboarding provisioning, user training, and shadow IT governance", metrics: "Device health, provisioning time, self-service adoption, shadow IT incidents", domains: [42,46], icon: Laptop, color: "#a16207" },
  ],

  dayInLife: [
    {
      persona: "DevOps Lead",
      intro: "The DevOps Lead keeps the build-ship-run engine running — managing CI/CD pipelines, deployment velocity, infrastructure as code, and developer experience across 50+ microservices.",
      blocks: [
        { time: "8:00", activity: "Checking overnight build failures across 12 repos — manually reading logs to find root causes.", processes: ["CI/CD Management", "Build Troubleshooting"], agentOpportunity: "CI/CD Pipeline Optimizer already diagnosed 3 failures: 2 flaky tests (auto-quarantined) and 1 genuine regression with the failing commit identified" },
        { time: "9:00", activity: "Running terraform plan manually across 4 environments to check for drift after last night's incident response.", processes: ["Infrastructure as Code", "Drift Detection"], agentOpportunity: "IaC Drift Detector found 5 manual changes from the incident — generated PRs to import them into Terraform state" },
        { time: "10:00", activity: "Sprint planning: estimating which tech debt items to tackle based on gut feel about code quality.", processes: ["Sprint Planning", "Tech Debt"], agentOpportunity: "Tech Debt Prioritizer ranked items by incident correlation and change velocity — the auth module refactor would prevent 4 incidents/quarter" },
        { time: "11:00", activity: "Reviewing 8 pull requests — trying to catch security issues and architectural violations in the code.", processes: ["Code Review", "Security Review"], agentOpportunity: "Code Review Assistant flagged a PII handling violation and an API design inconsistency; approved 5 PRs with no issues" },
        { time: "1:00", activity: "Manually writing release notes by reading through 40 commits and cross-referencing Jira tickets.", processes: ["Release Management", "Documentation"], agentOpportunity: "Release Notes Generator produced user-facing notes, internal changelog, and breaking change warnings automatically" },
        { time: "2:30", activity: "Investigating why deployment frequency dropped this sprint — querying Jira and GitHub for clues.", processes: ["DevEx Analysis", "Metrics Review"], agentOpportunity: "Developer Experience Surveyor pinpointed the cause: the new 2-hour approval wait is the bottleneck, not code velocity" },
        { time: "4:00", activity: "Manually updating feature flags after a successful rollout — checking each environment one by one.", processes: ["Feature Flag Management", "Cleanup"], agentOpportunity: "Feature Flag Manager identified 17 stale flags and generated cleanup PRs with evidence of successful rollout" },
      ]
    },
    {
      persona: "Security Analyst",
      intro: "The Security Analyst monitors threats, triages alerts, investigates incidents, and ensures the organization's security posture stays ahead of evolving threats.",
      blocks: [
        { time: "8:00", activity: "Reviewing 200+ overnight SIEM alerts — 90% are false positives but each requires manual investigation.", processes: ["Alert Triage", "SIEM Monitoring"], agentOpportunity: "SIEM Alert Triage Agent auto-classified 185 alerts (92%) as benign with evidence — surfaced 15 for human review" },
        { time: "9:00", activity: "Researching a new ransomware campaign reported in threat feeds — manually checking if our systems are vulnerable.", processes: ["Threat Intelligence", "Vulnerability Assessment"], agentOpportunity: "Threat Intelligence Aggregator already correlated the campaign IOCs against our asset inventory — 2 systems need immediate patching" },
        { time: "10:00", activity: "Running vulnerability scan reports — trying to prioritize 2,400 findings with limited team capacity.", processes: ["Vulnerability Management", "Risk Prioritization"], agentOpportunity: "Vulnerability Prioritization Agent filtered to 47 exploitable findings on internet-facing assets — 12 on the payment stack are critical" },
        { time: "11:00", activity: "Investigating a suspicious login alert — checking IP geolocation, VPN logs, and user behavior manually.", processes: ["Identity Monitoring", "Incident Investigation"], agentOpportunity: "Identity & Access Anomaly Detector enriched the alert: former contractor account still active 30 days post-termination" },
        { time: "1:00", activity: "Reviewing a phishing report from an employee — manually checking URLs, headers, and attachment hashes.", processes: ["Phishing Analysis", "Email Security"], agentOpportunity: "Phishing Analyzer identified a BEC attempt impersonating the CFO, quarantined across all mailboxes within 3 minutes" },
        { time: "2:30", activity: "Preparing the quarterly SOC 2 evidence package — gathering screenshots and logs from 15 different systems.", processes: ["Compliance Reporting", "Audit Preparation"], agentOpportunity: "Compliance Posture Scanner generated the evidence package automatically — flagged 3 control gaps needing remediation" },
        { time: "4:00", activity: "Reviewing zero trust policy exceptions — checking if temporary VPN access grants should be revoked.", processes: ["Zero Trust", "Policy Review"], agentOpportunity: "Zero Trust Policy Evaluator identified 15 legacy apps still using VPN-only access and recommended migration priorities" },
      ]
    },
    {
      persona: "IT Service Desk Manager",
      intro: "The IT Service Desk Manager keeps the support engine running — ensuring SLA compliance, optimizing agent workloads, and driving self-service adoption to reduce ticket volume.",
      blocks: [
        { time: "8:00", activity: "Reviewing overnight ticket queue — manually categorizing and routing 45 tickets to the right teams.", processes: ["Ticket Management", "Queue Review"], agentOpportunity: "Intelligent Ticket Router auto-classified and routed 40 tickets, escalated 5 that needed human judgment" },
        { time: "9:00", activity: "An employee can't access the VPN — walking them through troubleshooting steps over chat for 25 minutes.", processes: ["User Support", "Troubleshooting"], agentOpportunity: "Self-Service IT Bot resolved the VPN issue in 2 minutes with guided troubleshooting — the client certificate had expired" },
        { time: "10:00", activity: "Checking SLA dashboards and manually flagging tickets approaching breach — calling agents to reprioritize.", processes: ["SLA Management", "Escalation"], agentOpportunity: "SLA Breach Predictor proactively alerted on 12 tickets predicted to breach in 4 hours — 8 were VPN issues from the ISP outage" },
        { time: "11:00", activity: "A major incident is declared — scrambling to set up a war room, page engineers, and update the status page.", processes: ["Major Incident", "Communication"], agentOpportunity: "Major Incident Coordinator assembled the war room, paged the right teams, and started status page updates automatically" },
        { time: "1:00", activity: "Reviewing the change calendar for next week — manually checking for conflicts between 15 change requests.", processes: ["Change Management", "Risk Assessment"], agentOpportunity: "Change Risk Assessor identified 2 conflicting changes and a high-risk database migration needing CAB review" },
        { time: "2:30", activity: "Updating the knowledge base — an agent solved a tricky printer issue and the fix needs to be documented.", processes: ["Knowledge Management", "Documentation"], agentOpportunity: "Knowledge Base Auto-Resolver detected the resolution pattern and auto-generated a KB article from the ticket resolution" },
        { time: "4:00", activity: "Preparing the weekly ITSM report — pulling metrics from ServiceNow and formatting in Google Slides.", processes: ["ITSM Reporting", "Analytics"], agentOpportunity: "ITSM Analytics Dashboard generated the report with commentary: ticket volume up 15% due to MFA rollout, CSAT improved to 4.3" },
      ]
    },
  ],

  raci: {
    personas: ["CIO/CTO","VP Eng","Ent Arch","DevOps Lead","SRE Mgr","CISO","Svc Desk Mgr","Data Plat Lead","Cloud Arch","IT Vendor Mgr","GRC Lead","End User Lead"],
    matrix: [
      // IT1 IT2 IT3 IT4 IT5 IT6 IT7 IT8 IT9
      ["R","C","C","C","I","C","R","R","I"],  // CIO/CTO
      ["C","R","C","I","I","C","C","I","I"],  // VP Engineering
      ["C","C","I","I","I","C","R","C","I"],  // Enterprise Architect
      ["I","R","R","I","I","I","C","I","I"],  // DevOps Lead
      ["I","C","R","C","R","I","I","I","I"],  // SRE Manager
      ["I","C","C","R","C","I","I","R","C"],  // CISO
      ["I","I","I","I","R","I","I","I","C"],  // IT Service Desk Mgr
      ["I","I","I","I","I","R","C","I","I"],  // Data Platform Lead
      ["C","I","R","C","I","C","R","I","I"],  // Cloud Architect
      ["R","I","C","I","I","I","I","C","C"],  // IT Vendor Mgr
      ["C","I","I","C","I","I","C","R","I"],  // GRC Lead
      ["I","I","I","I","C","I","I","I","R"],  // End User Support Lead
    ],
  },

  techLandscape: {
    asIs: [
      { label: "DevOps", tools: "Jenkins, GitHub/GitLab, ArgoCD, Terraform" },
      { label: "Cloud", tools: "AWS, GCP, Azure" },
      { label: "Monitoring", tools: "Datadog, Splunk, PagerDuty, SolarWinds" },
      { label: "Security", tools: "CrowdStrike, Palo Alto, Okta, Qualys, Tenable, Snyk" },
      { label: "ITSM", tools: "ServiceNow, Jira Service Management" },
      { label: "Data Platform", tools: "BigQuery, Airflow, dbt, Vertex AI" },
      { label: "Endpoint", tools: "ManageEngine, Jamf" },
      { label: "Productivity", tools: "Google Workspace, Slack, Zoom" },
      { label: "Architecture", tools: "Confluence, Apigee, ServiceNow CMDB" },
    ],
    toBe: [
      { label: "Source Systems", description: "DevOps, Cloud, Security, ITSM, Data, Endpoint, Productivity — connected via APIs and event streams" },
      { label: "Gemini Enterprise Agent Layer", description: "70 autonomous agents across 9 domains — Strategize → Build → Run → Secure → Support → Platform → Architect → Govern → Enable" },
      { label: "Unified IT Data Lake", description: "BigQuery — single source of truth for all IT operational data, metrics, and compliance artifacts" },
      { label: "Insights & Actions", description: "Real-time dashboards, proactive alerting, automated remediation, architecture governance, self-healing infrastructure" },
    ],
    painPoint: "60% firefighting, 200+ daily alerts, 4-hour ticket resolution, 30+ fragmented tools",
    benefit: "Proactive ops, <15min MTTR, 80% self-service, automated compliance, self-healing infrastructure",
  },

  integrationSystems: ["ServiceNow", "Jira", "GitHub", "Jenkins", "Terraform", "CrowdStrike", "Datadog", "PagerDuty"],
  externalAgents: ["ServiceNow Agents", "GitHub Copilot", "CrowdStrike Agents"],
  transformationSteps: [
    { domain: "Cybersecurity", activity: "Triage security alerts", asIs: "Manual SIEM alert review, 95% false positive rate", toBe: "SIEM Triage Agent auto-classifies 92% as benign, surfaces real threats", agentName: "SIEM Triage", impact: "Analyst workload reduced 90%" },
    { domain: "IT Service Mgmt", activity: "Resolve support tickets", asIs: "Manual ticket routing, L1 handles repetitive queries", toBe: "KB Auto-Resolver answers 60% of tickets instantly from knowledge base", agentName: "KB Auto-Resolver", impact: "L1 ticket volume reduced 60%" },
    { domain: "Cloud Operations", activity: "Optimize cloud costs", asIs: "Quarterly cost reviews, manual right-sizing", toBe: "Cloud Cost Optimizer continuously identifies savings opportunities", agentName: "Cloud Cost Optimizer", impact: "Cloud spend reduced 25-35%" },
    { domain: "Software Engineering", activity: "Review code changes", asIs: "Manual PR reviews, 2-3 day review cycle", toBe: "Code Review Assistant provides instant feedback on patterns, bugs, security", agentName: "Code Review", impact: "Review cycle from days to hours" },
  ],
};
