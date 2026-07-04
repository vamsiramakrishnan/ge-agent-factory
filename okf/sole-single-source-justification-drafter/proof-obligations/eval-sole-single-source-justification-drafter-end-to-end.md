---
type: Proof Obligation
title: "Golden eval obligation — Run the Sole/Single Source Justification Drafter workflow for the current period. Cite the relevant source-system evidence and surface any escalations required."
description: golden eval proof obligation
source_id: "eval-sole-single-source-justification-drafter-end-to-end"
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

# Golden eval obligation — Run the Sole/Single Source Justification Drafter workflow for the current period. Cite the relevant source-system evidence and surface any escalations required.

- **Kind:** golden eval
- **Spec source:** behaviorContract.goldenEvals.0
- **Eval:** [sole-single-source-justification-drafter-end-to-end](/tests/sole-single-source-justification-drafter-end-to-end.md)


## Mechanisms

- [query_policy_docs_policy_docs_records](/tools/query-policy-docs-policy-docs-records.md)
- [query_supplier_databases_supplier_databases_records](/tools/query-supplier-databases-supplier-databases-records.md)
- [query_market_research_market_research_records](/tools/query-market-research-market-research-records.md)
- [lookup_sole_single_source_justification_drafter_policy_guide](/tools/lookup-sole-single-source-justification-drafter-policy-guide.md)
- [action_policy_docs_draft](/tools/action-policy-docs-draft.md)

## Entities that must be referenced

- policy_docs_records
- supplier_databases_records
- market_research_records

## Forbidden behaviors

- do not invent KPI numbers
- do not skip the evidence_lookup step before any recommendation
- do not execute draft without two-system evidence

# Citations

- [sole-single-source-justification-drafter-policy-guide](/documents/sole-single-source-justification-drafter-policy-guide.md)
