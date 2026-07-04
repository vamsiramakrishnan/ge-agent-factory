---
type: Workflow Stage
title: Retrieve Records
description: Query fraud alerts and transaction risk scores from NICE Actimize for the AML Alert Investigation Agent workflow.
source_id: retrieve_records
tags:
  - banking
  - okf
  - brd
timestamp: "2026-07-04T00:00:00.000Z"
---

# Retrieve Records

Query fraud alerts and transaction risk scores from NICE Actimize for the AML Alert Investigation Agent workflow.

- **Mode:** sequential
- **Stage:** 1 of 4

## Tools

- [query_nice_actimize_fraud_alerts](/tools/query-nice-actimize-fraud-alerts.md)
- [query_banking_3_banking_3_records](/tools/query-banking-3-banking-3-records.md)
- [lookup_aml_alert_investigation_agent_compliance_policy](/tools/lookup-aml-alert-investigation-agent-compliance-policy.md)
- [action_nice_actimize_file](/tools/action-nice-actimize-file.md)

Next: [Analyze & Detect](/workflow/analyze-detect.md)
