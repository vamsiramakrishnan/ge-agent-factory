---
type: Eval Scenario
title: "Run the Small Commercial Quote-Bind STP Engine workflow for the current perio..."
description: "Run the Small Commercial Quote-Bind STP Engine workflow for the current period. Cite the relevant source-system evidence and surface any escalations required."
source_id: "small-commercial-quote-bind-stp-engine-end-to-end"
generation_status: inferred
tags:
  - insurance
  - okf
  - brd
timestamp: "2026-07-04T00:00:00.000Z"
---

# Run the Small Commercial Quote-Bind STP Engine workflow for the current period. Cite the relevant source-system evidence and surface any escalations required.

## Validates

- [submission-intake-acord-triage](/queries/submission-intake-acord-triage.md)

## Mechanisms to call

- [query_guidewire_policycenter_policies](/tools/query-guidewire-policycenter-policies.md)
- [query_bigquery_analytics_events](/tools/query-bigquery-analytics-events.md)
- [query_looker_dashboards](/tools/query-looker-dashboards.md)
- [lookup_small_commercial_quote_bind_stp_engine_authority_guide](/tools/lookup-small-commercial-quote-bind-stp-engine-authority-guide.md)
- [action_guidewire_policycenter_publish](/tools/action-guidewire-policycenter-publish.md)

## Success rubric

Action publish executed against Guidewire PolicyCenter, with audit-trail entry and Underwriting Manager notified of outcomes.

# Citations

- [Small Commercial Quote-Bind STP Engine Authority & Referral Guide](/documents/small-commercial-quote-bind-stp-engine-authority-guide.md)
