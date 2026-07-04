---
type: Proof Obligation
title: "Golden eval obligation — Run the Payment Optimization Agent workflow for the current period. Cite the relevant source-system evidence and surface any escalations required."
description: golden eval proof obligation
source_id: "eval-payment-optimization-agent-end-to-end"
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

# Golden eval obligation — Run the Payment Optimization Agent workflow for the current period. Cite the relevant source-system evidence and surface any escalations required.

- **Kind:** golden eval
- **Spec source:** behaviorContract.goldenEvals.0
- **Eval:** [payment-optimization-agent-end-to-end](/tests/payment-optimization-agent-end-to-end.md)


## Mechanisms

- [query_sap_s_4hana_fi_f110_gl_entries](/tools/query-sap-s-4hana-fi-f110-gl-entries.md)
- [query_taulia_taulia_records](/tools/query-taulia-taulia-records.md)
- [query_c2fo_c2fo_records](/tools/query-c2fo-c2fo-records.md)
- [query_treasury_systems_treasury_systems_records](/tools/query-treasury-systems-treasury-systems-records.md)
- [lookup_payment_optimization_agent_policy_guide](/tools/lookup-payment-optimization-agent-policy-guide.md)
- [action_sap_s_4hana_fi_f110_generate](/tools/action-sap-s-4hana-fi-f110-generate.md)

## Entities that must be referenced

- gl_entries
- taulia_records
- c2fo_records
- treasury_systems_records

## Forbidden behaviors

- do not invent KPI numbers
- do not skip the evidence_lookup step before any recommendation
- do not execute generate without two-system evidence

# Citations

- [payment-optimization-agent-policy-guide](/documents/payment-optimization-agent-policy-guide.md)
