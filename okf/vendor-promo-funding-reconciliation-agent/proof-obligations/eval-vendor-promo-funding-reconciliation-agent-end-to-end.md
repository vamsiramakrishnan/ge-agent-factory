---
type: Proof Obligation
title: "Golden eval obligation — Run the Vendor Promo Funding Reconciliation Agent workflow for the current period. Cite the relevant source-system evidence and surface any escalations required."
description: golden eval proof obligation
source_id: "eval-vendor-promo-funding-reconciliation-agent-end-to-end"
tags:
  - retail
  - okf
  - brd
timestamp: "2026-07-04T00:00:00.000Z"
source_kind: generationSpec
source_path: behaviorContract.goldenEvals.0
generation_status: generated
ge_status: generated
---

# Golden eval obligation — Run the Vendor Promo Funding Reconciliation Agent workflow for the current period. Cite the relevant source-system evidence and surface any escalations required.

- **Kind:** golden eval
- **Spec source:** behaviorContract.goldenEvals.0
- **Eval:** [vendor-promo-funding-reconciliation-agent-end-to-end](/tests/vendor-promo-funding-reconciliation-agent-end-to-end.md)


## Mechanisms

- [query_oracle_retail_mfcs_item_master](/tools/query-oracle-retail-mfcs-item-master.md)
- [query_bigquery_analytics_events](/tools/query-bigquery-analytics-events.md)
- [query_looker_dashboards](/tools/query-looker-dashboards.md)
- [lookup_vendor_promo_funding_reconciliation_agent_execution_playbook](/tools/lookup-vendor-promo-funding-reconciliation-agent-execution-playbook.md)
- [action_oracle_retail_mfcs_generate](/tools/action-oracle-retail-mfcs-generate.md)

## Entities that must be referenced

- item_master
- analytics_events
- dashboards

## Forbidden behaviors

- do not invent KPI numbers
- do not skip the evidence_lookup step before any recommendation
- do not execute generate without two-system evidence

# Citations

- [vendor-promo-funding-reconciliation-agent-execution-playbook](/documents/vendor-promo-funding-reconciliation-agent-execution-playbook.md)
