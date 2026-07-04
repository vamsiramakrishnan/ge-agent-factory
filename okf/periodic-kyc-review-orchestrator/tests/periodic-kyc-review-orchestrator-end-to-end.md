---
type: Eval Scenario
title: Run the Periodic KYC Review Orchestrator workflow for the current period. Cit...
description: "Run the Periodic KYC Review Orchestrator workflow for the current period. Cite the relevant source-system evidence and surface any escalations required."
source_id: "periodic-kyc-review-orchestrator-end-to-end"
generation_status: inferred
tags:
  - banking
  - okf
  - brd
timestamp: "2026-07-04T00:00:00.000Z"
---

# Run the Periodic KYC Review Orchestrator workflow for the current period. Cite the relevant source-system evidence and surface any escalations required.

## Validates

- [due-date-cohort-build](/queries/due-date-cohort-build.md)

## Mechanisms to call

- [query_fenergo_clm_kyc_cases](/tools/query-fenergo-clm-kyc-cases.md)
- [query_bigquery_analytics_events](/tools/query-bigquery-analytics-events.md)
- [query_servicenow_tickets](/tools/query-servicenow-tickets.md)
- [lookup_periodic_kyc_review_orchestrator_compliance_policy](/tools/lookup-periodic-kyc-review-orchestrator-compliance-policy.md)
- [action_fenergo_clm_file](/tools/action-fenergo-clm-file.md)

## Success rubric

Action file executed against Fenergo CLM, with audit-trail entry and KYC Operations Manager notified of outcomes.

# Citations

- [Periodic KYC Review Orchestrator Banking Compliance Policy](/documents/periodic-kyc-review-orchestrator-compliance-policy.md)
