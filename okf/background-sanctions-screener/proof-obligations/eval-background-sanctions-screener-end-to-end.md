---
type: Proof Obligation
title: "Golden eval obligation — Run the Background & Sanctions Screener workflow for the current period. Cite the relevant source-system evidence and surface any escalations required."
description: golden eval proof obligation
source_id: "eval-background-sanctions-screener-end-to-end"
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

# Golden eval obligation — Run the Background & Sanctions Screener workflow for the current period. Cite the relevant source-system evidence and surface any escalations required.

- **Kind:** golden eval
- **Spec source:** behaviorContract.goldenEvals.0
- **Eval:** [background-sanctions-screener-end-to-end](/tests/background-sanctions-screener-end-to-end.md)


## Mechanisms

- [query_lexisnexis_lexisnexis_records](/tools/query-lexisnexis-lexisnexis-records.md)
- [query_ofac_sdn_ofac_sdn_records](/tools/query-ofac-sdn-ofac-sdn-records.md)
- [query_world_check_world_check_records](/tools/query-world-check-world-check-records.md)
- [query_d_b_d_b_records](/tools/query-d-b-d-b-records.md)
- [lookup_background_sanctions_screener_policy_guide](/tools/lookup-background-sanctions-screener-policy-guide.md)
- [action_lexisnexis_match](/tools/action-lexisnexis-match.md)

## Entities that must be referenced

- lexisnexis_records
- ofac_sdn_records
- world_check_records
- d_b_records

## Forbidden behaviors

- do not invent KPI numbers
- do not skip the evidence_lookup step before any recommendation
- do not execute match without two-system evidence

# Citations

- [background-sanctions-screener-policy-guide](/documents/background-sanctions-screener-policy-guide.md)
