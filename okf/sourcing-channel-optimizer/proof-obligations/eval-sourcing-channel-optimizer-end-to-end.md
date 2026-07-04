---
type: Proof Obligation
title: "Golden eval obligation — Run the Sourcing Channel Optimizer workflow for the current period. Cite the relevant source-system evidence and surface any escalations required."
description: golden eval proof obligation
source_id: "eval-sourcing-channel-optimizer-end-to-end"
tags:
  - procurement
  - okf
  - brd
timestamp: "2026-07-01T00:00:00.000Z"
source_kind: generationSpec
source_path: behaviorContract.goldenEvals.0
generation_status: generated
ge_status: generated
---

# Golden eval obligation — Run the Sourcing Channel Optimizer workflow for the current period. Cite the relevant source-system evidence and surface any escalations required.

- **Kind:** golden eval
- **Spec source:** behaviorContract.goldenEvals.0
- **Eval:** [sourcing-channel-optimizer-end-to-end](/tests/sourcing-channel-optimizer-end-to-end.md)


## Mechanisms

- [query_coupa_catalog_catalog_items](/tools/query-coupa-catalog-catalog-items.md)
- [query_amazon_business_amazon_business_records](/tools/query-amazon-business-amazon-business-records.md)
- [query_sap_ariba_suppliers](/tools/query-sap-ariba-suppliers.md)
- [query_bigquery_analytics_events](/tools/query-bigquery-analytics-events.md)
- [lookup_sourcing_channel_optimizer_policy_guide](/tools/lookup-sourcing-channel-optimizer-policy-guide.md)
- [action_coupa_catalog_generate](/tools/action-coupa-catalog-generate.md)

## Entities that must be referenced

- catalog_items
- amazon_business_records
- suppliers
- analytics_events

## Forbidden behaviors

- do not invent KPI numbers
- do not skip the evidence_lookup step before any recommendation
- do not execute generate without two-system evidence

# Citations

- [sourcing-channel-optimizer-policy-guide](/documents/sourcing-channel-optimizer-policy-guide.md)
