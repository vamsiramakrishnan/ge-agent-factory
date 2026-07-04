---
type: Workflow Stage
title: "Pricing & Volume Compliance Analysis"
description: Pricing compliance analysis comparing contracted price vs. actual invoiced price. Volume commitment tracking against targets. Rebate threshold monitoring and penalty trigger detection using statistical analysis.
source_id: pricing_volume_compliance_analysis
tags:
  - procurement
  - okf
  - brd
timestamp: "2026-07-01T00:00:00.000Z"
---

# Pricing & Volume Compliance Analysis

Pricing compliance analysis comparing contracted price vs. actual invoiced price. Volume commitment tracking against targets. Rebate threshold monitoring and penalty trigger detection using statistical analysis.

- **Mode:** sequential
- **Stage:** 2 of 3

## Tools

- [query_icertis_pricing_schedules](/tools/query-icertis-pricing-schedules.md)
- [query_icertis_rebate_tiers](/tools/query-icertis-rebate-tiers.md)
- [query_sap_s4hana_invoice_actuals](/tools/query-sap-s4hana-invoice-actuals.md)
- [query_bigquery_rebate_threshold_status](/tools/query-bigquery-rebate-threshold-status.md)
- [action_email_publish_compliance_report](/tools/action-email-publish-compliance-report.md)
- [action_servicenow_create_compliance_ticket](/tools/action-servicenow-create-compliance-ticket.md)
- [evidence_pricing_formula_policy](/tools/evidence-pricing-formula-policy.md)

Next: [Formula Interpretation & Advisory](/workflow/formula-interpretation-advisory.md)
