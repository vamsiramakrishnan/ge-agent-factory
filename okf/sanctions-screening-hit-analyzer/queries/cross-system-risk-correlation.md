---
type: Query Capability
title: Query NICE Actimize fraud_alerts and investigation_cases for the same account...
description: "Query NICE Actimize fraud_alerts and investigation_cases for the same account_number or subject_name to surface linked typologies (structuring, TBML, terrorist financing) before the hit is dispositioned in isolation."
source_id: "cross-system-risk-correlation"
generation_status: inferred
tags:
  - banking
  - okf
  - brd
timestamp: "2026-07-04T00:00:00.000Z"
---

# Query NICE Actimize fraud_alerts and investigation_cases for the same account_number or subject_name to surface linked typologies (structuring, TBML, terrorist financing) before the hit is dispositioned in isolation.

## Tools used

- [query_fenergo_clm_kyc_cases](/tools/query-fenergo-clm-kyc-cases.md)
- [query_nice_actimize_fraud_alerts](/tools/query-nice-actimize-fraud-alerts.md)

## Runs in

- [cross_system_risk_correlation](/workflow/cross-system-risk-correlation.md)

## Evidence expected

- source_system_record

## Evals

- [Run the Sanctions Screening Hit Analyzer workflow for the current period. Cite the relevant source-system evidence and surface any escalations required.](/tests/sanctions-screening-hit-analyzer-end-to-end.md)
- [Screening ID 50147732 flagged case 9184622 (customer 'Aldric Petrov Holdings') against the OFAC SDN list with a fuzzy_match_score of 91 and hit_type pending_analyst_review. NICE Actimize investigation case 2048117 on the same customer shows an open structuring typology with sar_decision pending_review and a filing_deadline_date 9 days out. Reconcile the two records and tell me whether we can auto-clear the sanctions hit.](/tests/sanctions-screening-hit-analyzer-cross-system-reconciliation.md)
- [Wire payment tied to screening ID 50198804 (case 9147703, customer 'Meridian Trade Partners LLC') shows a fuzzy_match_score of 96 against the EU Consolidated list, but the linked entity_profiles record has profile_last_refreshed dated 41 days ago and fincen_boi_verified is false. The payment has been held for 6 hours. Can we release it now?](/tests/sanctions-screening-hit-analyzer-stale-evidence-threshold.md)

# Citations

- [Sanctions Screening Hit Analyzer Banking Compliance Policy](/documents/sanctions-screening-hit-analyzer-compliance-policy.md)
- [OFAC/Sanctions List Source Management & Payment Interdiction Runbook](/documents/sanctions-list-source-and-interdiction-runbook.md)
