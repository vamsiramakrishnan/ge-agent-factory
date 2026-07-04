---
type: Workflow Stage
title: "Routing, Escalation & Audit"
description: "Execute action_salesforce_commerce_cloud_escalate for gated cases, route unresolved tickets to the right specialist queue with a drafted response, log satisfaction_scores follow-up, and notify the Customer Care Director with a full audit trail."
source_id: routing_escalation_audit
tags:
  - retail
  - okf
  - brd
timestamp: "2026-07-04T00:00:00.000Z"
---

# Routing, Escalation & Audit

Execute action_salesforce_commerce_cloud_escalate for gated cases, route unresolved tickets to the right specialist queue with a drafted response, log satisfaction_scores follow-up, and notify the Customer Care Director with a full audit trail.

- **Mode:** sequential
- **Stage:** 5 of 5

## Tools

- [query_salesforce_commerce_cloud_online_orders](/tools/query-salesforce-commerce-cloud-online-orders.md)
- [query_zendesk_tickets](/tools/query-zendesk-tickets.md)
- [lookup_customer_care_triage_agent_execution_playbook](/tools/lookup-customer-care-triage-agent-execution-playbook.md)
- [action_salesforce_commerce_cloud_escalate](/tools/action-salesforce-commerce-cloud-escalate.md)
