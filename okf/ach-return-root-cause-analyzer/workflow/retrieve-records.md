---
type: Workflow Stage
title: Retrieve Records
description: Query payment instructions and clearing batches from FIS Payments Hub for the ACH Return Root Cause Analyzer workflow.
source_id: retrieve_records
tags:
  - banking
  - okf
  - brd
timestamp: "2026-07-04T00:00:00.000Z"
---

# Retrieve Records

Query payment instructions and clearing batches from FIS Payments Hub for the ACH Return Root Cause Analyzer workflow.

- **Mode:** sequential
- **Stage:** 1 of 4

## Tools

- [query_fis_payments_hub_payment_instructions](/tools/query-fis-payments-hub-payment-instructions.md)
- [lookup_ach_return_root_cause_analyzer_compliance_policy](/tools/lookup-ach-return-root-cause-analyzer-compliance-policy.md)
- [action_fis_payments_hub_publish](/tools/action-fis-payments-hub-publish.md)

Next: [Analyze & Detect](/workflow/analyze-detect.md)
