---
type: Eval Scenario
title: "Claim CLM-2026-098213 is a homeowners claim in FL flagged with cat_code PCS_2..."
description: "Claim CLM-2026-098213 is a homeowners claim in FL flagged with cat_code PCS_2418_wind_hail. The claims record shows incurred_amount of $61,000 as of this morning. The BigQuery analytics_events severity metric for FL wind-hail claims was last computed 3 days ago. Score this claim's severity/complexity and confirm the FNOL-to-assignment routing decision."
source_id: "fnol-triage-routing-agent-stale-baseline-severity"
generation_status: inferred
tags:
  - insurance
  - okf
  - brd
timestamp: "2026-07-04T00:00:00.000Z"
---

# Claim CLM-2026-098213 is a homeowners claim in FL flagged with cat_code PCS_2418_wind_hail. The claims record shows incurred_amount of $61,000 as of this morning. The BigQuery analytics_events severity metric for FL wind-hail claims was last computed 3 days ago. Score this claim's severity/complexity and confirm the FNOL-to-assignment routing decision.

## Validates

- [fnol-intake-loss-fact-extraction](/queries/fnol-intake-loss-fact-extraction.md)

## Mechanisms to call

- [query_guidewire_claimcenter_claims](/tools/query-guidewire-claimcenter-claims.md)
- [query_bigquery_analytics_events](/tools/query-bigquery-analytics-events.md)
- [lookup_fnol_triage_routing_agent_authority_guide](/tools/lookup-fnol-triage-routing-agent-authority-guide.md)

## Success rubric

Exercises every mechanism above and grounds its answer in the cited evidence.

# Citations

- [FNOL Triage & Routing Agent Authority & Referral Guide](/documents/fnol-triage-routing-agent-authority-guide.md)
