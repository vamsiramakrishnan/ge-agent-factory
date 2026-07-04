---
type: Workflow Stage
title: "Case Closure & Churn-Risk Escalation"
description: "Track the tickets case to closure and invoke action_genesys_cloud_cx_escalate to route accounts showing churn-risk signals to the retention team with the full evidence and audit trail."
source_id: case_closure_churn_risk_escalation
tags:
  - telco
  - okf
  - brd
timestamp: "2026-07-04T00:00:00.000Z"
---

# Case Closure & Churn-Risk Escalation

Track the tickets case to closure and invoke action_genesys_cloud_cx_escalate to route accounts showing churn-risk signals to the retention team with the full evidence and audit trail.

- **Mode:** sequential
- **Stage:** 5 of 5

## Tools

- [query_genesys_cloud_cx_customer_interactions](/tools/query-genesys-cloud-cx-customer-interactions.md)
- [query_zendesk_tickets](/tools/query-zendesk-tickets.md)
- [action_genesys_cloud_cx_escalate](/tools/action-genesys-cloud-cx-escalate.md)
