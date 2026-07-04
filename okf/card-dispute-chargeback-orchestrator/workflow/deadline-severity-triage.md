---
type: Workflow Stage
title: "Deadline & Severity Triage"
description: "Score every open case's urgency against cached_aggregates trend data and BigQuery historical_metrics, prioritize the Dispute Resolution Specialist's queue, and open ServiceNow tickets/change_requests for merchant response follow-up."
source_id: deadline_severity_triage
tags:
  - banking
  - okf
  - brd
timestamp: "2026-07-04T00:00:00.000Z"
---

# Deadline & Severity Triage

Score every open case's urgency against cached_aggregates trend data and BigQuery historical_metrics, prioritize the Dispute Resolution Specialist's queue, and open ServiceNow tickets/change_requests for merchant response follow-up.

- **Mode:** sequential
- **Stage:** 4 of 5

## Tools

- [query_bigquery_analytics_events](/tools/query-bigquery-analytics-events.md)
- [query_servicenow_tickets](/tools/query-servicenow-tickets.md)
- [lookup_card_dispute_chargeback_orchestrator_compliance_policy](/tools/lookup-card-dispute-chargeback-orchestrator-compliance-policy.md)

Next: [Representment Filing & Audit](/workflow/representment-filing-audit.md)
