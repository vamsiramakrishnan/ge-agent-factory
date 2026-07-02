# IT AI Agent Catalog — Gemini Enterprise Field Kit

**Department:** Information Technology
**Total Agents:** 70 across 9 domains
**Approach:** Domain-native structure sequenced along the IT value chain (Strategize → Build → Run → Secure → Support → Platform → Architect → Govern → Enable)

---

## Domain Structure Overview

| # | Domain | Value-Chain Stage | Owner Persona | Agent Count |
|---|--------|-------------------|---------------|-------------|
| **IT1** | IT Strategy & Portfolio Management | STRATEGIZE | CIO / CTO | 7 |
| **IT2** | Software Engineering & DevOps | BUILD | VP Engineering / DevOps Lead | 9 |
| **IT3** | Infrastructure & Cloud Operations | RUN | Cloud Architect / SRE Manager | 8 |
| **IT4** | Cybersecurity & Threat Management | SECURE | CISO / Security Analyst | 9 |
| **IT5** | IT Service Management (ITSM) | SUPPORT | IT Service Desk Manager | 8 |
| **IT6** | Data & AI Platform | PLATFORM | Data Platform Lead | 7 |
| **IT7** | Enterprise Architecture | ARCHITECT | Enterprise Architect | 7 |
| **IT8** | IT Governance & Compliance | GOVERN | Compliance & GRC Lead | 7 |
| **IT9** | End User Computing & Productivity | ENABLE | End User Support Lead | 8 |

---

## Persona Roster (12)

| # | Persona | Focus Areas |
|---|---------|-------------|
| 1 | CIO / CTO | IT strategy, digital transformation, board reporting, vendor governance, innovation portfolio |
| 2 | VP Engineering | Engineering velocity, tech debt, platform reliability, talent, SDLC governance |
| 3 | Enterprise Architect | Architecture standards, technology radar, integration patterns, reference architectures |
| 4 | DevOps Lead | CI/CD pipelines, release velocity, GitOps, IaC, developer experience |
| 5 | SRE Manager | SLOs/SLIs, incident response, reliability engineering, capacity planning, toil reduction |
| 6 | CISO / Security Analyst | Threat detection, vulnerability management, compliance, zero trust, security operations |
| 7 | IT Service Desk Manager | Ticket resolution, SLA management, knowledge base, self-service enablement |
| 8 | Data Platform Lead | Data infrastructure, ML pipelines, data quality, feature stores, analytics engineering |
| 9 | Cloud Architect | Cloud strategy, cost optimization, multi-cloud governance, migration planning |
| 10 | IT Procurement / Vendor Mgr | Software licensing, vendor evaluation, contract negotiation, SaaS rationalization |
| 11 | Compliance & GRC Lead | IT controls, SOC 2, ISO 27001, audit readiness, policy management |
| 12 | End User Support Lead | Endpoint management, productivity tools, onboarding provisioning, user training |

---

## IT1: IT Strategy & Portfolio Management (7 Agents)

### IT1-01: Portfolio Prioritization Engine
- **Systems:** Jira Portfolio, ServiceNow SPM, BigQuery, Vertex AI
- **Trigger:** Scheduled (quarterly planning cycle)
- **Layer:** 3 (Custom ADK)
- **HITL:** CIO approval on portfolio ranking
- **Integration & Orchestration:** Pull project proposals from intake, resource capacity from HRIS, strategic objectives from OKR system, financial data from ERP. Score and rank projects.
- **Traditional ML / Analytics:** Multi-criteria scoring (ROI, strategic fit, risk, resource availability), portfolio optimization using constraint programming, Monte Carlo on delivery timelines
- **LLM Reasoning:** Read project proposals and business cases in natural language, assess strategic alignment against company OKRs, identify overlapping initiatives. "The Cloud Migration and Data Platform Modernization proposals share 60% of the same infrastructure work — recommend merging into a single program to save $1.2M and 4 months."

### IT1-02: Technology Radar & Trend Scout
- **Systems:** GitHub, Gartner API, StackShare, BigQuery, Vertex AI
- **Trigger:** Scheduled (monthly)
- **Layer:** 4 (Data Agent)
- **Integration & Orchestration:** Scan technology adoption trends, internal codebase analysis, industry analyst reports, open-source project health
- **Traditional ML / Analytics:** Adoption curve modeling, technology maturity scoring, internal usage trending, dependency risk analysis
- **LLM Reasoning:** Synthesize signals from research reports, Hacker News, GitHub trending, and internal engineering feedback into actionable technology radar updates. "Rust adoption in infrastructure tooling increased 40% industry-wide — our platform team has 3 engineers interested. Recommend a pilot for the new CLI tooling project."

### IT1-03: IT Budget Forecast Agent
- **Systems:** Anaplan, ServiceNow SPM, AWS Cost Explorer, GCP Billing, BigQuery, Vertex AI
- **Trigger:** Scheduled (monthly)
- **Layer:** 4 (Data Agent)
- **Integration & Orchestration:** Aggregate cloud spend, license costs, headcount, project costs. Produce consolidated IT budget forecast.
- **Traditional ML / Analytics:** Cloud spend forecasting with seasonal decomposition, license utilization trending, CapEx/OpEx split analysis, variance detection
- **LLM Reasoning:** Explain budget variances with context: "Cloud spend is 15% over forecast — driven by the Black Friday load testing environment that wasn't in the original plan. This is a one-time cost, not a trend. Recommend adjusting Q4 forecast by $200K."

### IT1-04: Digital Transformation Tracker
- **Systems:** Jira, ServiceNow, BigQuery, Looker, Vertex AI
- **Trigger:** Scheduled (monthly)
- **Layer:** 4 (Data Agent)
- **Integration & Orchestration:** Pull initiative status, KPI actuals, adoption metrics, milestone completions across all transformation programs
- **Traditional ML / Analytics:** Initiative health scoring, milestone slip prediction, adoption curve analysis, benefit realization tracking
- **LLM Reasoning:** Generate executive transformation status narrative: "3 of 5 pillars are green. The API-first initiative is amber — 2 months behind on partner onboarding due to documentation gaps. The self-service analytics pillar exceeded adoption targets by 30%."

### IT1-05: Vendor Rationalization Agent
- **Systems:** ServiceNow SAM, Zylo, Okta, BigQuery, Vertex AI
- **Trigger:** Scheduled (quarterly)
- **Layer:** 3 (Custom ADK)
- **HITL:** IT Procurement / Vendor Mgr approval
- **Integration & Orchestration:** Pull software inventory, license data, usage telemetry, contract terms, SSO login frequency
- **Traditional ML / Analytics:** Usage clustering, overlap detection across tools, cost-per-user analysis, renewal timeline optimization
- **LLM Reasoning:** Analyze tool overlap and recommend consolidation: "We have 4 project management tools (Jira, Asana, Monday, Trello) across different teams — 40% of users have accounts in 2+ tools. Recommend standardizing on Jira with a 6-month migration plan, saving $180K/year."

### IT1-06: IT OKR & KPI Dashboard
- **Systems:** BigQuery, Looker, Jira, ServiceNow, Vertex AI
- **Trigger:** Scheduled (weekly)
- **Layer:** 4 (Data Agent)
- **Integration & Orchestration:** Aggregate KPIs from ITSM, DevOps, security, and cloud platforms into a unified dashboard
- **Traditional ML / Analytics:** KPI trending, target attainment forecasting, cross-metric correlation analysis
- **LLM Reasoning:** Generate weekly IT performance narrative for CIO staff meeting: "Deployment frequency improved 20% this month after the GitOps rollout. Mean time to recovery regressed from 45min to 62min — root cause: 3 incidents in the legacy payment system that lacks proper observability."

### IT1-07: Strategic Initiative Q&A
- **Systems:** Confluence, Jira, BigQuery, Vertex AI
- **Trigger:** Chat
- **Layer:** 1 (OOTB)
- **Integration & Orchestration:** Route queries to confluence docs, Jira data, and analytics
- **Traditional ML / Analytics:** Natural language to query translation, document retrieval ranking
- **LLM Reasoning:** Answer strategic questions with context: "What's the status of the cloud migration? → Phase 2 is 75% complete — 142 of 189 workloads migrated. The remaining 47 are the regulated workloads pending security review, expected to complete by end of Q2."

