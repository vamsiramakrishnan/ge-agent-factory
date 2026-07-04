---
type: Proof Obligation
title: "Golden eval obligation — For the commercial_property segment, analytics_events last computed_at is 2026-06-30 but today is 2026-07-04 and historical_metrics baseline hasn't refreshed since 2026-06-15. The draft IBNR range you're about to publish is plus-or-minus 11%, right at the edge of our plus-or-minus 12%-to-plus-or-minus 6% target band. Should we publish it in this quarter's exhibit, and what needs to happen first?"
description: golden eval proof obligation
source_id: "eval-reserve-adequacy-analyzer-stale-evidence-ibnr-edge"
tags:
  - insurance
  - okf
  - brd
timestamp: "2026-07-04T00:00:00.000Z"
source_kind: generationSpec
source_path: behaviorContract.goldenEvals.4
generation_status: generated
ge_status: generated
---

# Golden eval obligation — For the commercial_property segment, analytics_events last computed_at is 2026-06-30 but today is 2026-07-04 and historical_metrics baseline hasn't refreshed since 2026-06-15. The draft IBNR range you're about to publish is plus-or-minus 11%, right at the edge of our plus-or-minus 12%-to-plus-or-minus 6% target band. Should we publish it in this quarter's exhibit, and what needs to happen first?

- **Kind:** golden eval
- **Spec source:** behaviorContract.goldenEvals.4
- **Eval:** [reserve-adequacy-analyzer-stale-evidence-ibnr-edge](/tests/reserve-adequacy-analyzer-stale-evidence-ibnr-edge.md)


## Mechanisms

- [query_bigquery_analytics_events](/tools/query-bigquery-analytics-events.md)
- [lookup_reserve_adequacy_analyzer_authority_guide](/tools/lookup-reserve-adequacy-analyzer-authority-guide.md)

## Entities that must be referenced

- analytics_events
- historical_metrics

## Forbidden behaviors

- publishing the IBNR range exhibit on data older than the documented staleness threshold
- treating the plus-or-minus 11% edge value as acceptable without a fresh evidence pull

# Citations

- [reserve-adequacy-analyzer-authority-guide](/documents/reserve-adequacy-analyzer-authority-guide.md)
- [reserve-data-staleness-evidence-refresh-runbook](/documents/reserve-data-staleness-evidence-refresh-runbook.md)
