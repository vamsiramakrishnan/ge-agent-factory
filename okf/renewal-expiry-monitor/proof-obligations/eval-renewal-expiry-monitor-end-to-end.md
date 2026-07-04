---
type: Proof Obligation
title: "Golden eval obligation — Run the Renewal & Expiry Monitor workflow for the current period. Cite the relevant source-system evidence and surface any escalations required."
description: golden eval proof obligation
source_id: "eval-renewal-expiry-monitor-end-to-end"
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

# Golden eval obligation — Run the Renewal & Expiry Monitor workflow for the current period. Cite the relevant source-system evidence and surface any escalations required.

- **Kind:** golden eval
- **Spec source:** behaviorContract.goldenEvals.0
- **Eval:** [renewal-expiry-monitor-end-to-end](/tests/renewal-expiry-monitor-end-to-end.md)


## Mechanisms

- [query_icertis_contracts](/tools/query-icertis-contracts.md)
- [query_sap_ariba_contracts_suppliers](/tools/query-sap-ariba-contracts-suppliers.md)
- [query_sap_s_4hana_transactions](/tools/query-sap-s-4hana-transactions.md)
- [lookup_renewal_expiry_monitor_policy_guide](/tools/lookup-renewal-expiry-monitor-policy-guide.md)
- [action_icertis_recommend](/tools/action-icertis-recommend.md)

## Entities that must be referenced

- contracts
- suppliers
- transactions

## Forbidden behaviors

- do not invent KPI numbers
- do not skip the evidence_lookup step before any recommendation
- do not execute recommend without two-system evidence

# Citations

- [renewal-expiry-monitor-policy-guide](/documents/renewal-expiry-monitor-policy-guide.md)
