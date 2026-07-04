---
type: Workflow Stage
title: "Terms & Actuals Extraction"
description: "Pull contract terms (pricing schedules, volume commitments, rebate tiers) from CLM. Extract actual PO/invoice data from ERP. Stage both in BigQuery for compliance matching."
source_id: terms_actuals_extraction
tags:
  - procurement
  - okf
  - brd
timestamp: "2026-07-01T00:00:00.000Z"
---

# Terms & Actuals Extraction

Pull contract terms (pricing schedules, volume commitments, rebate tiers) from CLM. Extract actual PO/invoice data from ERP. Stage both in BigQuery for compliance matching.

- **Mode:** sequential
- **Stage:** 1 of 3

## Tools

- [query_icertis_pricing_schedules](/tools/query-icertis-pricing-schedules.md)
- [query_icertis_rebate_tiers](/tools/query-icertis-rebate-tiers.md)
- [query_sap_s4hana_invoice_actuals](/tools/query-sap-s4hana-invoice-actuals.md)
- [query_bigquery_variance_calculations](/tools/query-bigquery-variance-calculations.md)
- [query_bigquery_rebate_threshold_status](/tools/query-bigquery-rebate-threshold-status.md)
- [action_email_publish_compliance_report](/tools/action-email-publish-compliance-report.md)
- [action_servicenow_create_compliance_ticket](/tools/action-servicenow-create-compliance-ticket.md)
- [evidence_pricing_formula_policy](/tools/evidence-pricing-formula-policy.md)

Next: [Pricing & Volume Compliance Analysis](/workflow/pricing-volume-compliance-analysis.md)
