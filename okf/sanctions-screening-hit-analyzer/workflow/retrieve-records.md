---
type: Workflow Stage
title: Retrieve Records
description: Query kyc cases and entity profiles from Fenergo CLM and correlate with NICE Actimize for the Sanctions Screening Hit Analyzer workflow.
source_id: retrieve_records
tags:
  - banking
  - okf
  - brd
timestamp: "2026-07-04T00:00:00.000Z"
---

# Retrieve Records

Query kyc cases and entity profiles from Fenergo CLM and correlate with NICE Actimize for the Sanctions Screening Hit Analyzer workflow.

- **Mode:** sequential
- **Stage:** 1 of 4

## Tools

- [query_fenergo_clm_kyc_cases](/tools/query-fenergo-clm-kyc-cases.md)
- [query_nice_actimize_fraud_alerts](/tools/query-nice-actimize-fraud-alerts.md)
- [lookup_sanctions_screening_hit_analyzer_compliance_policy](/tools/lookup-sanctions-screening-hit-analyzer-compliance-policy.md)
- [action_fenergo_clm_escalate](/tools/action-fenergo-clm-escalate.md)

Next: [Analyze & Detect](/workflow/analyze-detect.md)
