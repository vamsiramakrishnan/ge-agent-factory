---
type: Query Capability
title: Name/alias matching across transliterations and entity formats with configura...
description: Name/alias matching across transliterations and entity formats with configurable confidence thresholds. PEP screening with match confidence scoring against global sanctions databases.
source_id: "fuzzy-entity-matching"
generation_status: inferred
tags:
  - procurement
  - okf
  - brd
timestamp: "2026-07-01T00:00:00.000Z"
---

# Name/alias matching across transliterations and entity formats with configurable confidence thresholds. PEP screening with match confidence scoring against global sanctions databases.

## Tools used

- [query_eu_sanctions_eu_sanctions_records](/tools/query-eu-sanctions-eu-sanctions-records.md)
- [lookup_sanctions_watchlist_screener_policy_guide](/tools/lookup-sanctions-watchlist-screener-policy-guide.md)
- [action_ofac_sdn_match](/tools/action-ofac-sdn-match.md)

## Runs in

- [fuzzy_entity_matching](/workflow/fuzzy-entity-matching.md)

## Evidence expected

- source_system_record
- document_reference
- api_response
- generated_audit_trail

## Evals

- [Run the Sanctions & Watchlist Screener workflow for the current period. Cite the relevant source-system evidence and surface any escalations required.](/tests/sanctions-watchlist-screener-end-to-end.md)

# Citations

- [Sanctions & Watchlist Screener Procurement Policy Guide](/documents/sanctions-watchlist-screener-policy-guide.md)
