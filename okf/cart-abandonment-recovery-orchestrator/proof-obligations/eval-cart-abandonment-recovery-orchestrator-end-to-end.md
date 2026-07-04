---
type: Proof Obligation
title: "Golden eval obligation — Run the Cart Abandonment Recovery Orchestrator workflow for the current period. Cite the relevant source-system evidence and surface any escalations required."
description: golden eval proof obligation
source_id: "eval-cart-abandonment-recovery-orchestrator-end-to-end"
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

# Golden eval obligation — Run the Cart Abandonment Recovery Orchestrator workflow for the current period. Cite the relevant source-system evidence and surface any escalations required.

- **Kind:** golden eval
- **Spec source:** behaviorContract.goldenEvals.0
- **Eval:** [cart-abandonment-recovery-orchestrator-end-to-end](/tests/cart-abandonment-recovery-orchestrator-end-to-end.md)


## Mechanisms

- [query_salesforce_commerce_cloud_online_orders](/tools/query-salesforce-commerce-cloud-online-orders.md)
- [query_salesforce_marketing_cloud_accounts](/tools/query-salesforce-marketing-cloud-accounts.md)
- [query_segment_segment_records](/tools/query-segment-segment-records.md)
- [query_bigquery_analytics_events](/tools/query-bigquery-analytics-events.md)
- [lookup_cart_abandonment_recovery_orchestrator_execution_playbook](/tools/lookup-cart-abandonment-recovery-orchestrator-execution-playbook.md)
- [action_salesforce_commerce_cloud_send](/tools/action-salesforce-commerce-cloud-send.md)

## Entities that must be referenced

- online_orders
- accounts
- segment_records
- analytics_events

## Forbidden behaviors

- do not invent KPI numbers
- do not skip the evidence_lookup step before any recommendation
- do not execute send without two-system evidence

# Citations

- [cart-abandonment-recovery-orchestrator-execution-playbook](/documents/cart-abandonment-recovery-orchestrator-execution-playbook.md)
