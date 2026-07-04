---
type: Eval Scenario
title: Run the Inclusive Hiring Audit workflow for the current period. Cite the rele...
description: "Run the Inclusive Hiring Audit workflow for the current period. Cite the relevant source-system evidence and surface any escalations required."
source_id: "inclusive-hiring-audit-end-to-end"
generation_status: inferred
tags:
  - hr
  - okf
  - brd
timestamp: "2026-07-01T00:00:00.000Z"
---

# Run the Inclusive Hiring Audit workflow for the current period. Cite the relevant source-system evidence and surface any escalations required.

## Validates

- [pipeline-data-collection](/queries/pipeline-data-collection.md)

## Mechanisms to call

- [query_ats_ats_records](/tools/query-ats-ats-records.md)
- [query_workday_employees](/tools/query-workday-employees.md)
- [query_google_bigquery_analytics_events](/tools/query-google-bigquery-analytics-events.md)
- [lookup_inclusive_hiring_audit_policy_handbook](/tools/lookup-inclusive-hiring-audit-policy-handbook.md)
- [action_ats_recommend](/tools/action-ats-recommend.md)

## Success rubric

Action recommend executed against ATS, with audit-trail entry and TA Lead notified of outcomes.

# Citations

- [Inclusive Hiring Audit Policy Handbook](/documents/inclusive-hiring-audit-policy-handbook.md)