---

## IT2: Software Engineering & DevOps (9 Agents)

### IT2-01: CI/CD Pipeline Optimizer
- **Systems:** Jenkins, GitHub Actions, ArgoCD, Datadog, BigQuery, Vertex AI
- **Trigger:** Scheduled (weekly)
- **Layer:** 3 (Custom ADK)
- **Integration & Orchestration:** Collect pipeline telemetry, build times, failure rates, deployment frequency across all repos
- **Traditional ML / Analytics:** Pipeline bottleneck detection, flaky test identification, build time regression analysis, parallelization opportunity scoring
- **LLM Reasoning:** Analyze pipeline failures and suggest fixes: "The checkout-service pipeline has failed 12 times this week — 8 failures are from the same integration test that depends on an external API mock. Recommend extracting the mock to a shared fixture and adding retry logic."

### IT2-02: Code Review Assistant
- **Systems:** GitHub, GitLab, SonarQube, Vertex AI
- **Trigger:** Event (pull request created)
- **Layer:** 3 (Custom ADK)
- **Integration & Orchestration:** Receive PR webhook, pull diff, run static analysis, post review comments
- **Traditional ML / Analytics:** Code complexity scoring, security pattern matching, test coverage gap analysis, duplicate code detection
- **LLM Reasoning:** Provide contextual code review beyond linting: "This function handles PII but doesn't use the encryption wrapper — required by our data handling policy SEC-014. Also, the error handling swallows exceptions silently — recommend logging with correlation ID for observability."

### IT2-03: Tech Debt Prioritizer
- **Systems:** SonarQube, GitHub, Jira, BigQuery, Vertex AI
- **Trigger:** Scheduled (bi-weekly sprint planning)
- **Layer:** 4 (Data Agent)
- **Integration & Orchestration:** Aggregate code quality metrics, dependency age, security vulnerability counts, incident correlation
- **Traditional ML / Analytics:** Technical debt scoring (code smells × change frequency × incident correlation), dependency risk ranking, refactoring ROI estimation
- **LLM Reasoning:** Prioritize tech debt with business context: "The authentication module has the highest debt score — it's been involved in 4 incidents this quarter and every change takes 3x longer than average. Recommend allocating 20% of next sprint to refactoring the auth layer before adding the SSO feature."

### IT2-04: Release Notes Generator
- **Systems:** GitHub, Jira, Confluence, Vertex AI
- **Trigger:** Event (release tag created)
- **Layer:** 1 (OOTB)
- **Integration & Orchestration:** Pull commits since last release, cross-reference Jira tickets, generate release notes
- **Traditional ML / Analytics:** Commit classification (feature/fix/chore), breaking change detection, dependency update tracking
- **LLM Reasoning:** Transform commit messages and Jira tickets into user-facing release notes: "v2.4.0 introduces single sign-on support for enterprise customers (PROJ-1234), fixes a timezone calculation bug in reporting (PROJ-1289), and improves API response times by 30% through query optimization."

### IT2-05: Incident-to-Code Tracer
- **Systems:** PagerDuty, Datadog, GitHub, Jira, BigQuery, Vertex AI
- **Trigger:** Event (incident created)
- **Layer:** 3 (Custom ADK)
- **Integration & Orchestration:** Correlate incident with recent deployments, code changes, and infrastructure events
- **Traditional ML / Analytics:** Deployment-incident correlation, change risk scoring, blast radius estimation, time-to-detection analysis
- **LLM Reasoning:** Trace incident to root cause: "The checkout latency spike started 23 minutes after deployment #4521 which changed the database connection pool config. The new pool size (5→50) is causing connection exhaustion on the read replica. Recommend immediate rollback and right-sizing to 20 connections."

### IT2-06: Dependency Vulnerability Scanner
- **Systems:** Snyk, GitHub Dependabot, NIST NVD, BigQuery, Vertex AI
- **Trigger:** Event (new CVE published) + Scheduled (daily)
- **Layer:** 3 (Custom ADK)
- **HITL:** VP Engineering approval for critical patches
- **Integration & Orchestration:** Scan dependency trees, match against vulnerability databases, create remediation PRs, route critical findings
- **Traditional ML / Analytics:** Exploitability scoring, blast radius analysis (which services use the vulnerable dependency), patch compatibility prediction
- **LLM Reasoning:** Assess real-world impact: "CVE-2024-XXXX affects log4j in our analytics service — but our configuration doesn't use the affected JNDI lookup feature. Risk is low despite the critical CVSS score. Recommend patching in next regular release, not emergency deployment."

### IT2-07: Feature Flag Manager
- **Systems:** LaunchDarkly, GitHub, Datadog, BigQuery, Vertex AI
- **Trigger:** Scheduled (weekly) + Chat
- **Layer:** 2 (Agent Designer)
- **Integration & Orchestration:** Audit feature flags across environments, track stale flags, monitor rollout health
- **Traditional ML / Analytics:** Flag lifecycle analysis, rollout impact measurement (error rate, latency), stale flag detection (flags unchanged >90 days)
- **LLM Reasoning:** Recommend flag cleanup: "17 feature flags have been at 100% rollout for >90 days and should be removed. The new-checkout-flow flag shows a 2.3% conversion improvement — recommend permanent enablement and code cleanup."

### IT2-08: Developer Experience Surveyor
- **Systems:** GitHub, Jira, Slack, BigQuery, Vertex AI
- **Trigger:** Scheduled (monthly)
- **Layer:** 4 (Data Agent)
- **Integration & Orchestration:** Aggregate DORA metrics, developer satisfaction signals, tooling friction points
- **Traditional ML / Analytics:** DORA metrics calculation (deployment frequency, lead time, change failure rate, MTTR), developer productivity scoring, tooling adoption rates
- **LLM Reasoning:** Synthesize quantitative metrics with qualitative feedback: "Deployment frequency improved 25% but developer satisfaction dropped — Slack sentiment analysis shows frustration with the new approval workflow. The 2-hour approval wait is negating the CI/CD speed gains."

### IT2-09: IaC Drift Detector
- **Systems:** Terraform, AWS CloudFormation, GitHub, Vertex AI
- **Trigger:** Scheduled (daily)
- **Layer:** 3 (Custom ADK)
- **Integration & Orchestration:** Run terraform plan against all environments, detect drift between declared and actual state
- **Traditional ML / Analytics:** Drift pattern classification, recurrence detection, blast radius estimation
- **LLM Reasoning:** Explain drift in context: "The production VPC has 3 security group rules that don't match Terraform state — they were added manually during the March 15 incident response. Recommend importing them into Terraform or removing if the incident workaround is no longer needed."

---

## IT3: Infrastructure & Cloud Operations (8 Agents)

### IT3-01: Cloud Cost Optimizer
- **Systems:** AWS Cost Explorer, GCP Billing, Azure Cost Management, Datadog, BigQuery, Vertex AI
- **Trigger:** Scheduled (daily)
- **Layer:** 4 (Data Agent)
- **HITL:** Cloud Architect approval for reservation purchases
- **Integration & Orchestration:** Aggregate multi-cloud spend, identify waste, recommend right-sizing, track savings
- **Traditional ML / Analytics:** Resource utilization analysis, right-sizing recommendations based on p95 usage, reserved instance optimization, spot instance opportunity identification
- **LLM Reasoning:** Contextualize savings: "Dev environment runs 24/7 but is only used during business hours — scheduling shutdown from 8PM-6AM would save $4,200/month. The staging environment has 3 m5.4xlarge instances at 12% CPU utilization — recommend downsizing to m5.xlarge, saving $2,100/month."

