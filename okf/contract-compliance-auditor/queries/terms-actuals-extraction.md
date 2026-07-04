---
type: Query Capability
title: "Pull contract terms (pricing schedules, volume commitments, rebate tiers) fro..."
description: "Pull contract terms (pricing schedules, volume commitments, rebate tiers) from CLM. Extract actual PO/invoice data from ERP. Stage both in BigQuery for compliance matching."
source_id: "terms-actuals-extraction"
generation_status: inferred
tags:
  - procurement
  - okf
  - brd
timestamp: "2026-07-01T00:00:00.000Z"
---

# Pull contract terms (pricing schedules, volume commitments, rebate tiers) from CLM. Extract actual PO/invoice data from ERP. Stage both in BigQuery for compliance matching.

## Tools used

- [query_icertis_pricing_schedules](/tools/query-icertis-pricing-schedules.md)
- [query_icertis_rebate_tiers](/tools/query-icertis-rebate-tiers.md)
- [query_sap_s4hana_invoice_actuals](/tools/query-sap-s4hana-invoice-actuals.md)
- [query_bigquery_variance_calculations](/tools/query-bigquery-variance-calculations.md)
- [query_bigquery_rebate_threshold_status](/tools/query-bigquery-rebate-threshold-status.md)
- [action_email_publish_compliance_report](/tools/action-email-publish-compliance-report.md)
- [action_servicenow_create_compliance_ticket](/tools/action-servicenow-create-compliance-ticket.md)
- [evidence_pricing_formula_policy](/tools/evidence-pricing-formula-policy.md)

## Runs in

- [terms_actuals_extraction](/workflow/terms-actuals-extraction.md)

## Evidence expected

- source_system_record
- sql_result
- api_response
- document_reference

## Evals

- [Run monthly compliance audit for Contract-5029 (LME aluminum supplier). Compare pricing schedules against PO and invoice actuals for Q2 2026. Identify pricing overcharges and rebate cliff status.](/tests/monthly-compliance-happy-path.md)
- [Contract-4107 has a rebate tier: 90% volume commitment = $500K rebate. Current volume is at 88% with 45 days remaining in the term. Recommend action.](/tests/rebate-cliff-opportunity-narrative.md)
- [Contract-3991 pricing: 'LME aluminum index ± 3% dead band, capped at 6%.' Current index moved 5% this quarter. Validate pricing adjustment against policy.](/tests/index-formula-validation-with-policy.md)

# Citations

- [Procurement Contract Compliance Policy](/documents/procurement-contract-compliance-policy.md)
- [Complex Pricing Formula Interpretation Guide](/documents/complex-pricing-formula-guide.md)
