---
type: Eval Scenario
title: "Wire payment tied to screening ID 50198804 (case 9147703, customer 'Meridian ..."
description: "Wire payment tied to screening ID 50198804 (case 9147703, customer 'Meridian Trade Partners LLC') shows a fuzzy_match_score of 96 against the EU Consolidated list, but the linked entity_profiles record has profile_last_refreshed dated 41 days ago and fincen_boi_verified is false. The payment has been held for 6 hours. Can we release it now?"
source_id: "sanctions-screening-hit-analyzer-stale-evidence-threshold"
generation_status: inferred
tags:
  - banking
  - okf
  - brd
timestamp: "2026-07-04T00:00:00.000Z"
---

# Wire payment tied to screening ID 50198804 (case 9147703, customer 'Meridian Trade Partners LLC') shows a fuzzy_match_score of 96 against the EU Consolidated list, but the linked entity_profiles record has profile_last_refreshed dated 41 days ago and fincen_boi_verified is false. The payment has been held for 6 hours. Can we release it now?

## Validates

- [audit-trail-kpi-reporting](/queries/audit-trail-kpi-reporting.md)

## Mechanisms to call

- [query_fenergo_clm_kyc_cases](/tools/query-fenergo-clm-kyc-cases.md)
- [query_bigquery_analytics_events](/tools/query-bigquery-analytics-events.md)
- [lookup_sanctions_screening_hit_analyzer_compliance_policy](/tools/lookup-sanctions-screening-hit-analyzer-compliance-policy.md)

## Success rubric

Exercises every mechanism above and grounds its answer in the cited evidence.

# Citations

- [Sanctions Screening Hit Analyzer Banking Compliance Policy](/documents/sanctions-screening-hit-analyzer-compliance-policy.md)
- [OFAC/Sanctions List Source Management & Payment Interdiction Runbook](/documents/sanctions-list-source-and-interdiction-runbook.md)
