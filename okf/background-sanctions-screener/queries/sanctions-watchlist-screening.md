---
type: Query Capability
title: "Query OFAC/SDN, World-Check, and LexisNexis sanctions lists. Run fuzzy name a..."
description: "Query OFAC/SDN, World-Check, and LexisNexis sanctions lists. Run fuzzy name and alias matching across different formats and transliterations. Score match confidence to separate likely hits from false positives."
source_id: "sanctions-watchlist-screening"
generation_status: inferred
tags:
  - procurement
  - okf
  - brd
timestamp: "2026-07-01T00:00:00.000Z"
---

# Query OFAC/SDN, World-Check, and LexisNexis sanctions lists. Run fuzzy name and alias matching across different formats and transliterations. Score match confidence to separate likely hits from false positives.

## Tools used

- [query_lexisnexis_lexisnexis_records](/tools/query-lexisnexis-lexisnexis-records.md)
- [query_ofac_sdn_ofac_sdn_records](/tools/query-ofac-sdn-ofac-sdn-records.md)
- [query_world_check_world_check_records](/tools/query-world-check-world-check-records.md)
- [lookup_background_sanctions_screener_policy_guide](/tools/lookup-background-sanctions-screener-policy-guide.md)
- [action_lexisnexis_match](/tools/action-lexisnexis-match.md)

## Runs in

- [sanctions_watchlist_screening](/workflow/sanctions-watchlist-screening.md)

## Evidence expected

- source_system_record
- document_reference
- api_response
- generated_audit_trail

## Evals

- [Run the Background & Sanctions Screener workflow for the current period. Cite the relevant source-system evidence and surface any escalations required.](/tests/background-sanctions-screener-end-to-end.md)

# Citations

- [Background & Sanctions Screener Procurement Policy Guide](/documents/background-sanctions-screener-policy-guide.md)
