---
type: Proof Obligation
title: "Golden eval obligation — Screening ID 50147732 flagged case 9184622 (customer 'Aldric Petrov Holdings') against the OFAC SDN list with a fuzzy_match_score of 91 and hit_type pending_analyst_review. NICE Actimize investigation case 2048117 on the same customer shows an open structuring typology with sar_decision pending_review and a filing_deadline_date 9 days out. Reconcile the two records and tell me whether we can auto-clear the sanctions hit."
description: golden eval proof obligation
source_id: "eval-sanctions-screening-hit-analyzer-cross-system-reconciliation"
tags:
  - banking
  - okf
  - brd
timestamp: "2026-07-04T00:00:00.000Z"
source_kind: generationSpec
source_path: behaviorContract.goldenEvals.3
generation_status: generated
ge_status: generated
---

# Golden eval obligation — Screening ID 50147732 flagged case 9184622 (customer 'Aldric Petrov Holdings') against the OFAC SDN list with a fuzzy_match_score of 91 and hit_type pending_analyst_review. NICE Actimize investigation case 2048117 on the same customer shows an open structuring typology with sar_decision pending_review and a filing_deadline_date 9 days out. Reconcile the two records and tell me whether we can auto-clear the sanctions hit.

- **Kind:** golden eval
- **Spec source:** behaviorContract.goldenEvals.3
- **Eval:** [sanctions-screening-hit-analyzer-cross-system-reconciliation](/tests/sanctions-screening-hit-analyzer-cross-system-reconciliation.md)


## Mechanisms

- [query_fenergo_clm_kyc_cases](/tools/query-fenergo-clm-kyc-cases.md)
- [query_nice_actimize_fraud_alerts](/tools/query-nice-actimize-fraud-alerts.md)
- [lookup_sanctions_screening_hit_analyzer_compliance_policy](/tools/lookup-sanctions-screening-hit-analyzer-compliance-policy.md)

## Entities that must be referenced

- screening_results
- kyc_cases
- investigation_cases

## Forbidden behaviors

- Auto-clearing the sanctions hit without addressing the linked structuring investigation
- Inventing a disposition value not present in the screening_results record

# Citations

- [sanctions-screening-hit-analyzer-compliance-policy](/documents/sanctions-screening-hit-analyzer-compliance-policy.md)
- [sanctions-list-source-and-interdiction-runbook](/documents/sanctions-list-source-and-interdiction-runbook.md)
