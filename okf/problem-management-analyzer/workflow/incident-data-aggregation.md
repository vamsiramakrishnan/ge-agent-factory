---
type: Workflow Stage
title: Incident Data Aggregation
description: "Pull incident records from ServiceNow with resolution notes, affected CIs, and categorization. Enrich with infrastructure metrics from Datadog at time of incident."
source_id: incident_data_aggregation
tags:
  - it
  - okf
  - brd
timestamp: "2026-07-01T00:00:00.000Z"
---

# Incident Data Aggregation

Pull incident records from ServiceNow with resolution notes, affected CIs, and categorization. Enrich with infrastructure metrics from Datadog at time of incident.

- **Mode:** sequential
- **Stage:** 1 of 2

## Tools

- [query_servicenow_tickets](/tools/query-servicenow-tickets.md)
- [query_datadog_alerts](/tools/query-datadog-alerts.md)
- [action_servicenow_generate](/tools/action-servicenow-generate.md)

Next: [Problem Ticket Creation](/workflow/problem-ticket-creation.md)