### IT3-02: Capacity Planning Agent
- **Systems:** Kubernetes, Datadog, AWS CloudWatch, GCP Monitoring, BigQuery, Vertex AI
- **Trigger:** Scheduled (weekly)
- **Layer:** 4 (Data Agent)
- **Integration & Orchestration:** Pull resource utilization metrics, growth projections, seasonal patterns, planned launches
- **Traditional ML / Analytics:** Time-series forecasting on CPU/memory/storage/network, seasonal decomposition, capacity threshold prediction
- **LLM Reasoning:** Correlate capacity needs with business events: "Black Friday traffic is projected to be 3.2x normal based on last year's pattern and this year's marketing spend increase. Current capacity handles 2.5x. Recommend pre-scaling the order processing cluster by 40% starting November 20."

### IT3-03: Incident Auto-Remediator
- **Systems:** PagerDuty, Datadog, Kubernetes, Terraform, BigQuery, Vertex AI
- **Trigger:** Event (alert fired)
- **Layer:** 3 (Custom ADK)
- **HITL:** SRE Manager approval for production remediation
- **Integration & Orchestration:** Receive alert, diagnose, execute runbook, verify recovery, update incident record
- **Traditional ML / Analytics:** Alert correlation and deduplication, root cause probability ranking, runbook matching based on symptom patterns
- **LLM Reasoning:** Select and adapt remediation: "High memory usage on pod checkout-api-7d4f matches runbook RB-042 (memory leak restart) — but this pod was just deployed 10 minutes ago. This is likely a code regression, not a slow leak. Recommend rollback instead of restart."

### IT3-04: SLO/SLI Monitor & Reporter
- **Systems:** Datadog, PagerDuty, BigQuery, Looker, Vertex AI
- **Trigger:** Scheduled (continuous + weekly report)
- **Layer:** 4 (Data Agent)
- **Integration & Orchestration:** Calculate SLI actuals against SLO targets, track error budget burn rate, generate reliability reports
- **Traditional ML / Analytics:** Error budget burn rate calculation, SLO breach prediction, availability trending, latency percentile analysis
- **LLM Reasoning:** Generate SRE weekly report: "The checkout service consumed 40% of its monthly error budget in the first week due to the March 12 database incident. At current burn rate, the budget will be exhausted by March 22. Recommend a reliability sprint to address the 3 outstanding resilience improvements."

### IT3-05: Kubernetes Cluster Optimizer
- **Systems:** Kubernetes, Datadog, BigQuery, Vertex AI
- **Trigger:** Scheduled (daily)
- **Layer:** 3 (Custom ADK)
- **Integration & Orchestration:** Analyze cluster resource allocation, pod scheduling efficiency, node utilization
- **Traditional ML / Analytics:** Pod right-sizing based on actual usage vs. requests/limits, bin-packing efficiency analysis, HPA tuning recommendations
- **LLM Reasoning:** Explain optimization opportunities: "Cluster prod-east has 40% memory over-provisioned — pods are requesting 2Gi on average but using only 1.1Gi at p99. Reducing requests to 1.5Gi would allow consolidating from 12 nodes to 8, saving $3,400/month."

### IT3-06: Database Performance Advisor
- **Systems:** CloudSQL, BigQuery, Datadog, Vertex AI
- **Trigger:** Event (slow query alert) + Scheduled (weekly)
- **Layer:** 3 (Custom ADK)
- **Integration & Orchestration:** Collect query performance data, analyze slow queries, recommend index changes
- **Traditional ML / Analytics:** Query plan analysis, index usage statistics, connection pool utilization, table growth forecasting
- **LLM Reasoning:** Suggest query optimizations with context: "The top slow query (avg 4.2s) joins orders and order_items without using the composite index on (order_id, status). Adding this index would likely reduce to <100ms based on similar patterns in the inventory service."

### IT3-07: Network & DNS Health Monitor
- **Systems:** SolarWinds, Datadog, AWS Route 53, Palo Alto, Vertex AI
- **Trigger:** Scheduled (continuous)
- **Layer:** 2 (Agent Designer)
- **Integration & Orchestration:** Monitor network latency, DNS resolution, firewall rules, certificate expiry
- **Traditional ML / Analytics:** Latency anomaly detection, traffic pattern analysis, certificate expiry prediction, rule conflict detection
- **LLM Reasoning:** Correlate network issues with business impact: "Intermittent 500ms latency spikes to the payment gateway correlate with the 2PM daily batch job on the analytics cluster — they share the same NAT gateway. Recommend separate NAT gateway for payment traffic."

### IT3-08: Backup & DR Compliance Agent
- **Systems:** AWS Backup, GCP Cloud Storage, Terraform, BigQuery, Vertex AI
- **Trigger:** Scheduled (daily)
- **Layer:** 2 (Agent Designer)
- **Integration & Orchestration:** Verify backup completion, test restore procedures, validate RPO/RTO compliance
- **Traditional ML / Analytics:** Backup success rate tracking, restore time benchmarking, storage growth forecasting, RPO/RTO compliance scoring
- **LLM Reasoning:** Generate DR readiness report: "All tier-1 systems meet RPO targets. The user-uploads S3 bucket hasn't been included in the cross-region backup job since the March migration — this violates our 4-hour RPO requirement. Adding to backup job immediately."

---

## IT4: Cybersecurity & Threat Management (9 Agents)

### IT4-01: Threat Intelligence Aggregator
- **Systems:** CrowdStrike Falcon, Chronicle SIEM, MITRE ATT&CK, Vertex AI
- **Trigger:** Scheduled (continuous)
- **Layer:** 3 (Custom ADK)
- **Integration & Orchestration:** Ingest threat feeds, correlate with internal asset inventory, prioritize threats by relevance
- **Traditional ML / Analytics:** IOC matching, threat actor profiling, attack surface mapping, threat relevance scoring based on tech stack
- **LLM Reasoning:** Contextualize threats: "New APT campaign targeting healthcare SaaS companies using log4j — we patched log4j in December but 2 internal tools still use the vulnerable version. Escalating to remediation with specific service list and business impact assessment."

### IT4-02: Vulnerability Prioritization Agent
- **Systems:** Qualys, Tenable, Snyk, CrowdStrike, BigQuery, Vertex AI
- **Trigger:** Scheduled (daily)
- **Layer:** 4 (Data Agent)
- **Integration & Orchestration:** Aggregate vulnerability scans from infrastructure, application, and container scanners. Deduplicate and prioritize.
- **Traditional ML / Analytics:** CVSS enrichment with exploitability data (EPSS), asset criticality weighting, patch availability scoring, exposure analysis
- **LLM Reasoning:** Risk-contextualize findings: "We have 2,400 open vulnerabilities — but only 47 are on internet-facing assets with known exploits. Of those, 12 are on the payment processing stack. Recommend focusing the patch sprint on these 12 critical items first."

### IT4-03: SIEM Alert Triage Agent
- **Systems:** Chronicle SIEM, CrowdStrike, Splunk, Vertex AI
- **Trigger:** Event (SIEM alert)
- **Layer:** 3 (Custom ADK)
- **HITL:** Security Analyst review for confirmed incidents
- **Integration & Orchestration:** Receive alert, enrich with asset/user context, correlate with other signals, classify severity
- **Traditional ML / Analytics:** Alert correlation and clustering, false positive scoring based on historical analyst decisions, user behavior baseline comparison
- **LLM Reasoning:** Triage with context: "Alert: impossible travel — user logged in from NYC and London within 1 hour. Checking context: the user has a VPN client configured for London office and their Slack status shows 'working from NYC.' This is a VPN routing artifact, not credential compromise. Auto-close with evidence."

### IT4-04: Phishing & Email Threat Analyzer
- **Systems:** Google Workspace, CrowdStrike, Chronicle, Vertex AI
- **Trigger:** Event (user reports phishing)
- **Layer:** 3 (Custom ADK)
- **Integration & Orchestration:** Receive reported email, extract IOCs (URLs, attachments, sender info), check against threat intel, quarantine if confirmed
- **Traditional ML / Analytics:** URL reputation scoring, attachment sandboxing, sender domain analysis, email header anomaly detection
- **LLM Reasoning:** Analyze sophisticated phishing: "This email impersonates the CFO requesting a wire transfer — the domain is cfo@company-finance.com (not company.com). The writing style matches public LinkedIn posts from our CFO. Confirmed BEC attempt. Quarantining across all mailboxes and notifying the security team."

