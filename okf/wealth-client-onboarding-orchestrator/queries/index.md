---
type: Index
title: Query Capabilities
description: "The questions and requests this agent can answer, each with the tools it uses."
timestamp: "2026-07-04T00:00:00.000Z"
---

# Query Capabilities

- [Pull new client_households and financial_accounts records from Salesforce Financial Services Cloud alongside envelopes and recipients from DocuSign, and flag missing signatures or custodian formatting defects before an application packet is ever routed for signature.](/queries/application-intake-nigo-triage.md)
- [Check advisory_referrals suitability_status, investment_time_horizon, and liquidity_needs against the linked client_households risk_tolerance, investment_objective, and accredited_investor flag, citing the Wealth Client Onboarding Orchestrator Banking Compliance Policy before clearing a packet to fund.](/queries/suitability-reg-bi-accreditation-verification.md)
- [Compare current financial_accounts state against BigQuery historical_metrics, cached_aggregates, and analytics_events to detect transfers stalled past the custodian's expected window, matching envelope and audit_trails status in DocuSign for corroborating evidence.](/queries/acat-custodian-transfer-tracking.md)
- [Execute action_salesforce_financial_services_cloud_publish once two-system evidence (Salesforce Financial Services Cloud plus DocuSign audit_trails or BigQuery analytics_events) confirms funding, writing the milestone back to Salesforce Financial Services Cloud for the advisor and client portal.](/queries/funded-status-publish-advisor-client-sync.md)
- [Open or update ServiceNow tickets with the custodian rejection reason and a drafted follow-up for stalled transfers or repeat NIGO rejections, so status inquiries are answered from Salesforce Financial Services Cloud instead of routed to the service desk.](/queries/exception-escalation-service-desk-deflection.md)
