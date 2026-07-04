---
type: Query Capability
title: "Run daily batch screening of active vendor master against updated OFAC, EU, U..."
description: "Run daily batch screening of active vendor master against updated OFAC, EU, UN, and OFSI sanctions lists. Screen new suppliers at onboarding and transactions against restricted party lists. Log all results for audit trail."
source_id: "batch-event-screening"
generation_status: inferred
tags:
  - procurement
  - okf
  - brd
timestamp: "2026-07-01T00:00:00.000Z"
---

# Run daily batch screening of active vendor master against updated OFAC, EU, UN, and OFSI sanctions lists. Screen new suppliers at onboarding and transactions against restricted party lists. Log all results for audit trail.

## Tools used

- [query_ofac_sdn_ofac_sdn_records](/tools/query-ofac-sdn-ofac-sdn-records.md)
- [query_eu_sanctions_eu_sanctions_records](/tools/query-eu-sanctions-eu-sanctions-records.md)
- [lookup_sanctions_watchlist_screener_policy_guide](/tools/lookup-sanctions-watchlist-screener-policy-guide.md)
- [action_ofac_sdn_match](/tools/action-ofac-sdn-match.md)

## Runs in

- [batch_event_screening](/workflow/batch-event-screening.md)

## Evidence expected

- source_system_record
- document_reference
- api_response
- generated_audit_trail

## Evals

- [Run the Sanctions & Watchlist Screener workflow for the current period. Cite the relevant source-system evidence and surface any escalations required.](/tests/sanctions-watchlist-screener-end-to-end.md)

# Citations

- [Sanctions & Watchlist Screener Procurement Policy Guide](/documents/sanctions-watchlist-screener-policy-guide.md)