### IT4-05: Identity & Access Anomaly Detector
- **Systems:** Okta, Google Workspace, CrowdStrike, Chronicle, BigQuery, Vertex AI
- **Trigger:** Event (anomalous access detected) + Scheduled (daily review)
- **Layer:** 3 (Custom ADK)
- **HITL:** CISO review for access revocation
- **Integration & Orchestration:** Monitor authentication events, correlate with HR data (terminations, role changes), detect anomalous patterns
- **Traditional ML / Analytics:** User behavior analytics (UBA), login time/location clustering, privilege escalation detection, dormant account identification
- **LLM Reasoning:** Contextualize anomalies: "Former contractor's Okta account is still active 30 days after contract end — they accessed 3 repos last week. Cross-referencing with HR: termination was processed but IT offboarding ticket was never created. Recommend immediate access revocation and audit of accessed resources."

### IT4-06: Compliance Posture Scanner
- **Systems:** Qualys, CrowdStrike, AWS Security Hub, GCP Security Command Center, Vertex AI
- **Trigger:** Scheduled (weekly)
- **Layer:** 4 (Data Agent)
- **Integration & Orchestration:** Run compliance checks against CIS benchmarks, SOC 2 controls, internal policies, aggregate findings
- **Traditional ML / Analytics:** Compliance drift detection, control effectiveness scoring, remediation time trending, benchmark gap analysis
- **LLM Reasoning:** Generate compliance narrative: "SOC 2 readiness is at 94% — the 6% gap is concentrated in access review controls (CC6.1, CC6.3). 15 service accounts lack quarterly review evidence. Recommend an immediate access review sprint before the September audit."

### IT4-07: Penetration Test Findings Tracker
- **Systems:** Jira, HackerOne, BigQuery, Vertex AI
- **Trigger:** Event (pentest report uploaded) + Scheduled (weekly tracking)
- **Layer:** 2 (Agent Designer)
- **Integration & Orchestration:** Parse pentest reports, create Jira tickets for findings, track remediation, verify fixes
- **Traditional ML / Analytics:** Finding severity trending, remediation SLA tracking, retest pass/fail rates, recurring vulnerability pattern detection
- **LLM Reasoning:** Prioritize findings with business context: "The pentest found 23 issues — 2 critical (SQL injection in legacy admin panel, SSRF in image processor). The admin panel is scheduled for decommission in 6 weeks — recommend WAF rule as interim mitigation rather than patching legacy code."

### IT4-08: Security Incident Responder
- **Systems:** CrowdStrike, Chronicle, PagerDuty, Splunk, Slack, Vertex AI
- **Trigger:** Event (security incident declared)
- **Layer:** 3 (Custom ADK)
- **HITL:** CISO approval for containment actions
- **Integration & Orchestration:** Activate incident response playbook, isolate affected systems, collect forensic data, coordinate response team
- **Traditional ML / Analytics:** Attack kill chain mapping, lateral movement detection, IOC correlation across systems, timeline reconstruction
- **LLM Reasoning:** Guide incident response: "Ransomware detected on 3 workstations in the marketing department — lateral movement analysis shows no spread to servers. The initial vector was a malicious macro in a Word document received via email. Containment actions: isolate affected machines, block sender domain org-wide, scan all endpoints for IOCs."

### IT4-09: Zero Trust Policy Evaluator
- **Systems:** Okta, Palo Alto Prisma, Google BeyondCorp, Vertex AI
- **Trigger:** Scheduled (monthly) + Chat
- **Layer:** 3 (Custom ADK)
- **Integration & Orchestration:** Evaluate access policies against zero trust principles, identify gaps, recommend improvements
- **Traditional ML / Analytics:** Access pattern analysis, least-privilege scoring, policy overlap detection, micro-segmentation coverage mapping
- **LLM Reasoning:** Assess zero trust maturity: "Current zero trust coverage is at 72%. Major gaps: 15 legacy applications still use VPN-based access without device posture checks, and 3 internal APIs accept traffic from any internal IP without identity verification. Recommend prioritizing the 5 applications that handle PII."

---

## IT5: IT Service Management — ITSM (8 Agents)

### IT5-01: Intelligent Ticket Router
- **Systems:** ServiceNow, Jira Service Management, Slack, Vertex AI
- **Trigger:** Event (ticket created)
- **Layer:** 2 (Agent Designer)
- **Integration & Orchestration:** Receive ticket, classify category/priority/assignment group, route to appropriate team
- **Traditional ML / Analytics:** Ticket classification model trained on historical data, priority prediction, assignment group recommendation based on skillset matching
- **LLM Reasoning:** Understand ticket context: "User says 'my laptop is frozen and I have a board presentation in 30 minutes' — classify as P1 (VIP impact), route to deskside support, not the general queue. Also trigger the executive support protocol for same-day device swap."

### IT5-02: Knowledge Base Auto-Resolver
- **Systems:** ServiceNow, Confluence, Google Workspace, Vertex AI
- **Trigger:** Event (ticket created) + Chat
- **Layer:** 1 (OOTB)
- **Integration & Orchestration:** Search knowledge base for matching resolutions, provide self-service answer, auto-close if resolved
- **Traditional ML / Analytics:** Article relevance scoring, resolution success rate tracking, knowledge gap identification
- **LLM Reasoning:** Provide contextual answers: "User asks 'how do I connect to the VPN from my new Mac' — retrieve the macOS VPN setup guide, but also note the recent change: 'Since March 2024, use the GlobalProtect client instead of Cisco AnyConnect. Download link and setup instructions attached.'"

### IT5-03: SLA Breach Predictor
- **Systems:** ServiceNow, BigQuery, Vertex AI
- **Trigger:** Scheduled (hourly)
- **Layer:** 4 (Data Agent)
- **Integration & Orchestration:** Monitor open tickets, calculate time-to-breach, alert teams on approaching SLA violations
- **Traditional ML / Analytics:** Time-to-resolution prediction based on ticket complexity, assignee workload, and historical patterns. SLA breach probability scoring.
- **LLM Reasoning:** Contextualize risk: "12 tickets are predicted to breach P2 SLA in the next 4 hours — 8 are VPN issues that correlate with the ISP outage reported this morning. Recommend bulk communication to affected users and temporary SLA pause for ISP-related tickets."

### IT5-04: Change Risk Assessor
- **Systems:** ServiceNow Change Management, Jira, GitHub, Datadog, Vertex AI
- **Trigger:** Event (change request submitted)
- **Layer:** 3 (Custom ADK)
- **HITL:** Change Advisory Board (CAB) approval for high-risk changes
- **Integration & Orchestration:** Assess change impact, check for conflicts with other changes, evaluate deployment window, score risk
- **Traditional ML / Analytics:** Change failure rate prediction, conflict detection, blast radius estimation, optimal deployment window recommendation
- **LLM Reasoning:** Assess change holistically: "This database schema migration affects 4 microservices — 2 have active feature flags that depend on the old schema. Risk score: High. Recommend coordinating with the feature flag owners and scheduling for the low-traffic maintenance window on Sunday 2AM."

### IT5-05: Major Incident Coordinator
- **Systems:** PagerDuty, ServiceNow, Slack, Zoom, Datadog, Vertex AI
- **Trigger:** Event (major incident declared)
- **Layer:** 3 (Custom ADK)
- **HITL:** SRE Manager for escalation decisions
- **Integration & Orchestration:** Activate war room, page on-call engineers, start status page, coordinate communications
- **Traditional ML / Analytics:** Incident correlation with recent changes, affected service mapping, customer impact estimation
- **LLM Reasoning:** Coordinate response: "Major incident on the payment processing service — assembling war room with the payments team, SRE, and database team. Status page updated: 'Payment processing is experiencing delays — estimated resolution 45 minutes.' Internal update every 15 minutes."

