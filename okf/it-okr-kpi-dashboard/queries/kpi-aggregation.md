---
type: Query Capability
title: "Aggregate KPIs from ServiceNow (ITSM), Jira (DevOps velocity), Datadog (infra..."
description: "Aggregate KPIs from ServiceNow (ITSM), Jira (DevOps velocity), Datadog (infrastructure), and cloud platforms (cost). Normalize metrics into a unified performance dataset."
source_id: "kpi-aggregation"
generation_status: inferred
tags:
  - it
  - okf
  - brd
timestamp: "2026-07-01T00:00:00.000Z"
---

# Aggregate KPIs from ServiceNow (ITSM), Jira (DevOps velocity), Datadog (infrastructure), and cloud platforms (cost). Normalize metrics into a unified performance dataset.

## Tools used

- [query_jira_issues](/tools/query-jira-issues.md)
- [query_servicenow_tickets](/tools/query-servicenow-tickets.md)
- [action_jira_generate](/tools/action-jira-generate.md)

## Runs in

- [kpi_aggregation](/workflow/kpi-aggregation.md)

## Evidence expected

- source_system_record
- api_response
- generated_audit_trail

## Evals

- [Run the IT OKR & KPI Dashboard workflow for the current period. Cite the relevant source-system evidence and surface any escalations required.](/tests/it-okr-kpi-dashboard-end-to-end.md)

# Citations

- [IT OKR & KPI Dashboard Operations Runbook](/documents/it-okr-kpi-dashboard-runbook.md)
