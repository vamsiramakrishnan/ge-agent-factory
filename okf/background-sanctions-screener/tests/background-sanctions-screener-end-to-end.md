---
type: Eval Scenario
title: "Run the Background & Sanctions Screener workflow for the current period. Cite..."
description: "Run the Background & Sanctions Screener workflow for the current period. Cite the relevant source-system evidence and surface any escalations required."
source_id: "background-sanctions-screener-end-to-end"
generation_status: inferred
tags:
  - procurement
  - okf
  - brd
timestamp: "2026-07-01T00:00:00.000Z"
---

# Run the Background & Sanctions Screener workflow for the current period. Cite the relevant source-system evidence and surface any escalations required.

## Validates

- [sanctions-watchlist-screening](/queries/sanctions-watchlist-screening.md)

## Mechanisms to call

- [query_lexisnexis_lexisnexis_records](/tools/query-lexisnexis-lexisnexis-records.md)
- [query_ofac_sdn_ofac_sdn_records](/tools/query-ofac-sdn-ofac-sdn-records.md)
- [query_world_check_world_check_records](/tools/query-world-check-world-check-records.md)
- [query_d_b_d_b_records](/tools/query-d-b-d-b-records.md)
- [lookup_background_sanctions_screener_policy_guide](/tools/lookup-background-sanctions-screener-policy-guide.md)
- [action_lexisnexis_match](/tools/action-lexisnexis-match.md)

## Success rubric

Action match executed against LexisNexis, with audit-trail entry and Compliance Manager notified of outcomes.

# Citations

- [Background & Sanctions Screener Procurement Policy Guide](/documents/background-sanctions-screener-policy-guide.md)
