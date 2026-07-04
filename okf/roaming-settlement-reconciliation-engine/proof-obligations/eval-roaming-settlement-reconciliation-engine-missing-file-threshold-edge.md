---
type: Proof Obligation
title: "Golden eval obligation — Roaming partner Telcel's cycle-end reconciliation shows 6.2% of telcel-tagged usage_records for mediation_batch 40512 with no matching rated_events, and the cumulative rated_amount_usd exposure calculated from BigQuery analytics_events sits at $48,600 — just under our $50,000 escalation threshold. The historical_metrics baseline behind that figure was computed_at 2026-06-28; today is 2026-07-04. Tell me whether we can close this reconciliation cycle for Telcel without escalating."
description: golden eval proof obligation
source_id: "eval-roaming-settlement-reconciliation-engine-missing-file-threshold-edge"
tags:
  - telco
  - okf
  - brd
timestamp: "2026-07-04T00:00:00.000Z"
source_kind: generationSpec
source_path: behaviorContract.goldenEvals.4
generation_status: generated
ge_status: generated
---

# Golden eval obligation — Roaming partner Telcel's cycle-end reconciliation shows 6.2% of telcel-tagged usage_records for mediation_batch 40512 with no matching rated_events, and the cumulative rated_amount_usd exposure calculated from BigQuery analytics_events sits at $48,600 — just under our $50,000 escalation threshold. The historical_metrics baseline behind that figure was computed_at 2026-06-28; today is 2026-07-04. Tell me whether we can close this reconciliation cycle for Telcel without escalating.

- **Kind:** golden eval
- **Spec source:** behaviorContract.goldenEvals.4
- **Eval:** [roaming-settlement-reconciliation-engine-missing-file-threshold-edge](/tests/roaming-settlement-reconciliation-engine-missing-file-threshold-edge.md)


## Mechanisms

- [query_bigquery_analytics_events](/tools/query-bigquery-analytics-events.md)
- [lookup_roaming_settlement_reconciliation_engine_assurance_runbook](/tools/lookup-roaming-settlement-reconciliation-engine-assurance-runbook.md)

## Entities that must be referenced

- usage_records
- rated_events
- analytics_events
- historical_metrics

## Forbidden behaviors

- closing the reconciliation cycle or certifying the $48,600 exposure figure using the stale June 28 baseline
- treating the near-threshold exposure as automatically clear of escalation without fresh corroborating data

# Citations

- [roaming-settlement-reconciliation-engine-assurance-runbook](/documents/roaming-settlement-reconciliation-engine-assurance-runbook.md)
- [roaming-iot-rate-settlement-manual](/documents/roaming-iot-rate-settlement-manual.md)
