---
type: Eval Scenario
title: "Run monthly compliance audit for Contract-5029 (LME aluminum supplier). Compa..."
description: "Run monthly compliance audit for Contract-5029 (LME aluminum supplier). Compare pricing schedules against PO and invoice actuals for Q2 2026. Identify pricing overcharges and rebate cliff status."
source_id: "monthly-compliance-happy-path"
generation_status: inferred
tags:
  - procurement
  - okf
  - brd
timestamp: "2026-07-01T00:00:00.000Z"
---

# Run monthly compliance audit for Contract-5029 (LME aluminum supplier). Compare pricing schedules against PO and invoice actuals for Q2 2026. Identify pricing overcharges and rebate cliff status.

## Validates

- [terms-actuals-extraction](/queries/terms-actuals-extraction.md)

## Mechanisms to call

- [query_icertis_contracts](/tools/query-icertis-contracts.md)
- [query_icertis_pricing_schedules](/tools/query-icertis-pricing-schedules.md)
- [query_icertis_rebate_tiers](/tools/query-icertis-rebate-tiers.md)
- [query_sap_s4hana_purchase_orders](/tools/query-sap-s4hana-purchase-orders.md)
- [query_sap_s4hana_invoice_actuals](/tools/query-sap-s4hana-invoice-actuals.md)
- [query_bigquery_variance_calculations](/tools/query-bigquery-variance-calculations.md)
- [query_bigquery_rebate_threshold_status](/tools/query-bigquery-rebate-threshold-status.md)
- [evidence_pricing_formula_policy](/tools/evidence-pricing-formula-policy.md)

## Success rubric

Compliance report generated with pricing variance summary, rebate cliff alert, and financial impact; exception records created.

# Citations

- [Procurement Contract Compliance Policy](/documents/procurement-contract-compliance-policy.md)
