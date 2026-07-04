---
type: Workflow Stage
title: Retrieve Records
description: Query kyc cases and entity profiles from Fenergo CLM and correlate with ServiceNow for the Periodic KYC Review Orchestrator workflow.
source_id: retrieve_records
tags:
  - banking
  - okf
  - brd
timestamp: "2026-07-04T00:00:00.000Z"
---

# Retrieve Records

Query kyc cases and entity profiles from Fenergo CLM and correlate with ServiceNow for the Periodic KYC Review Orchestrator workflow.

- **Mode:** sequential
- **Stage:** 1 of 4

## Tools

- [query_fenergo_clm_kyc_cases](/tools/query-fenergo-clm-kyc-cases.md)
- [query_servicenow_tickets](/tools/query-servicenow-tickets.md)
- [lookup_periodic_kyc_review_orchestrator_compliance_policy](/tools/lookup-periodic-kyc-review-orchestrator-compliance-policy.md)
- [action_fenergo_clm_file](/tools/action-fenergo-clm-file.md)

Next: [Analyze & Detect](/workflow/analyze-detect.md)
