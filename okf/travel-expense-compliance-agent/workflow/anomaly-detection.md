---
type: Workflow Stage
title: Anomaly Detection
description: "ML flags unusual patterns in expense behavior — expenses consistently at approval thresholds, repeated round amounts, weekend charges without approved travel, personal use indicators."
source_id: anomaly_detection
tags:
  - procurement
  - okf
  - brd
timestamp: "2026-07-01T00:00:00.000Z"
---

# Anomaly Detection

ML flags unusual patterns in expense behavior — expenses consistently at approval thresholds, repeated round amounts, weekend charges without approved travel, personal use indicators.

- **Mode:** sequential
- **Stage:** 2 of 3

## Tools

- [query_sap_concur_expense_reports](/tools/query-sap-concur-expense-reports.md)
- [lookup_travel_expense_compliance_agent_policy_guide](/tools/lookup-travel-expense-compliance-agent-policy-guide.md)

Next: [Context Interpretation & Routing](/workflow/context-interpretation-routing.md)
