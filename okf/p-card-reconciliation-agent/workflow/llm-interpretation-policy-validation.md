---
type: Workflow Stage
title: "LLM Interpretation & Policy Validation"
description: "Decode cryptic merchant descriptions ('SQ *HARDWARE STORE #4521', 'AMZN MKTP US*2K4TH1') and map to correct spend categories. Read receipt images with handwritten notes ('team lunch — 8 attendees') and validate against per-person meal policy limits. Flag policy gaming: 'Expenses consistently at $1 below manager-approval threshold.'"
source_id: llm_interpretation_policy_validation
tags:
  - procurement
  - okf
  - brd
timestamp: "2026-07-01T00:00:00.000Z"
---

# LLM Interpretation & Policy Validation

Decode cryptic merchant descriptions ('SQ *HARDWARE STORE #4521', 'AMZN MKTP US*2K4TH1') and map to correct spend categories. Read receipt images with handwritten notes ('team lunch — 8 attendees') and validate against per-person meal policy limits. Flag policy gaming: 'Expenses consistently at $1 below manager-approval threshold.'

- **Mode:** sequential
- **Stage:** 3 of 4

## Tools

- [query_sap_concur_expense_reports](/tools/query-sap-concur-expense-reports.md)
- [lookup_p_card_reconciliation_agent_policy_guide](/tools/lookup-p-card-reconciliation-agent-policy-guide.md)

Next: [Exception Reporting & Reconciliation](/workflow/exception-reporting-reconciliation.md)
