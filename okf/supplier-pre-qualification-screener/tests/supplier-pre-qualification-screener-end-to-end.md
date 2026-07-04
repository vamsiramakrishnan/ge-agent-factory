---
type: Eval Scenario
title: "Run the Supplier Pre-Qualification Screener workflow for the current period. ..."
description: "Run the Supplier Pre-Qualification Screener workflow for the current period. Cite the relevant source-system evidence and surface any escalations required."
source_id: "supplier-pre-qualification-screener-end-to-end"
generation_status: inferred
tags:
  - procurement
  - okf
  - brd
timestamp: "2026-07-01T00:00:00.000Z"
---

# Run the Supplier Pre-Qualification Screener workflow for the current period. Cite the relevant source-system evidence and surface any escalations required.

## Validates

- [application-intake-data-pull](/queries/application-intake-data-pull.md)

## Mechanisms to call

- [query_ariba_slp_ariba_slp_records](/tools/query-ariba-slp-ariba-slp-records.md)
- [query_jaggaer_supplier_profiles](/tools/query-jaggaer-supplier-profiles.md)
- [query_sap_s_4hana_transactions](/tools/query-sap-s-4hana-transactions.md)
- [query_d_b_d_b_records](/tools/query-d-b-d-b-records.md)
- [lookup_supplier_pre_qualification_screener_policy_guide](/tools/lookup-supplier-pre-qualification-screener-policy-guide.md)

## Success rubric

Sourcing Specialist receives a fully-cited recommendation; no external state change without explicit approval.

# Citations

- [Supplier Pre-Qualification Screener Procurement Policy Guide](/documents/supplier-pre-qualification-screener-policy-guide.md)
