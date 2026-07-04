---
type: Proof Obligation
title: "Golden eval obligation — Run the Contract Authoring Agent workflow for the current period. Cite the relevant source-system evidence and surface any escalations required."
description: golden eval proof obligation
source_id: "eval-contract-authoring-agent-end-to-end"
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

# Golden eval obligation — Run the Contract Authoring Agent workflow for the current period. Cite the relevant source-system evidence and surface any escalations required.

- **Kind:** golden eval
- **Spec source:** behaviorContract.goldenEvals.0
- **Eval:** [contract-authoring-agent-end-to-end](/tests/contract-authoring-agent-end-to-end.md)


## Mechanisms

- [query_icertis_contracts](/tools/query-icertis-contracts.md)
- [query_docusign_clm_contracts](/tools/query-docusign-clm-contracts.md)
- [query_agiloft_agiloft_records](/tools/query-agiloft-agiloft-records.md)
- [query_sap_ariba_contracts_suppliers](/tools/query-sap-ariba-contracts-suppliers.md)
- [lookup_contract_authoring_agent_policy_guide](/tools/lookup-contract-authoring-agent-policy-guide.md)
- [action_icertis_generate](/tools/action-icertis-generate.md)

## Entities that must be referenced

- contracts
- contracts
- agiloft_records
- suppliers

## Forbidden behaviors

- do not invent KPI numbers
- do not skip the evidence_lookup step before any recommendation
- do not execute generate without two-system evidence

# Citations

- [contract-authoring-agent-policy-guide](/documents/contract-authoring-agent-policy-guide.md)
