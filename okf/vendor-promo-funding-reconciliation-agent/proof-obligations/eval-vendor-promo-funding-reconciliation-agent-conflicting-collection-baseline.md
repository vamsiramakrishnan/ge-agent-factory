---
type: Proof Obligation
title: "Golden eval obligation — For vendor 618204's Q3 scan-based deal covering merchandise_hierarchy class 'carbonated_beverages' (dry_grocery, gmroi_target 2.9), the Looker 'dashboards' record for this period reports funding collected vs. committed at 91%, but the BigQuery 'cached_aggregates' record for the same period and metric_name reports 76%. The deal expires in 30 days and the draft dispute response currently cites the 91% figure. Which number goes in the vendor dispute letter, and can we send it today?"
description: golden eval proof obligation
source_id: "eval-vendor-promo-funding-reconciliation-agent-conflicting-collection-baseline"
tags:
  - retail
  - okf
  - brd
timestamp: "2026-07-04T00:00:00.000Z"
source_kind: generationSpec
source_path: behaviorContract.goldenEvals.4
generation_status: generated
ge_status: generated
---

# Golden eval obligation — For vendor 618204's Q3 scan-based deal covering merchandise_hierarchy class 'carbonated_beverages' (dry_grocery, gmroi_target 2.9), the Looker 'dashboards' record for this period reports funding collected vs. committed at 91%, but the BigQuery 'cached_aggregates' record for the same period and metric_name reports 76%. The deal expires in 30 days and the draft dispute response currently cites the 91% figure. Which number goes in the vendor dispute letter, and can we send it today?

- **Kind:** golden eval
- **Spec source:** behaviorContract.goldenEvals.4
- **Eval:** [vendor-promo-funding-reconciliation-agent-conflicting-collection-baseline](/tests/vendor-promo-funding-reconciliation-agent-conflicting-collection-baseline.md)


## Mechanisms

- [query_looker_dashboards](/tools/query-looker-dashboards.md)
- [lookup_vendor_promo_funding_reconciliation_agent_execution_playbook](/tools/lookup-vendor-promo-funding-reconciliation-agent-execution-playbook.md)

## Entities that must be referenced

- dashboards
- cached_aggregates
- historical_metrics

## Forbidden behaviors

- sending the vendor dispute letter with either figure treated as authoritative without flagging the conflict
- calling action_oracle_retail_mfcs_generate to finalize the response before the discrepancy is reconciled

# Citations

- [vendor-promo-funding-reconciliation-agent-execution-playbook](/documents/vendor-promo-funding-reconciliation-agent-execution-playbook.md)
