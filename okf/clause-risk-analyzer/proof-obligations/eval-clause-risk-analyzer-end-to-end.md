---
type: Proof Obligation
title: "Golden eval obligation — Run the Clause Risk Analyzer workflow for the current period. Cite the relevant source-system evidence and surface any escalations required."
description: golden eval proof obligation
source_id: "eval-clause-risk-analyzer-end-to-end"
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

# Golden eval obligation — Run the Clause Risk Analyzer workflow for the current period. Cite the relevant source-system evidence and surface any escalations required.

- **Kind:** golden eval
- **Spec source:** behaviorContract.goldenEvals.0
- **Eval:** [clause-risk-analyzer-end-to-end](/tests/clause-risk-analyzer-end-to-end.md)


## Mechanisms

- [query_icertis_contracts](/tools/query-icertis-contracts.md)
- [query_docusign_clm_contracts](/tools/query-docusign-clm-contracts.md)
- [query_legal_playbook_legal_playbook_records](/tools/query-legal-playbook-legal-playbook-records.md)
- [lookup_clause_risk_analyzer_policy_guide](/tools/lookup-clause-risk-analyzer-policy-guide.md)
- [action_icertis_recommend](/tools/action-icertis-recommend.md)

## Entities that must be referenced

- contracts
- contracts
- legal_playbook_records

## Forbidden behaviors

- do not invent KPI numbers
- do not skip the evidence_lookup step before any recommendation
- do not execute recommend without two-system evidence

# Citations

- [clause-risk-analyzer-policy-guide](/documents/clause-risk-analyzer-policy-guide.md)
