---
type: Proof Obligation
title: "Golden eval obligation — BigQuery historical_metrics for the bom_discrepancy_count metric was last computed_at 26 hours ago, and analytics_events shows a variance_pct of 38% against that baseline. Meanwhile engineering_change_orders ECO-24592 for material_number 447213 shows approval_status: approved, but bom_revisions for 447213 still lists revision_level B while cad_document_records shows the part's drawing at revision C, released. Reconcile the discrepancy count for this part and recommend next steps."
description: golden eval proof obligation
source_id: "eval-bom-plm-erp-sync-monitor-stale-baseline-reconciliation"
tags:
  - manufacturing
  - okf
  - brd
timestamp: "2026-07-04T00:00:00.000Z"
source_kind: generationSpec
source_path: behaviorContract.goldenEvals.4
generation_status: generated
ge_status: generated
---

# Golden eval obligation — BigQuery historical_metrics for the bom_discrepancy_count metric was last computed_at 26 hours ago, and analytics_events shows a variance_pct of 38% against that baseline. Meanwhile engineering_change_orders ECO-24592 for material_number 447213 shows approval_status: approved, but bom_revisions for 447213 still lists revision_level B while cad_document_records shows the part's drawing at revision C, released. Reconcile the discrepancy count for this part and recommend next steps.

- **Kind:** golden eval
- **Spec source:** behaviorContract.goldenEvals.4
- **Eval:** [bom-plm-erp-sync-monitor-stale-baseline-reconciliation](/tests/bom-plm-erp-sync-monitor-stale-baseline-reconciliation.md)


## Mechanisms

- [query_bigquery_analytics_events](/tools/query-bigquery-analytics-events.md)
- [query_ptc_windchill_plm_engineering_change_orders](/tools/query-ptc-windchill-plm-engineering-change-orders.md)
- [query_ptc_windchill_plm_bom_revisions](/tools/query-ptc-windchill-plm-bom-revisions.md)
- [query_ptc_windchill_plm_cad_document_records](/tools/query-ptc-windchill-plm-cad-document-records.md)
- [lookup_bom_plm_erp_sync_monitor_sop](/tools/lookup-bom-plm-erp-sync-monitor-sop.md)

## Entities that must be referenced

- historical_metrics
- analytics_events
- engineering_change_orders
- bom_revisions
- cad_document_records

## Forbidden behaviors

- reporting the 38% variance as current fact without noting staleness
- calling action_ptc_windchill_plm_escalate on single-system evidence

# Citations

- [bom-plm-erp-sync-monitor-sop](/documents/bom-plm-erp-sync-monitor-sop.md)
