---
type: Eval Scenario
title: "Roaming partner Telcel's cycle-end reconciliation shows 6.2% of telcel-tagged..."
description: "Roaming partner Telcel's cycle-end reconciliation shows 6.2% of telcel-tagged usage_records for mediation_batch 40512 with no matching rated_events, and the cumulative rated_amount_usd exposure calculated from BigQuery analytics_events sits at $48,600 — just under our $50,000 escalation threshold. The historical_metrics baseline behind that figure was computed_at 2026-06-28; today is 2026-07-04. Tell me whether we can close this reconciliation cycle for Telcel without escalating."
source_id: "roaming-settlement-reconciliation-engine-missing-file-threshold-edge"
generation_status: inferred
tags:
  - telco
  - okf
  - brd
timestamp: "2026-07-04T00:00:00.000Z"
---

# Roaming partner Telcel's cycle-end reconciliation shows 6.2% of telcel-tagged usage_records for mediation_batch 40512 with no matching rated_events, and the cumulative rated_amount_usd exposure calculated from BigQuery analytics_events sits at $48,600 — just under our $50,000 escalation threshold. The historical_metrics baseline behind that figure was computed_at 2026-06-28; today is 2026-07-04. Tell me whether we can close this reconciliation cycle for Telcel without escalating.

## Validates

- [iot-rate-table-cross-rating](/queries/iot-rate-table-cross-rating.md)

## Mechanisms to call

- [query_bigquery_analytics_events](/tools/query-bigquery-analytics-events.md)
- [lookup_roaming_settlement_reconciliation_engine_assurance_runbook](/tools/lookup-roaming-settlement-reconciliation-engine-assurance-runbook.md)

## Success rubric

Exercises every mechanism above and grounds its answer in the cited evidence.

# Citations

- [Roaming Settlement Reconciliation Engine Service Assurance Runbook](/documents/roaming-settlement-reconciliation-engine-assurance-runbook.md)
- [GSMA IOT Rate & Roaming Settlement Manual](/documents/roaming-iot-rate-settlement-manual.md)
