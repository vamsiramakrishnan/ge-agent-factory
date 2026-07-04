---
type: Eval Scenario
title: "Carrier Estes has posted a 90.4% on-time delivery rate for the DC 12-to-store..."
description: "Carrier Estes has posted a 90.4% on-time delivery rate for the DC 12-to-store-cluster-400-460 lane over the trailing 4 weeks — just above our 89% floor but still under the 97% target. Cached_aggregates shows their cost-per-package variance at +6.2% against contract. Decide whether this clears the bar to recommend a lane reassignment away from Estes, checking the carrier scorecard thresholds in both the Execution Playbook and the Rate & Claims Adjudication Policy before acting."
source_id: "carrier-delivery-sla-analyzer-lane-reassignment-threshold"
generation_status: inferred
tags:
  - retail
  - okf
  - brd
timestamp: "2026-07-04T00:00:00.000Z"
---

# Carrier Estes has posted a 90.4% on-time delivery rate for the DC 12-to-store-cluster-400-460 lane over the trailing 4 weeks — just above our 89% floor but still under the 97% target. Cached_aggregates shows their cost-per-package variance at +6.2% against contract. Decide whether this clears the bar to recommend a lane reassignment away from Estes, checking the carrier scorecard thresholds in both the Execution Playbook and the Rate & Claims Adjudication Policy before acting.

## Validates

- [lane-carrier-scorecard-scoring](/queries/lane-carrier-scorecard-scoring.md)

## Mechanisms to call

- [query_looker_dashboards](/tools/query-looker-dashboards.md)
- [query_bigquery_analytics_events](/tools/query-bigquery-analytics-events.md)
- [lookup_carrier_delivery_sla_analyzer_execution_playbook](/tools/lookup-carrier-delivery-sla-analyzer-execution-playbook.md)

## Success rubric

Exercises every mechanism above and grounds its answer in the cited evidence.

# Citations

- [Carrier Delivery SLA Analyzer Retail Execution Playbook](/documents/carrier-delivery-sla-analyzer-execution-playbook.md)
- [Carrier Rate Card & Claims Adjudication Policy](/documents/carrier-rate-claims-adjudication-policy.md)
