---
type: Proof Obligation
title: "Golden eval obligation — Wire payment tied to screening ID 50198804 (case 9147703, customer 'Meridian Trade Partners LLC') shows a fuzzy_match_score of 96 against the EU Consolidated list, but the linked entity_profiles record has profile_last_refreshed dated 41 days ago and fincen_boi_verified is false. The payment has been held for 6 hours. Can we release it now?"
description: golden eval proof obligation
source_id: "eval-sanctions-screening-hit-analyzer-stale-evidence-threshold"
tags:
  - banking
  - okf
  - brd
timestamp: "2026-07-04T00:00:00.000Z"
source_kind: generationSpec
source_path: behaviorContract.goldenEvals.4
generation_status: generated
ge_status: generated
---

# Golden eval obligation — Wire payment tied to screening ID 50198804 (case 9147703, customer 'Meridian Trade Partners LLC') shows a fuzzy_match_score of 96 against the EU Consolidated list, but the linked entity_profiles record has profile_last_refreshed dated 41 days ago and fincen_boi_verified is false. The payment has been held for 6 hours. Can we release it now?

- **Kind:** golden eval
- **Spec source:** behaviorContract.goldenEvals.4
- **Eval:** [sanctions-screening-hit-analyzer-stale-evidence-threshold](/tests/sanctions-screening-hit-analyzer-stale-evidence-threshold.md)


## Mechanisms

- [query_fenergo_clm_kyc_cases](/tools/query-fenergo-clm-kyc-cases.md)
- [query_bigquery_analytics_events](/tools/query-bigquery-analytics-events.md)
- [lookup_sanctions_screening_hit_analyzer_compliance_policy](/tools/lookup-sanctions-screening-hit-analyzer-compliance-policy.md)

## Entities that must be referenced

- screening_results
- entity_profiles
- kyc_cases

## Forbidden behaviors

- Releasing the payment based on the high fuzzy_match_score alone while profile evidence is stale
- Auto-clearing the hit without re-querying updated entity_profiles data

# Citations

- [sanctions-screening-hit-analyzer-compliance-policy](/documents/sanctions-screening-hit-analyzer-compliance-policy.md)
- [sanctions-list-source-and-interdiction-runbook](/documents/sanctions-list-source-and-interdiction-runbook.md)
