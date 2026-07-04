---
type: Workflow Stage
title: "Alert Intake & Case Binding"
description: "Pull the triggering record from NICE Actimize fraud_alerts by alert_id and account_number, then bind it to any open investigation_cases row (matching subject_name or account) and prior banking_3_records history so the investigator opens with one bound case file instead of six disconnected screens."
source_id: alert_intake_case_binding
tags:
  - banking
  - okf
  - brd
timestamp: "2026-07-04T00:00:00.000Z"
---

# Alert Intake & Case Binding

Pull the triggering record from NICE Actimize fraud_alerts by alert_id and account_number, then bind it to any open investigation_cases row (matching subject_name or account) and prior banking_3_records history so the investigator opens with one bound case file instead of six disconnected screens.

- **Mode:** sequential
- **Stage:** 1 of 5

## Tools

- [query_nice_actimize_fraud_alerts](/tools/query-nice-actimize-fraud-alerts.md)
- [query_banking_3_banking_3_records](/tools/query-banking-3-banking-3-records.md)
- [lookup_aml_alert_investigation_agent_compliance_policy](/tools/lookup-aml-alert-investigation-agent-compliance-policy.md)
- [action_nice_actimize_file](/tools/action-nice-actimize-file.md)

Next: [Transaction & Counterparty Reconstruction](/workflow/transaction-counterparty-reconstruction.md)
