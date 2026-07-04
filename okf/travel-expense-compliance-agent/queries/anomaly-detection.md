---
type: Query Capability
title: ML flags unusual patterns in expense behavior — expenses consistently at appr...
description: "ML flags unusual patterns in expense behavior — expenses consistently at approval thresholds, repeated round amounts, weekend charges without approved travel, personal use indicators."
source_id: "anomaly-detection"
generation_status: inferred
tags:
  - procurement
  - okf
  - brd
timestamp: "2026-07-01T00:00:00.000Z"
---

# ML flags unusual patterns in expense behavior — expenses consistently at approval thresholds, repeated round amounts, weekend charges without approved travel, personal use indicators.

## Tools used

- [query_sap_concur_expense_reports](/tools/query-sap-concur-expense-reports.md)
- [lookup_travel_expense_compliance_agent_policy_guide](/tools/lookup-travel-expense-compliance-agent-policy-guide.md)

## Runs in

- [anomaly_detection](/workflow/anomaly-detection.md)

## Evidence expected

- source_system_record
- document_reference

## Evals

- [Run the Travel & Expense Compliance Agent workflow for the current period. Cite the relevant source-system evidence and surface any escalations required.](/tests/travel-expense-compliance-agent-end-to-end.md)

# Citations

- [Travel & Expense Compliance Agent Procurement Policy Guide](/documents/travel-expense-compliance-agent-policy-guide.md)
