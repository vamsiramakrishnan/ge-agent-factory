---
type: Proof Obligation
title: "Golden eval obligation — Run monthly compliance audit for Contract-5029 (LME aluminum supplier). Compare pricing schedules against PO and invoice actuals for Q2 2026. Identify pricing overcharges and rebate cliff status."
description: golden eval proof obligation
source_id: "eval-monthly-compliance-happy-path"
tags:
  - procurement
  - okf
  - brd
timestamp: "2026-07-01T00:00:00.000Z"
source_kind: generationSpec
source_path: behaviorContract.goldenEvals.0
generation_status: generated
ge_status: generated
---

# Golden eval obligation — Run monthly compliance audit for Contract-5029 (LME aluminum supplier). Compare pricing schedules against PO and invoice actuals for Q2 2026. Identify pricing overcharges and rebate cliff status.

- **Kind:** golden eval
- **Spec source:** behaviorContract.goldenEvals.0
- **Eval:** [monthly-compliance-happy-path](/tests/monthly-compliance-happy-path.md)


## Mechanisms

- [query_icertis_contracts](/tools/query-icertis-contracts.md)
- [query_icertis_pricing_schedules](/tools/query-icertis-pricing-schedules.md)
- [query_icertis_rebate_tiers](/tools/query-icertis-rebate-tiers.md)
- [query_sap_s4hana_purchase_orders](/tools/query-sap-s4hana-purchase-orders.md)
- [query_sap_s4hana_invoice_actuals](/tools/query-sap-s4hana-invoice-actuals.md)
- [query_bigquery_variance_calculations](/tools/query-bigquery-variance-calculations.md)
- [query_bigquery_rebate_threshold_status](/tools/query-bigquery-rebate-threshold-status.md)
- [evidence_pricing_formula_policy](/tools/evidence-pricing-formula-policy.md)

## Entities that must be referenced

- contracts
- pricing_schedules
- rebate_tiers
- invoice_actuals
- compliance_exceptions

## Forbidden behaviors

- do not invent overcharge amounts
- do not skip volume threshold proximity check
- do not claim rebate cliff without citing threshold and remaining days

# Citations

- [procurement-contract-compliance-policy](/documents/procurement-contract-compliance-policy.md)
