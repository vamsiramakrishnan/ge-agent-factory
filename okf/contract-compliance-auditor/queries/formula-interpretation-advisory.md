---
type: Query Capability
title: "Gemini interprets complex pricing structures — index-based adjustments with d..."
description: "Gemini interprets complex pricing structures — index-based adjustments with dead bands and caps — and validates supplier quarterly price adjustment letters. Identifies rebate cliff opportunities: 'At 92% of volume commitment with 45 days left, purchasing 8% more triggers $180K retrospective rebate.' Generates actionable compliance exception reports."
source_id: "formula-interpretation-advisory"
generation_status: inferred
tags:
  - procurement
  - okf
  - brd
timestamp: "2026-07-01T00:00:00.000Z"
---

# Gemini interprets complex pricing structures — index-based adjustments with dead bands and caps — and validates supplier quarterly price adjustment letters. Identifies rebate cliff opportunities: 'At 92% of volume commitment with 45 days left, purchasing 8% more triggers $180K retrospective rebate.' Generates actionable compliance exception reports.

## Tools used

- [query_icertis_pricing_schedules](/tools/query-icertis-pricing-schedules.md)
- [query_icertis_rebate_tiers](/tools/query-icertis-rebate-tiers.md)
- [query_bigquery_rebate_threshold_status](/tools/query-bigquery-rebate-threshold-status.md)
- [action_email_publish_compliance_report](/tools/action-email-publish-compliance-report.md)
- [action_servicenow_create_compliance_ticket](/tools/action-servicenow-create-compliance-ticket.md)
- [evidence_pricing_formula_policy](/tools/evidence-pricing-formula-policy.md)

## Runs in

- [formula_interpretation_advisory](/workflow/formula-interpretation-advisory.md)

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
