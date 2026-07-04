---
type: Workflow Stage
title: Retrieve Records
description: Query billing accounts and usage records from Amdocs CES Billing for the Revenue Leakage Detection Analyzer workflow.
source_id: retrieve_records
tags:
  - telco
  - okf
  - brd
timestamp: "2026-07-04T00:00:00.000Z"
---

# Retrieve Records

Query billing accounts and usage records from Amdocs CES Billing for the Revenue Leakage Detection Analyzer workflow.

- **Mode:** sequential
- **Stage:** 1 of 4

## Tools

- [query_amdocs_ces_billing_billing_accounts](/tools/query-amdocs-ces-billing-billing-accounts.md)
- [lookup_revenue_leakage_detection_analyzer_assurance_runbook](/tools/lookup-revenue-leakage-detection-analyzer-assurance-runbook.md)
- [action_amdocs_ces_billing_create](/tools/action-amdocs-ces-billing-create.md)

Next: [Analyze & Detect](/workflow/analyze-detect.md)
