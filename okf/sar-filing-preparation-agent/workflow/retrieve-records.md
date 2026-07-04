---
type: Workflow Stage
title: Retrieve Records
description: Query fraud alerts and transaction risk scores from NICE Actimize and correlate with ServiceNow for the SAR Filing Preparation Agent workflow.
source_id: retrieve_records
tags:
  - banking
  - okf
  - brd
timestamp: "2026-07-04T00:00:00.000Z"
---

# Retrieve Records

Query fraud alerts and transaction risk scores from NICE Actimize and correlate with ServiceNow for the SAR Filing Preparation Agent workflow.

- **Mode:** sequential
- **Stage:** 1 of 4

## Tools

- [query_nice_actimize_fraud_alerts](/tools/query-nice-actimize-fraud-alerts.md)
- [query_servicenow_tickets](/tools/query-servicenow-tickets.md)
- [lookup_sar_filing_preparation_agent_compliance_policy](/tools/lookup-sar-filing-preparation-agent-compliance-policy.md)
- [action_nice_actimize_file](/tools/action-nice-actimize-file.md)

Next: [Analyze & Detect](/workflow/analyze-detect.md)
