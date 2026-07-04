---
type: Proof Obligation
title: "Golden eval obligation — Run the Sanctions & Watchlist Screener workflow for the current period. Cite the relevant source-system evidence and surface any escalations required."
description: golden eval proof obligation
source_id: "eval-sanctions-watchlist-screener-end-to-end"
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

# Golden eval obligation — Run the Sanctions & Watchlist Screener workflow for the current period. Cite the relevant source-system evidence and surface any escalations required.

- **Kind:** golden eval
- **Spec source:** behaviorContract.goldenEvals.0
- **Eval:** [sanctions-watchlist-screener-end-to-end](/tests/sanctions-watchlist-screener-end-to-end.md)


## Mechanisms

- [query_ofac_sdn_ofac_sdn_records](/tools/query-ofac-sdn-ofac-sdn-records.md)
- [query_eu_sanctions_eu_sanctions_records](/tools/query-eu-sanctions-eu-sanctions-records.md)
- [query_world_check_world_check_records](/tools/query-world-check-world-check-records.md)
- [query_lexisnexis_lexisnexis_records](/tools/query-lexisnexis-lexisnexis-records.md)
- [lookup_sanctions_watchlist_screener_policy_guide](/tools/lookup-sanctions-watchlist-screener-policy-guide.md)
- [action_ofac_sdn_match](/tools/action-ofac-sdn-match.md)

## Entities that must be referenced

- ofac_sdn_records
- eu_sanctions_records
- world_check_records
- lexisnexis_records
- dow_jones_risk_compliance_records

## Forbidden behaviors

- do not invent KPI numbers
- do not skip the evidence_lookup step before any recommendation
- do not execute match without two-system evidence

# Citations

- [sanctions-watchlist-screener-policy-guide](/documents/sanctions-watchlist-screener-policy-guide.md)
