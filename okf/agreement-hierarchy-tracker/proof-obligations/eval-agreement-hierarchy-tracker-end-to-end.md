---
type: Proof Obligation
title: "Golden eval obligation — Run the Agreement Hierarchy Tracker workflow for the current period. Cite the relevant source-system evidence and surface any escalations required."
description: golden eval proof obligation
source_id: "eval-agreement-hierarchy-tracker-end-to-end"
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

# Golden eval obligation — Run the Agreement Hierarchy Tracker workflow for the current period. Cite the relevant source-system evidence and surface any escalations required.

- **Kind:** golden eval
- **Spec source:** behaviorContract.goldenEvals.0
- **Eval:** [agreement-hierarchy-tracker-end-to-end](/tests/agreement-hierarchy-tracker-end-to-end.md)


## Mechanisms

- [query_icertis_contracts](/tools/query-icertis-contracts.md)
- [query_docusign_clm_contracts](/tools/query-docusign-clm-contracts.md)
- [query_sap_ariba_suppliers](/tools/query-sap-ariba-suppliers.md)
- [query_bigquery_analytics_events](/tools/query-bigquery-analytics-events.md)
- [lookup_agreement_hierarchy_tracker_policy_guide](/tools/lookup-agreement-hierarchy-tracker-policy-guide.md)
- [action_icertis_update](/tools/action-icertis-update.md)

## Entities that must be referenced

- contracts
- contracts
- suppliers
- analytics_events

## Forbidden behaviors

- do not invent KPI numbers
- do not skip the evidence_lookup step before any recommendation
- do not execute update without two-system evidence

# Citations

- [agreement-hierarchy-tracker-policy-guide](/documents/agreement-hierarchy-tracker-policy-guide.md)