### IT5-06: Problem Management Analyzer
- **Systems:** ServiceNow, BigQuery, Datadog, Vertex AI
- **Trigger:** Scheduled (weekly)
- **Layer:** 4 (Data Agent)
- **Integration & Orchestration:** Analyze incident patterns, identify recurring issues, create problem tickets, track root cause elimination
- **Traditional ML / Analytics:** Incident clustering, repeat incident detection, MTTR trending, root cause category analysis
- **LLM Reasoning:** Identify systemic issues: "The same 'database connection timeout' error has caused 7 P2 incidents across 3 services in the last month. Root cause analysis: all 3 services share a connection pool to the orders database, which has grown 40% since January. Recommend increasing max connections and investigating query optimization."

### IT5-07: Service Catalog Recommender
- **Systems:** ServiceNow, Okta, BigQuery, Vertex AI
- **Trigger:** Chat
- **Layer:** 1 (OOTB)
- **Integration & Orchestration:** Present available services based on user role, department, and past requests
- **Traditional ML / Analytics:** Service recommendation based on role/department patterns, popular request trending, seasonal demand prediction
- **LLM Reasoning:** Guide users: "You're a new hire in Engineering — based on your role, you'll likely need: GitHub access (auto-provisioned), AWS console access (request via this link), and a JetBrains license (your manager can approve). Would you like me to submit these requests?"

### IT5-08: ITSM Analytics Dashboard
- **Systems:** ServiceNow, BigQuery, Looker, Vertex AI
- **Trigger:** Scheduled (weekly)
- **Layer:** 4 (Data Agent)
- **Integration & Orchestration:** Aggregate ITSM metrics across incident, request, change, and problem management
- **Traditional ML / Analytics:** Volume trending, SLA performance, CSAT analysis, first-contact resolution rate, agent productivity metrics
- **LLM Reasoning:** Generate weekly ITSM report: "Ticket volume increased 15% this week — driven by the Okta MFA rollout (120 password reset tickets). Excluding the MFA spike, underlying volume is flat. CSAT improved to 4.3/5.0 after the knowledge base refresh. Recommend adding MFA troubleshooting articles to reduce repeat tickets."

---

## IT6: Data & AI Platform (7 Agents)

### IT6-01: Data Pipeline Health Monitor
- **Systems:** Apache Airflow, dbt, BigQuery, Datadog, Vertex AI
- **Trigger:** Event (pipeline failure) + Scheduled (daily)
- **Layer:** 3 (Custom ADK)
- **Integration & Orchestration:** Monitor DAG execution, data freshness, row count anomalies, schema changes
- **Traditional ML / Analytics:** Pipeline failure prediction, data freshness SLA tracking, row count anomaly detection, DAG dependency analysis
- **LLM Reasoning:** Diagnose failures: "The customer_360 pipeline failed at the transform step — the upstream marketing_events table has a new column 'campaign_type' that broke the dbt model schema test. Auto-generated fix: add the column to the staging model with a default value."

### IT6-02: Data Quality Scorecard
- **Systems:** Great Expectations, dbt, BigQuery, Vertex AI
- **Trigger:** Scheduled (daily)
- **Layer:** 4 (Data Agent)
- **Integration & Orchestration:** Run data quality checks, calculate domain-level quality scores, alert on degradation
- **Traditional ML / Analytics:** Quality metric tracking (completeness, accuracy, consistency, timeliness), trend detection, root cause correlation
- **LLM Reasoning:** Contextualize quality issues: "The customer email completeness score dropped from 98% to 91% this week — the drop correlates with the new self-service registration flow that made email optional. Recommend making email required or flagging incomplete records for enrichment."

### IT6-03: ML Model Registry & Monitor
- **Systems:** Vertex AI Model Registry, MLflow, BigQuery, Datadog, Vertex AI
- **Trigger:** Scheduled (daily) + Event (model deployment)
- **Layer:** 3 (Custom ADK)
- **HITL:** Data Platform Lead approval for production model deployments
- **Integration & Orchestration:** Track model versions, monitor prediction quality, detect drift, manage A/B experiments
- **Traditional ML / Analytics:** Model performance tracking (accuracy, precision, recall, AUC), data drift detection, prediction distribution monitoring, feature importance analysis
- **LLM Reasoning:** Explain model health: "The customer churn model's precision dropped from 85% to 72% this month — feature importance analysis shows the 'contract_renewal_date' feature shifted distribution after the new billing system migration. Recommend retraining with the updated data or engineering a new feature from the new system."

### IT6-04: Feature Store Manager
- **Systems:** Vertex AI Feature Store, BigQuery, Vertex AI
- **Trigger:** Scheduled (weekly) + Chat
- **Layer:** 3 (Custom ADK)
- **Integration & Orchestration:** Manage feature definitions, track usage across models, ensure freshness, handle access requests
- **Traditional ML / Analytics:** Feature usage analysis, freshness monitoring, coverage tracking, redundancy detection
- **LLM Reasoning:** Guide feature reuse: "You're building a customer lifetime value model — the feature store already has 23 customer features used by the churn model, including recency, frequency, and monetary value. Recommend reusing these rather than recreating to ensure consistency."

### IT6-05: Cost-per-Query Optimizer
- **Systems:** BigQuery, Datadog, BigQuery Admin, Vertex AI
- **Trigger:** Scheduled (daily)
- **Layer:** 4 (Data Agent)
- **Integration & Orchestration:** Analyze query patterns, identify expensive queries, recommend optimization, track savings
- **Traditional ML / Analytics:** Query cost ranking, table scan analysis, caching opportunity identification, partition/cluster recommendation
- **LLM Reasoning:** Recommend optimizations: "The top 10 most expensive queries account for 60% of BigQuery spend. Query #1 scans the full events table (2TB) daily but only needs the last 7 days — adding a date partition filter would reduce cost from $50/run to $2.50/run."

### IT6-06: Data Catalog & Lineage Agent
- **Systems:** Google Dataplex, dbt, BigQuery, Vertex AI
- **Trigger:** Chat + Event (new table created)
- **Layer:** 2 (Agent Designer)
- **Integration & Orchestration:** Auto-catalog new datasets, track column-level lineage, answer "where does this data come from?" queries
- **Traditional ML / Analytics:** Lineage graph construction, usage pattern analysis, classification of PII/sensitive columns
- **LLM Reasoning:** Answer data discovery questions: "Looking for customer revenue data? The canonical source is `dwh.dim_customer` joined with `dwh.fact_orders`. Don't use `staging.raw_orders` directly — it's pre-deduplication and includes test transactions. The revenue field flows from Stripe → raw_payments → fact_orders.revenue_usd."

### IT6-07: AI Ethics & Bias Monitor
- **Systems:** Vertex AI, BigQuery, Vertex AI
- **Trigger:** Scheduled (weekly) + Event (model deployment)
- **Layer:** 3 (Custom ADK)
- **HITL:** Data Platform Lead review for bias findings
- **Integration & Orchestration:** Run fairness checks on deployed models, track bias metrics across protected attributes, generate reports
- **Traditional ML / Analytics:** Disparate impact analysis, equalized odds checking, prediction parity across demographic groups, fairness metric trending
- **LLM Reasoning:** Contextualize bias findings: "The loan approval model shows 15% lower approval rate for applicants in zip codes with >60% minority population. After controlling for income and credit score, the disparity reduces to 3% — but the residual gap warrants investigation. Recommend removing zip code as a direct feature and using income-normalized alternatives."

---

## IT7: Enterprise Architecture (7 Agents)

### IT7-01: Architecture Decision Record (ADR) Drafter
- **Systems:** Confluence, GitHub, Vertex AI
- **Trigger:** Chat + Event (architecture review requested)
- **Layer:** 1 (OOTB)
- **Integration & Orchestration:** Pull context from existing ADRs, system catalog, and technology radar to draft new ADRs
- **Traditional ML / Analytics:** Related ADR retrieval, technology precedent analysis, pattern matching against reference architectures
- **LLM Reasoning:** Draft comprehensive ADRs: "Decision: Use event-driven architecture for order processing. Context: Current synchronous REST calls cause cascading failures during peak load. Options evaluated: (1) Event-driven with Pub/Sub, (2) Async REST with retries, (3) Service mesh with circuit breakers. Recommendation: Option 1 — provides decoupling and natural backpressure."

