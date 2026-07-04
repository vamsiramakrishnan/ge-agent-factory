---
type: Workflow Stage
title: "Sanctions & Watchlist Screening"
description: "Query OFAC/SDN, World-Check, and LexisNexis sanctions lists. Run fuzzy name and alias matching across different formats and transliterations. Score match confidence to separate likely hits from false positives."
source_id: sanctions_watchlist_screening
tags:
  - procurement
  - okf
  - brd
timestamp: "2026-07-01T00:00:00.000Z"
---

# Sanctions & Watchlist Screening

Query OFAC/SDN, World-Check, and LexisNexis sanctions lists. Run fuzzy name and alias matching across different formats and transliterations. Score match confidence to separate likely hits from false positives.

- **Mode:** sequential
- **Stage:** 1 of 3

## Tools

- [query_lexisnexis_lexisnexis_records](/tools/query-lexisnexis-lexisnexis-records.md)
- [query_ofac_sdn_ofac_sdn_records](/tools/query-ofac-sdn-ofac-sdn-records.md)
- [query_world_check_world_check_records](/tools/query-world-check-world-check-records.md)
- [lookup_background_sanctions_screener_policy_guide](/tools/lookup-background-sanctions-screener-policy-guide.md)
- [action_lexisnexis_match](/tools/action-lexisnexis-match.md)

Next: [Entity Resolution & Fuzzy Matching](/workflow/entity-resolution-fuzzy-matching.md)
