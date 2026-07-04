---
type: Query Capability
title: Receive supplier application from Ariba SLP or Jaggaer. Trigger parallel data...
description: "Receive supplier application from Ariba SLP or Jaggaer. Trigger parallel data pulls from D&B for financial indicators and SAP vendor master for duplicate detection."
source_id: "application-intake-data-pull"
generation_status: inferred
tags:
  - procurement
  - okf
  - brd
timestamp: "2026-07-01T00:00:00.000Z"
---

# Receive supplier application from Ariba SLP or Jaggaer. Trigger parallel data pulls from D&B for financial indicators and SAP vendor master for duplicate detection.

## Tools used

- [query_ariba_slp_ariba_slp_records](/tools/query-ariba-slp-ariba-slp-records.md)
- [query_jaggaer_supplier_profiles](/tools/query-jaggaer-supplier-profiles.md)
- [query_sap_s_4hana_transactions](/tools/query-sap-s-4hana-transactions.md)
- [lookup_supplier_pre_qualification_screener_policy_guide](/tools/lookup-supplier-pre-qualification-screener-policy-guide.md)

## Runs in

- [application_intake_data_pull](/workflow/application-intake-data-pull.md)

## Evidence expected

- source_system_record
- document_reference

## Evals

- [Run the Supplier Pre-Qualification Screener workflow for the current period. Cite the relevant source-system evidence and surface any escalations required.](/tests/supplier-pre-qualification-screener-end-to-end.md)

# Citations

- [Supplier Pre-Qualification Screener Procurement Policy Guide](/documents/supplier-pre-qualification-screener-policy-guide.md)