### IT7-02: API Catalog & Governance Agent
- **Systems:** Apigee, GitHub, Swagger/OpenAPI, BigQuery, Vertex AI
- **Trigger:** Event (new API registered) + Scheduled (weekly)
- **Layer:** 2 (Agent Designer)
- **Integration & Orchestration:** Catalog APIs, enforce naming conventions, check versioning policies, track usage and deprecation
- **Traditional ML / Analytics:** API usage trending, versioning compliance scoring, breaking change detection, consumer dependency mapping
- **LLM Reasoning:** Review API design: "The new /users endpoint returns nested objects 5 levels deep — this violates our API design guideline of max 3 levels. Recommend flattening the address and preferences objects into separate endpoints. Also, the field 'usr_nm' should be 'user_name' per naming conventions."

### IT7-03: System Dependency Mapper
- **Systems:** ServiceNow CMDB, Datadog APM, GitHub, BigQuery, Vertex AI
- **Trigger:** Scheduled (weekly)
- **Layer:** 4 (Data Agent)
- **Integration & Orchestration:** Build and maintain system dependency graph from APM traces, CMDB records, and code analysis
- **Traditional ML / Analytics:** Dependency graph construction, critical path identification, single-point-of-failure detection, change blast radius calculation
- **LLM Reasoning:** Explain dependencies: "The checkout service has 12 downstream dependencies — but only 3 are critical path (payment gateway, inventory, pricing). The other 9 (analytics, recommendations, etc.) should be called asynchronously. Current architecture makes all 12 synchronous — any failure cascades to checkout."

### IT7-04: Technology Lifecycle Manager
- **Systems:** ServiceNow SAM, CMDB, BigQuery, Vertex AI
- **Trigger:** Scheduled (quarterly)
- **Layer:** 3 (Custom ADK)
- **HITL:** Enterprise Architect approval for sunset decisions
- **Integration & Orchestration:** Track technology versions, EOL dates, migration paths, update cost estimates
- **Traditional ML / Analytics:** Technology age distribution analysis, EOL risk scoring, migration effort estimation, license cost trending
- **LLM Reasoning:** Plan technology transitions: "Java 11 reaches EOL in September — 47 microservices still use it. Migration effort estimated at 2-4 weeks per service. Recommend prioritizing the 12 internet-facing services first, then migrating the remaining 35 in Q4. The payment-service requires special attention due to its cryptographic library dependencies."

### IT7-05: Integration Pattern Advisor
- **Systems:** Apigee, Pub/Sub, BigQuery, Confluence, Vertex AI
- **Trigger:** Chat
- **Layer:** 1 (OOTB)
- **Integration & Orchestration:** Query integration catalog, retrieve relevant patterns, provide recommendations
- **Traditional ML / Analytics:** Pattern usage analysis, performance benchmarking of integration approaches
- **LLM Reasoning:** Recommend integration approaches: "For the CRM-to-ERP order sync, recommend the event-driven pattern with Pub/Sub over batch file transfer. Your volume (5K orders/day) and latency requirement (<5 min) fit the event pattern well. Here's the reference architecture from our 2024 inventory sync implementation."

### IT7-06: Architecture Compliance Scanner
- **Systems:** GitHub, SonarQube, Datadog, CMDB, Vertex AI
- **Trigger:** Scheduled (weekly) + Event (architecture review)
- **Layer:** 3 (Custom ADK)
- **Integration & Orchestration:** Scan codebases and infrastructure against architecture guardrails, flag violations
- **Traditional ML / Analytics:** Pattern violation detection, architectural drift scoring, dependency rule checking, naming convention compliance
- **LLM Reasoning:** Explain violations with remediation: "The new analytics-service directly queries the orders database instead of going through the orders-api — violating our service boundary principle. This creates a hidden coupling that bypasses the API's data validation. Recommend using the /orders/export endpoint or creating a dedicated analytics view."

### IT7-07: Reference Architecture Generator
- **Systems:** Confluence, GitHub, draw.io, Vertex AI
- **Trigger:** Chat
- **Layer:** 1 (OOTB)
- **Integration & Orchestration:** Pull existing architecture patterns, technology standards, and constraints to generate reference architectures
- **Traditional ML / Analytics:** Template matching, technology stack recommendation based on requirements
- **LLM Reasoning:** Generate architecture proposals: "For a real-time event processing system handling 10K events/sec: Recommend Pub/Sub for ingestion, Cloud Dataflow for processing, BigQuery for analytics, and Looker for visualization. Here's the reference architecture with cost estimates at 10K, 50K, and 100K events/sec."

---

## IT8: IT Governance & Compliance (7 Agents)

### IT8-01: IT Control Testing Agent
- **Systems:** ServiceNow GRC, BigQuery, Vertex AI
- **Trigger:** Scheduled (quarterly)
- **Layer:** 3 (Custom ADK)
- **HITL:** Compliance & GRC Lead approval on test results
- **Integration & Orchestration:** Execute automated control tests, collect evidence, generate test workpapers, track remediation
- **Traditional ML / Analytics:** Control effectiveness scoring, test result trending, remediation SLA tracking, risk-based test prioritization
- **LLM Reasoning:** Assess control evidence: "Access review control IT-AC-03: 95% of reviews completed on time, but 12 service accounts were excluded because they 'don't have interactive users.' These still require review per SOC 2 CC6.1 — marking control as partially effective with remediation required."

### IT8-02: Audit Evidence Collector
- **Systems:** ServiceNow GRC, Google Drive, Slack, Jira, Vertex AI
- **Trigger:** Event (audit evidence request) + Scheduled (pre-audit)
- **Layer:** 2 (Agent Designer)
- **Integration & Orchestration:** Map audit requests to evidence sources, auto-collect artifacts, organize in audit-ready format
- **Traditional ML / Analytics:** Evidence freshness tracking, coverage gap identification, collection time optimization
- **LLM Reasoning:** Interpret audit requests: "The auditor asks for 'evidence of change management process for infrastructure changes.' Collecting: last quarter's CAB meeting minutes, sample of 10 change tickets with approval chains, the change management policy document, and deployment logs showing the approval-before-deploy workflow."

### IT8-03: Policy Lifecycle Manager
- **Systems:** Confluence, ServiceNow, Google Workspace, Vertex AI
- **Trigger:** Scheduled (quarterly review cycle) + Event (regulatory change)
- **Layer:** 2 (Agent Designer)
- **Integration & Orchestration:** Track policy review dates, distribute for review, collect approvals, publish updates, notify affected teams
- **Traditional ML / Analytics:** Policy coverage mapping, review completion tracking, acknowledgment rates, exception trending
- **LLM Reasoning:** Draft policy updates: "The new EU AI Act requires disclosure when customers interact with AI systems. Updating the Acceptable Use Policy section 4.3 to require AI interaction notices for all customer-facing agents. Also updating the Data Classification Policy to add 'AI Training Data' as a new classification category."

### IT8-04: License Compliance Monitor
- **Systems:** ServiceNow SAM, Zylo, Okta, BigQuery, Vertex AI
- **Trigger:** Scheduled (monthly)
- **Layer:** 4 (Data Agent)
- **Integration & Orchestration:** Compare license entitlements against actual usage, identify over/under-licensing, track true-up obligations
- **Traditional ML / Analytics:** Usage vs. entitlement gap analysis, true-up cost forecasting, license optimization modeling, audit risk scoring
- **LLM Reasoning:** Assess compliance risk: "Oracle audit notice received — current usage shows 480 processor cores vs. 400 licensed. The overage started in March when the analytics team spun up a new cluster. True-up cost estimated at $320K. Recommend negotiating a ULA conversion or migrating the analytics workload to BigQuery (6-week effort, $0 license cost)."

### IT8-05: Risk Register Agent
- **Systems:** ServiceNow GRC, BigQuery, Vertex AI
- **Trigger:** Scheduled (monthly) + Event (new risk identified)
- **Layer:** 3 (Custom ADK)
- **HITL:** Compliance & GRC Lead approval on risk ratings
- **Integration & Orchestration:** Maintain IT risk register, track risk treatments, monitor KRIs, generate risk reports
- **Traditional ML / Analytics:** Risk scoring (likelihood × impact), KRI trending, control effectiveness correlation, residual risk calculation
- **LLM Reasoning:** Contextualize risks: "The 'single cloud provider dependency' risk increased from Medium to High — AWS now hosts 85% of workloads (up from 70% last quarter) and the multi-cloud migration is 6 months behind schedule. Recommend accelerating the GCP migration pilot for the analytics platform."

