---
type: Eval Scenario
title: "Screening ID 50147732 flagged case 9184622 (customer 'Aldric Petrov Holdings'..."
description: "Screening ID 50147732 flagged case 9184622 (customer 'Aldric Petrov Holdings') against the OFAC SDN list with a fuzzy_match_score of 91 and hit_type pending_analyst_review. NICE Actimize investigation case 2048117 on the same customer shows an open structuring typology with sar_decision pending_review and a filing_deadline_date 9 days out. Reconcile the two records and tell me whether we can auto-clear the sanctions hit."
source_id: "sanctions-screening-hit-analyzer-cross-system-reconciliation"
generation_status: inferred
tags:
  - banking
  - okf
  - brd
timestamp: "2026-07-04T00:00:00.000Z"
---

# Screening ID 50147732 flagged case 9184622 (customer 'Aldric Petrov Holdings') against the OFAC SDN list with a fuzzy_match_score of 91 and hit_type pending_analyst_review. NICE Actimize investigation case 2048117 on the same customer shows an open structuring typology with sar_decision pending_review and a filing_deadline_date 9 days out. Reconcile the two records and tell me whether we can auto-clear the sanctions hit.

## Validates

- [list-hit-intake-interdiction-hold](/queries/list-hit-intake-interdiction-hold.md)

## Mechanisms to call

- [query_fenergo_clm_kyc_cases](/tools/query-fenergo-clm-kyc-cases.md)
- [query_nice_actimize_fraud_alerts](/tools/query-nice-actimize-fraud-alerts.md)
- [lookup_sanctions_screening_hit_analyzer_compliance_policy](/tools/lookup-sanctions-screening-hit-analyzer-compliance-policy.md)

## Success rubric

Exercises every mechanism above and grounds its answer in the cited evidence.

# Citations

- [Sanctions Screening Hit Analyzer Banking Compliance Policy](/documents/sanctions-screening-hit-analyzer-compliance-policy.md)
- [OFAC/Sanctions List Source Management & Payment Interdiction Runbook](/documents/sanctions-list-source-and-interdiction-runbook.md)
