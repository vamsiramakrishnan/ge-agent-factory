---
type: Proof Obligation
title: "Golden eval obligation — Run the Zero Trust Policy Evaluator workflow for the current period. Cite the relevant source-system evidence and surface any escalations required."
description: golden eval proof obligation
source_id: "eval-zero-trust-policy-evaluator-end-to-end"
tags:
  - it
  - okf
  - brd
timestamp: "2026-07-01T00:00:00.000Z"
source_kind: generationSpec
source_path: behaviorContract.goldenEvals.0
generation_status: generated
ge_status: generated
---

# Golden eval obligation — Run the Zero Trust Policy Evaluator workflow for the current period. Cite the relevant source-system evidence and surface any escalations required.

- **Kind:** golden eval
- **Spec source:** behaviorContract.goldenEvals.0
- **Eval:** [zero-trust-policy-evaluator-end-to-end](/tests/zero-trust-policy-evaluator-end-to-end.md)


## Mechanisms

- [query_okta_users](/tools/query-okta-users.md)
- [query_palo_alto_prisma_palo_alto_prisma_records](/tools/query-palo-alto-prisma-palo-alto-prisma-records.md)
- [query_google_beyondcorp_google_beyondcorp_records](/tools/query-google-beyondcorp-google-beyondcorp-records.md)
- [lookup_zero_trust_policy_evaluator_runbook](/tools/lookup-zero-trust-policy-evaluator-runbook.md)

## Entities that must be referenced

- users
- palo_alto_prisma_records
- google_beyondcorp_records

## Forbidden behaviors

- do not invent KPI numbers
- do not skip the evidence_lookup step before any recommendation
- do not act on single-system evidence

# Citations

- [zero-trust-policy-evaluator-runbook](/documents/zero-trust-policy-evaluator-runbook.md)