### IT8-06: Regulatory Change Monitor
- **Systems:** Thomson Reuters, BigQuery, Confluence, Vertex AI
- **Trigger:** Scheduled (weekly)
- **Layer:** 3 (Custom ADK)
- **Integration & Orchestration:** Scan regulatory feeds, assess applicability, map to existing controls, notify affected teams
- **Traditional ML / Analytics:** Regulatory relevance scoring, impact classification, control gap identification
- **LLM Reasoning:** Assess regulatory impact: "NIST Cybersecurity Framework 2.0 released — 3 new requirements affect our current posture: (1) supply chain risk management now mandatory (currently optional in our program), (2) continuous monitoring must include AI systems, (3) incident response plans must include ransomware-specific procedures. Estimated effort: 8 weeks across security and GRC teams."

### IT8-07: IT GRC Dashboard & Reporter
- **Systems:** ServiceNow GRC, BigQuery, Looker, Vertex AI
- **Trigger:** Scheduled (monthly)
- **Layer:** 4 (Data Agent)
- **Integration & Orchestration:** Aggregate GRC metrics across risk, compliance, audit, and policy domains
- **Traditional ML / Analytics:** GRC metric trending, compliance score calculation, risk heat map generation, audit finding aging analysis
- **LLM Reasoning:** Generate executive GRC report: "IT compliance posture improved from 88% to 93% this quarter. Key improvements: completed SOC 2 Type II remediation (3 findings closed). Remaining gaps: 2 critical risks without accepted treatment plans and 5 policies overdue for review. Board-ready summary attached."

---

## IT9: End User Computing & Productivity (8 Agents)

### IT9-01: Device Lifecycle Manager
- **Systems:** ManageEngine, Jamf, Google Workspace Admin, BigQuery, Vertex AI
- **Trigger:** Event (device event) + Scheduled (weekly)
- **Layer:** 2 (Agent Designer)
- **Integration & Orchestration:** Track device inventory, manage refresh cycles, coordinate provisioning/deprovisioning with HR events
- **Traditional ML / Analytics:** Device age distribution, failure rate prediction, refresh budget forecasting, warranty expiry tracking
- **LLM Reasoning:** Plan device refresh: "142 laptops are >4 years old — failure rate for 4+ year devices is 3x higher than newer ones. The engineering team's MacBook Pro fleet should be prioritized (28 devices, avg age 4.5 years) as they report 2x more hardware tickets. Recommend phased refresh over Q3-Q4."

### IT9-02: Access Provisioning Orchestrator
- **Systems:** Okta, Google Workspace, ServiceNow, Workday, Vertex AI
- **Trigger:** Event (new hire, role change, termination)
- **Layer:** 2 (Agent Designer)
- **Integration & Orchestration:** Receive HR event, determine access needs based on role/department, provision/modify/revoke across all systems
- **Traditional ML / Analytics:** Role-based access templates, provisioning time tracking, access pattern analysis for role optimization
- **LLM Reasoning:** Handle edge cases: "New hire is a 'Senior Data Engineer' in the 'Platform' team — the role template grants BigQuery and Airflow access, but this hire is specifically for the ML team (noted in the req). Adding Vertex AI and MLflow access per ML team standard, and flagging for the manager to confirm GPU cluster access."

### IT9-03: Workspace Analytics Agent
- **Systems:** Google Workspace, Slack, Zoom, BigQuery, Vertex AI
- **Trigger:** Scheduled (monthly)
- **Layer:** 4 (Data Agent)
- **Integration & Orchestration:** Aggregate productivity tool usage metrics, collaboration patterns, license utilization
- **Traditional ML / Analytics:** Tool adoption curves, collaboration network analysis, meeting load analysis, license utilization scoring
- **LLM Reasoning:** Generate insights: "Google Workspace adoption is at 92%, but Docs usage dropped 15% since the Notion pilot started. 34% of Zoom licenses are unused (users switched to Google Meet). Recommend reducing Zoom licenses from 500 to 330 and formalizing the Notion evaluation before it becomes shadow IT."

### IT9-04: Self-Service IT Bot
- **Systems:** ServiceNow, Okta, Google Workspace, Slack, Vertex AI
- **Trigger:** Chat
- **Layer:** 1 (OOTB)
- **Integration & Orchestration:** Handle common IT requests: password resets, access requests, VPN troubleshooting, printer setup
- **Traditional ML / Analytics:** Intent classification, request routing, resolution success tracking
- **LLM Reasoning:** Conversational IT support: "User: 'I can't access the staging environment.' Bot: Checking your Okta groups — you have production access but staging was removed during the March access review. This looks unintentional since your role requires staging access. I'll submit an access request — your manager will receive an approval notification within 5 minutes."

### IT9-05: Endpoint Security Posture Agent
- **Systems:** CrowdStrike, ManageEngine, Jamf, Okta, Vertex AI
- **Trigger:** Scheduled (daily)
- **Layer:** 3 (Custom ADK)
- **Integration & Orchestration:** Scan endpoint compliance (OS patches, encryption, antivirus, screen lock), flag non-compliant devices
- **Traditional ML / Analytics:** Compliance rate trending, vulnerability exposure time tracking, patch success rate analysis
- **LLM Reasoning:** Prioritize remediation: "47 endpoints are non-compliant — 12 are missing the critical March security patch (10 are remote workers who haven't connected to VPN in 2 weeks). The remaining 35 have disabled disk encryption after the recent OS update. Recommend force-pushing the patch to VPN-connected devices and sending a targeted email to the 10 remote workers."

### IT9-06: Meeting Room & Resource Optimizer
- **Systems:** Google Calendar, Google Workspace, BigQuery, Vertex AI
- **Trigger:** Scheduled (weekly)
- **Layer:** 4 (Data Agent)
- **Integration & Orchestration:** Analyze room booking patterns, no-show rates, capacity utilization
- **Traditional ML / Analytics:** Room utilization analysis, no-show prediction, peak hour identification, capacity right-sizing
- **LLM Reasoning:** Recommend optimizations: "The 20-person boardroom is booked 85% of the time but actual attendance averages 6 people. Meanwhile, the 8-person huddle rooms have a 40-person waitlist daily. Recommend converting 2 large rooms into 4 huddle spaces — projected to eliminate 80% of room booking complaints."

### IT9-07: Onboarding Tech Setup Orchestrator
- **Systems:** Okta, Google Workspace, ManageEngine, ServiceNow, Workday, Vertex AI
- **Trigger:** Event (new hire start date approaching)
- **Layer:** 2 (Agent Designer)
- **Integration & Orchestration:** 5 days before start: provision accounts, configure laptop, prepare welcome package, schedule IT orientation
- **Traditional ML / Analytics:** Setup completion tracking, first-day readiness scoring, common setup issues prediction
- **LLM Reasoning:** Personalize onboarding: "New engineering hire starting Monday — standard setup plus: GitHub org invite, IDE license (JetBrains per team standard), VPN profile for the dev environment, and Slack channel invites for #engineering, #deployments, and #team-platform. Generated a personalized IT welcome guide with links to the developer handbook and architecture overview."

### IT9-08: Shadow IT Detector
- **Systems:** Okta, Google Workspace, Palo Alto, CrowdStrike, BigQuery, Vertex AI
- **Trigger:** Scheduled (weekly)
- **Layer:** 3 (Custom ADK)
- **HITL:** End User Support Lead review for policy decisions
- **Integration & Orchestration:** Analyze SSO bypass attempts, unsanctioned app usage, unapproved browser extensions, unauthorized cloud storage
- **Traditional ML / Analytics:** Unsanctioned app detection from network traffic, OAuth token analysis, browser extension risk scoring, data exfiltration pattern detection
- **LLM Reasoning:** Assess shadow IT risk: "Detected 23 users accessing a new AI transcription service (Otter.ai) via OAuth — it has access to Google Calendar and Drive. The service processes meeting recordings which may contain confidential information. Recommend: (1) evaluate for official adoption or (2) block and offer the approved Gemini-based alternative."

