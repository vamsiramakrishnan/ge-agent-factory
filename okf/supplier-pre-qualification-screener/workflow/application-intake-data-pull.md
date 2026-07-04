---
type: Workflow Stage
title: "Application Intake & Data Pull"
description: "Receive supplier application from Ariba SLP or Jaggaer. Trigger parallel data pulls from D&B for financial indicators and SAP vendor master for duplicate detection."
source_id: application_intake_data_pull
tags:
  - procurement
  - okf
  - brd
timestamp: "2026-07-01T00:00:00.000Z"
---

# Application Intake & Data Pull

Receive supplier application from Ariba SLP or Jaggaer. Trigger parallel data pulls from D&B for financial indicators and SAP vendor master for duplicate detection.

- **Mode:** sequential
- **Stage:** 1 of 2

## Tools

- [query_ariba_slp_ariba_slp_records](/tools/query-ariba-slp-ariba-slp-records.md)
- [query_jaggaer_supplier_profiles](/tools/query-jaggaer-supplier-profiles.md)
- [query_sap_s_4hana_transactions](/tools/query-sap-s-4hana-transactions.md)
- [lookup_supplier_pre_qualification_screener_policy_guide](/tools/lookup-supplier-pre-qualification-screener-policy-guide.md)

Next: [Criteria Scoring & Red Flag Detection](/workflow/criteria-scoring-red-flag-detection.md)
