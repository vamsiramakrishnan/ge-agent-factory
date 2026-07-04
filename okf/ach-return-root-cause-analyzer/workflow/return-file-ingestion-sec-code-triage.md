---
type: Workflow Stage
title: "Return file ingestion & SEC code triage"
description: "Ingest the daily ACH return file and parse Nacha return reason codes (R01, R02, R03, R05, R07, R08, R10, R11, R29) against payment_instructions and clearing_batches in FIS Payments Hub, tagging each return with its SEC code (PPD, CCD, WEB, TEL)."
source_id: return_file_ingestion_sec_code_triage
tags:
  - banking
  - okf
  - brd
timestamp: "2026-07-04T00:00:00.000Z"
---

# Return file ingestion & SEC code triage

Ingest the daily ACH return file and parse Nacha return reason codes (R01, R02, R03, R05, R07, R08, R10, R11, R29) against payment_instructions and clearing_batches in FIS Payments Hub, tagging each return with its SEC code (PPD, CCD, WEB, TEL).

- **Mode:** sequential
- **Stage:** 1 of 5

## Tools

- [query_fis_payments_hub_payment_instructions](/tools/query-fis-payments-hub-payment-instructions.md)
- [lookup_ach_return_root_cause_analyzer_compliance_policy](/tools/lookup-ach-return-root-cause-analyzer-compliance-policy.md)
- [action_fis_payments_hub_publish](/tools/action-fis-payments-hub-publish.md)

Next: [Originator-level return rate rollup](/workflow/originator-level-return-rate-rollup.md)
