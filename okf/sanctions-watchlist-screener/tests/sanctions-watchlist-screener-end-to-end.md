---
type: Eval Scenario
title: "Run the Sanctions & Watchlist Screener workflow for the current period. Cite ..."
description: "Run the Sanctions & Watchlist Screener workflow for the current period. Cite the relevant source-system evidence and surface any escalations required."
source_id: "sanctions-watchlist-screener-end-to-end"
generation_status: inferred
tags:
  - procurement
  - okf
  - brd
timestamp: "2026-07-01T00:00:00.000Z"
---

# Run the Sanctions & Watchlist Screener workflow for the current period. Cite the relevant source-system evidence and surface any escalations required.

## Validates

- [batch-event-screening](/queries/batch-event-screening.md)

## Mechanisms to call

- [query_ofac_sdn_ofac_sdn_records](/tools/query-ofac-sdn-ofac-sdn-records.md)
- [query_eu_sanctions_eu_sanctions_records](/tools/query-eu-sanctions-eu-sanctions-records.md)
- [query_world_check_world_check_records](/tools/query-world-check-world-check-records.md)
- [query_lexisnexis_lexisnexis_records](/tools/query-lexisnexis-lexisnexis-records.md)
- [lookup_sanctions_watchlist_screener_policy_guide](/tools/lookup-sanctions-watchlist-screener-policy-guide.md)
- [action_ofac_sdn_match](/tools/action-ofac-sdn-match.md)

## Success rubric

Action match executed against OFAC/SDN, with audit-trail entry and Compliance Manager notified of outcomes.

# Citations

- [Sanctions & Watchlist Screener Procurement Policy Guide](/documents/sanctions-watchlist-screener-policy-guide.md)
