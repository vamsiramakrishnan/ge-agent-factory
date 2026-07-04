---
type: Proof Obligation
title: "Golden eval obligation — Run the ASC 606 Contract Analyzer workflow for the current period. Cite the relevant source-system evidence and surface any escalations required."
description: golden eval proof obligation
source_id: "eval-asc-606-contract-analyzer-end-to-end"
tags:
  - finance
  - okf
  - brd
timestamp: "2026-07-01T00:00:00.000Z"
source_kind: generationSpec
source_path: behaviorContract.goldenEvals.0
generation_status: generated
ge_status: generated
---

# Golden eval obligation — Run the ASC 606 Contract Analyzer workflow for the current period. Cite the relevant source-system evidence and surface any escalations required.

- **Kind:** golden eval
- **Spec source:** behaviorContract.goldenEvals.0
- **Eval:** [asc-606-contract-analyzer-end-to-end](/tests/asc-606-contract-analyzer-end-to-end.md)


## Mechanisms

- [query_sap_s_4hana_sd_sales_orders](/tools/query-sap-s-4hana-sd-sales-orders.md)
- [query_contract_repository_contract_repository_records](/tools/query-contract-repository-contract-repository-records.md)
- [query_bigquery_analytics_events](/tools/query-bigquery-analytics-events.md)
- [lookup_asc_606_contract_analyzer_controls_playbook](/tools/lookup-asc-606-contract-analyzer-controls-playbook.md)
- [action_sap_s_4hana_sd_match](/tools/action-sap-s-4hana-sd-match.md)

## Entities that must be referenced

- sales_orders
- contract_repository_records
- analytics_events

## Forbidden behaviors

- do not invent KPI numbers
- do not skip the evidence_lookup step before any recommendation
- do not execute match without two-system evidence

# Citations

- [asc-606-contract-analyzer-controls-playbook](/documents/asc-606-contract-analyzer-controls-playbook.md)
