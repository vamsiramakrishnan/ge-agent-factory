---
type: Eval Scenario
title: "For the commercial_property segment, analytics_events last computed_at is 202..."
description: "For the commercial_property segment, analytics_events last computed_at is 2026-06-30 but today is 2026-07-04 and historical_metrics baseline hasn't refreshed since 2026-06-15. The draft IBNR range you're about to publish is plus-or-minus 11%, right at the edge of our plus-or-minus 12%-to-plus-or-minus 6% target band. Should we publish it in this quarter's exhibit, and what needs to happen first?"
source_id: "reserve-adequacy-analyzer-stale-evidence-ibnr-edge"
generation_status: inferred
tags:
  - insurance
  - okf
  - brd
timestamp: "2026-07-04T00:00:00.000Z"
---

# For the commercial_property segment, analytics_events last computed_at is 2026-06-30 but today is 2026-07-04 and historical_metrics baseline hasn't refreshed since 2026-06-15. The draft IBNR range you're about to publish is plus-or-minus 11%, right at the edge of our plus-or-minus 12%-to-plus-or-minus 6% target band. Should we publish it in this quarter's exhibit, and what needs to happen first?

## Validates

- [loss-triangle-assembly-reconciliation](/queries/loss-triangle-assembly-reconciliation.md)

## Mechanisms to call

- [query_bigquery_analytics_events](/tools/query-bigquery-analytics-events.md)
- [lookup_reserve_adequacy_analyzer_authority_guide](/tools/lookup-reserve-adequacy-analyzer-authority-guide.md)

## Success rubric

Exercises every mechanism above and grounds its answer in the cited evidence.

# Citations

- [Reserve Adequacy Analyzer Authority & Referral Guide](/documents/reserve-adequacy-analyzer-authority-guide.md)
- [Reserve Data Staleness & Evidence Refresh Runbook](/documents/reserve-data-staleness-evidence-refresh-runbook.md)
