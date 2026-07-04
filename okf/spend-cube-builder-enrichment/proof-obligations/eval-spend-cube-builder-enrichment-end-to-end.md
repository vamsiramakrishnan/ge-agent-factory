---
type: Proof Obligation
title: "Golden eval obligation — Run the Spend Cube Builder & Enrichment workflow for the current period. Cite the relevant source-system evidence and surface any escalations required."
description: golden eval proof obligation
source_id: "eval-spend-cube-builder-enrichment-end-to-end"
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

# Golden eval obligation — Run the Spend Cube Builder & Enrichment workflow for the current period. Cite the relevant source-system evidence and surface any escalations required.

- **Kind:** golden eval
- **Spec source:** behaviorContract.goldenEvals.0
- **Eval:** [spend-cube-builder-enrichment-end-to-end](/tests/spend-cube-builder-enrichment-end-to-end.md)


## Mechanisms

- [query_sap_s_4hana_transactions](/tools/query-sap-s-4hana-transactions.md)
- [query_coupa_requisitions](/tools/query-coupa-requisitions.md)
- [query_ariba_ariba_records](/tools/query-ariba-ariba-records.md)
- [query_spendhq_spendhq_records](/tools/query-spendhq-spendhq-records.md)
- [lookup_spend_cube_builder_enrichment_policy_guide](/tools/lookup-spend-cube-builder-enrichment-policy-guide.md)
- [action_sap_s_4hana_enrich](/tools/action-sap-s-4hana-enrich.md)

## Entities that must be referenced

- transactions
- requisitions
- ariba_records
- spendhq_records
- sievo_records
- analytics_events

## Forbidden behaviors

- do not invent KPI numbers
- do not skip the evidence_lookup step before any recommendation
- do not execute enrich without two-system evidence

# Citations

- [spend-cube-builder-enrichment-policy-guide](/documents/spend-cube-builder-enrichment-policy-guide.md)
