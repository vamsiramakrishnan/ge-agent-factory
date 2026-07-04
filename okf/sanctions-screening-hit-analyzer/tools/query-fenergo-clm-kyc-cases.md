---
type: Agent Tool
title: query_fenergo_clm_kyc_cases
description: Retrieve kyc cases from Fenergo CLM for the Sanctions Screening Hit Analyzer workflow.
tags:
  - banking
  - okf
  - brd
timestamp: "2026-07-04T00:00:00.000Z"
source_kind: generationSpec
source_path: behaviorContract.toolIntents
generation_status: generated
ge_status: generated
---

# query_fenergo_clm_kyc_cases

Retrieve kyc cases from Fenergo CLM for the Sanctions Screening Hit Analyzer workflow.

- **Kind:** query
- **Source system:** [Fenergo CLM](/systems/fenergo-clm.md)

## Inputs

- case_id
- date_range

## Outputs

- kyc_cases_records
- kyc_cases_summary

## Side Effects

- No mutation is declared by the spec for this tool.

## Idempotency

No idempotency key declared; no mutation is declared by the spec for this tool.

## Confirmation

No write confirmation policy is derivable from the spec.

## Permissions

No explicit permission scopes declared; source-system access is tied to [Fenergo CLM](/systems/fenergo-clm.md).

## Failure Modes

No explicit failure modes are declared in the spec; rely on refusal/escalation policies for unsafe or incomplete evidence.

## Used By

- [list_hit_intake_interdiction_hold](/workflow/list-hit-intake-interdiction-hold.md)
- [identity_match_verification](/workflow/identity-match-verification.md)
- [cross_system_risk_correlation](/workflow/cross-system-risk-correlation.md)
- [escalation_payment_release_decision](/workflow/escalation-payment-release-decision.md)
- [audit_trail_kpi_reporting](/workflow/audit-trail-kpi-reporting.md)

## Evals

- [Run the Sanctions Screening Hit Analyzer workflow for the current period. Cite the relevant source-system evidence and surface any escalations required.](/tests/sanctions-screening-hit-analyzer-end-to-end.md)
- [Screening ID 50147732 flagged case 9184622 (customer 'Aldric Petrov Holdings') against the OFAC SDN list with a fuzzy_match_score of 91 and hit_type pending_analyst_review. NICE Actimize investigation case 2048117 on the same customer shows an open structuring typology with sar_decision pending_review and a filing_deadline_date 9 days out. Reconcile the two records and tell me whether we can auto-clear the sanctions hit.](/tests/sanctions-screening-hit-analyzer-cross-system-reconciliation.md)
- [Wire payment tied to screening ID 50198804 (case 9147703, customer 'Meridian Trade Partners LLC') shows a fuzzy_match_score of 96 against the EU Consolidated list, but the linked entity_profiles record has profile_last_refreshed dated 41 days ago and fincen_boi_verified is false. The payment has been held for 6 hours. Can we release it now?](/tests/sanctions-screening-hit-analyzer-stale-evidence-threshold.md)

## Evidence emitted

- source_system_record

## Required inputs

- case_id
- date_range

## Produces

- kyc_cases_records
- kyc_cases_summary

# Examples

```
query_fenergo_clm_kyc_cases(case_id=<case_id>, date_range=<date_range>)
```

# Citations

- [Fenergo CLM](/systems/fenergo-clm.md)
