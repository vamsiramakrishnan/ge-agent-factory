---
type: Workflow Stage
title: "Recovery Outreach Drafting & Routing"
description: "Draft the personalized recovery outreach using Zendesk macros, attach the concrete remedy, and assign the case owner in Genesys Cloud CX with a response-time SLA."
source_id: recovery_outreach_drafting_routing
tags:
  - telco
  - okf
  - brd
timestamp: "2026-07-04T00:00:00.000Z"
---

# Recovery Outreach Drafting & Routing

Draft the personalized recovery outreach using Zendesk macros, attach the concrete remedy, and assign the case owner in Genesys Cloud CX with a response-time SLA.

- **Mode:** sequential
- **Stage:** 4 of 5

## Tools

- [query_genesys_cloud_cx_customer_interactions](/tools/query-genesys-cloud-cx-customer-interactions.md)
- [query_zendesk_tickets](/tools/query-zendesk-tickets.md)
- [lookup_nps_detractor_recovery_agent_assurance_runbook](/tools/lookup-nps-detractor-recovery-agent-assurance-runbook.md)
- [action_genesys_cloud_cx_escalate](/tools/action-genesys-cloud-cx-escalate.md)

Next: [Case Closure & Churn-Risk Escalation](/workflow/case-closure-churn-risk-escalation.md)
