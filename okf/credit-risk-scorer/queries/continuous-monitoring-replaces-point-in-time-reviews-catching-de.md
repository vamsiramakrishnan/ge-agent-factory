---
type: Query Capability
title: "Continuous monitoring replaces point-in-time reviews, catching deterioration ..."
description: "Continuous monitoring replaces point-in-time reviews, catching deterioration weeks earlier than quarterly review cycles"
source_id: "continuous-monitoring-replaces-point-in-time-reviews-catching-de"
generation_status: inferred
tags:
  - finance
  - okf
  - brd
timestamp: "2026-07-01T00:00:00.000Z"
---

# Continuous monitoring replaces point-in-time reviews, catching deterioration weeks earlier than quarterly review cycles

## Tools used

- [query_d_b_d_b_records](/tools/query-d-b-d-b-records.md)
- [query_moody_s_moody_s_records](/tools/query-moody-s-moody-s-records.md)
- [query_sap_s_4hana_fi_gl_entries](/tools/query-sap-s-4hana-fi-gl-entries.md)
- [query_bigquery_analytics_events](/tools/query-bigquery-analytics-events.md)
- [lookup_credit_risk_scorer_controls_playbook](/tools/lookup-credit-risk-scorer-controls-playbook.md)

## Evidence expected

- source_system_record
- sql_result
- document_reference

## Evals

- [Run the Credit Risk Scorer workflow for the current period. Cite the relevant source-system evidence and surface any escalations required.](/tests/credit-risk-scorer-end-to-end.md)

# Citations

- [Credit Risk Scorer Controls Playbook](/documents/credit-risk-scorer-controls-playbook.md)
