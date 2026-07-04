---
type: Workflow Stage
title: "Batch & Event Screening"
description: "Run daily batch screening of active vendor master against updated OFAC, EU, UN, and OFSI sanctions lists. Screen new suppliers at onboarding and transactions against restricted party lists. Log all results for audit trail."
source_id: batch_event_screening
tags:
  - procurement
  - okf
  - brd
timestamp: "2026-07-01T00:00:00.000Z"
---

# Batch & Event Screening

Run daily batch screening of active vendor master against updated OFAC, EU, UN, and OFSI sanctions lists. Screen new suppliers at onboarding and transactions against restricted party lists. Log all results for audit trail.

- **Mode:** sequential
- **Stage:** 1 of 3

## Tools

- [query_ofac_sdn_ofac_sdn_records](/tools/query-ofac-sdn-ofac-sdn-records.md)
- [query_eu_sanctions_eu_sanctions_records](/tools/query-eu-sanctions-eu-sanctions-records.md)
- [lookup_sanctions_watchlist_screener_policy_guide](/tools/lookup-sanctions-watchlist-screener-policy-guide.md)
- [action_ofac_sdn_match](/tools/action-ofac-sdn-match.md)

Next: [Fuzzy Entity Matching](/workflow/fuzzy-entity-matching.md)