---

## Day-in-Life Scenarios

### DevOps Lead
The DevOps Lead keeps the build-ship-run engine running — managing CI/CD pipelines, deployment velocity, infrastructure as code, and developer experience across 50+ microservices.

| Time | Current State | Agent Opportunity |
|------|---------------|-------------------|
| 8:00 | Checking overnight build failures across 12 repos — manually reading logs to find root causes | CI/CD Pipeline Optimizer already diagnosed 3 failures: 2 flaky tests (auto-quarantined) and 1 genuine regression with the failing commit identified |
| 9:00 | Running terraform plan manually across 4 environments to check for drift after last night's incident response | IaC Drift Detector found 5 manual changes from the incident — generated PRs to import them into Terraform state |
| 10:00 | Sprint planning: estimating which tech debt items to tackle based on gut feel about code quality | Tech Debt Prioritizer ranked items by incident correlation and change velocity — the auth module refactor would prevent 4 incidents/quarter |
| 11:00 | Reviewing 8 pull requests — trying to catch security issues and architectural violations in the code | Code Review Assistant flagged a PII handling violation and an API design inconsistency; approved 5 PRs with no issues |
| 1:00 | Manually writing release notes by reading through 40 commits and cross-referencing Jira tickets | Release Notes Generator produced user-facing notes, internal changelog, and breaking change warnings automatically |
| 2:30 | Investigating why deployment frequency dropped this sprint — querying Jira and GitHub for clues | Developer Experience Surveyor pinpointed the cause: the new 2-hour approval wait is the bottleneck, not code velocity |
| 4:00 | Manually updating feature flags after a successful rollout — checking each environment one by one | Feature Flag Manager identified 17 stale flags and generated cleanup PRs with evidence of successful rollout |

### Security Analyst
The Security Analyst monitors threats, triages alerts, investigates incidents, and ensures the organization's security posture stays ahead of evolving threats.

| Time | Current State | Agent Opportunity |
|------|---------------|-------------------|
| 8:00 | Reviewing 200+ overnight SIEM alerts — 90% are false positives but each requires manual investigation | SIEM Alert Triage Agent auto-classified 185 alerts (92%) as benign with evidence — surfaced 15 for human review |
| 9:00 | Researching a new ransomware campaign reported in threat feeds — manually checking if our systems are vulnerable | Threat Intelligence Aggregator already correlated the campaign IOCs against our asset inventory — 2 systems need immediate patching |
| 10:00 | Running vulnerability scan reports — trying to prioritize 2,400 findings with limited team capacity | Vulnerability Prioritization Agent filtered to 47 exploitable findings on internet-facing assets — 12 on the payment stack are critical |
| 11:00 | Investigating a suspicious login alert — checking IP geolocation, VPN logs, and user behavior manually | Identity & Access Anomaly Detector enriched the alert: former contractor account still active 30 days post-termination, recommending immediate revocation |
| 1:00 | Reviewing a phishing report from an employee — manually checking URLs, headers, and attachment hashes | Phishing Analyzer identified a BEC attempt impersonating the CFO, quarantined across all mailboxes within 3 minutes |
| 2:30 | Preparing the quarterly SOC 2 evidence package — gathering screenshots and logs from 15 different systems | Compliance Posture Scanner generated the evidence package automatically — flagged 3 control gaps needing remediation |
| 4:00 | Reviewing zero trust policy exceptions — checking if temporary VPN access grants should be revoked | Zero Trust Policy Evaluator identified 15 legacy apps still using VPN-only access and recommended migration priorities |

### IT Service Desk Manager
The IT Service Desk Manager keeps the support engine running — ensuring SLA compliance, optimizing agent workloads, and driving self-service adoption to reduce ticket volume.

| Time | Current State | Agent Opportunity |
|------|---------------|-------------------|
| 8:00 | Reviewing overnight ticket queue — manually categorizing and routing 45 tickets to the right teams | Intelligent Ticket Router auto-classified and routed 40 tickets, escalated 5 that needed human judgment |
| 9:00 | An employee can't access the VPN — walking them through troubleshooting steps over chat for 25 minutes | Self-Service IT Bot resolved the VPN issue in 2 minutes with guided troubleshooting — the client certificate had expired |
| 10:00 | Checking SLA dashboards and manually flagging tickets approaching breach — calling agents to reprioritize | SLA Breach Predictor proactively alerted on 12 tickets predicted to breach in 4 hours — 8 were VPN issues from the ISP outage |
| 11:00 | A major incident is declared — scrambling to set up a war room, page engineers, and update the status page | Major Incident Coordinator assembled the war room, paged the right teams, and started status page updates automatically |
| 1:00 | Reviewing the change calendar for next week — manually checking for conflicts between 15 change requests | Change Risk Assessor identified 2 conflicting changes and a high-risk database migration needing CAB review |
| 2:30 | Updating the knowledge base — an agent solved a tricky printer issue and the fix needs to be documented | Knowledge Base Auto-Resolver detected the resolution pattern and auto-generated a KB article from the ticket resolution |
| 4:00 | Preparing the weekly ITSM report — pulling metrics from ServiceNow and formatting in Google Slides | ITSM Analytics Dashboard generated the report with commentary: ticket volume up 15% due to MFA rollout, CSAT improved to 4.3 |

---

## RACI Matrix

| Persona | IT1 | IT2 | IT3 | IT4 | IT5 | IT6 | IT7 | IT8 | IT9 |
|---------|-----|-----|-----|-----|-----|-----|-----|-----|-----|
| CIO / CTO | R | C | C | C | I | C | R | R | I |
| VP Engineering | C | R | C | I | I | C | C | I | I |
| Enterprise Architect | C | C | I | I | I | C | R | C | I |
| DevOps Lead | I | R | R | I | I | I | C | I | I |
| SRE Manager | I | C | R | C | R | I | I | I | I |
| CISO / Security Analyst | I | C | C | R | C | I | I | R | C |
| IT Service Desk Mgr | I | I | I | I | R | I | I | I | C |
| Data Platform Lead | I | I | I | I | I | R | C | I | I |
| Cloud Architect | C | I | R | C | I | C | R | I | I |
| IT Vendor Mgr | R | I | C | I | I | I | I | C | C |
| GRC Lead | C | I | I | C | I | I | C | R | I |
| End User Support Lead | I | I | I | I | C | I | I | I | R |

---

## Tech Landscape

### As-Is
| Category | Tools |
|----------|-------|
| DevOps | Jenkins, GitHub/GitLab, ArgoCD, Terraform |
| Cloud | AWS, GCP, Azure |
| Monitoring | Datadog, Splunk, PagerDuty |
| Security | CrowdStrike, Palo Alto, Okta, Qualys, Tenable, Snyk |
| ITSM | ServiceNow, Jira Service Management |
| Data | BigQuery, Airflow, dbt, Vertex AI |
| Endpoint | ManageEngine, Jamf |
| Productivity | Google Workspace, Slack, Zoom |
| Architecture | Confluence, Apigee, ServiceNow CMDB |

### To-Be
| Layer | Description |
|-------|-------------|
| Source Systems | DevOps, Cloud, Security, ITSM, Data, Endpoint, Productivity — connected via APIs and event streams |
| Gemini Enterprise Agent Layer | 70 autonomous agents across 9 domains — Strategize → Build → Run → Secure → Support → Platform → Architect → Govern → Enable |
| Unified IT Data Lake | BigQuery — single source of truth for all IT operational data, metrics, and compliance artifacts |
| Insights & Actions | Real-time dashboards, proactive alerting, automated remediation, architecture governance |

**Pain Point:** 60% of IT time spent on firefighting, manual ticket routing, alert fatigue, and audit evidence collection
**Benefit:** Proactive operations, <15min MTTR, automated compliance, self-healing infrastructure, 80% self-service resolution
