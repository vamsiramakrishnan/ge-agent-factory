---
type: Eval Scenario
title: Run the Reserve Adequacy Analyzer workflow for the current period. Cite the r...
description: "Run the Reserve Adequacy Analyzer workflow for the current period. Cite the relevant source-system evidence and surface any escalations required."
source_id: "reserve-adequacy-analyzer-end-to-end"
generation_status: inferred
tags:
  - insurance
  - okf
  - brd
timestamp: "2026-07-04T00:00:00.000Z"
---

# Run the Reserve Adequacy Analyzer workflow for the current period. Cite the relevant source-system evidence and surface any escalations required.

## Validates

- [retrieve-records](/queries/retrieve-records.md)

## Mechanisms to call

- [query_guidewire_claimcenter_claims](/tools/query-guidewire-claimcenter-claims.md)
- [query_bigquery_analytics_events](/tools/query-bigquery-analytics-events.md)
- [query_looker_dashboards](/tools/query-looker-dashboards.md)
- [lookup_reserve_adequacy_analyzer_authority_guide](/tools/lookup-reserve-adequacy-analyzer-authority-guide.md)
- [action_guidewire_claimcenter_draft](/tools/action-guidewire-claimcenter-draft.md)

## Success rubric

Action draft executed against Guidewire ClaimCenter, with audit-trail entry and Actuary notified of outcomes.

# Citations

- [Reserve Adequacy Analyzer Authority & Referral Guide](/documents/reserve-adequacy-analyzer-authority-guide.md)
