---
type: Query Capability
title: "Decode cryptic merchant descriptions ('SQ *HARDWARE STORE #4521', 'AMZN MKTP ..."
description: "Decode cryptic merchant descriptions ('SQ *HARDWARE STORE #4521', 'AMZN MKTP US*2K4TH1') and map to correct spend categories. Read receipt images with handwritten notes ('team lunch — 8 attendees') and validate against per-person meal policy limits. Flag policy gaming: 'Expenses consistently at $1 below manager-approval threshold.'"
source_id: "llm-interpretation-policy-validation"
generation_status: inferred
tags:
  - procurement
  - okf
  - brd
timestamp: "2026-07-01T00:00:00.000Z"
---

# Decode cryptic merchant descriptions ('SQ *HARDWARE STORE #4521', 'AMZN MKTP US*2K4TH1') and map to correct spend categories. Read receipt images with handwritten notes ('team lunch — 8 attendees') and validate against per-person meal policy limits. Flag policy gaming: 'Expenses consistently at $1 below manager-approval threshold.'

## Tools used

- [query_sap_concur_expense_reports](/tools/query-sap-concur-expense-reports.md)
- [lookup_p_card_reconciliation_agent_policy_guide](/tools/lookup-p-card-reconciliation-agent-policy-guide.md)

## Runs in

- [llm_interpretation_policy_validation](/workflow/llm-interpretation-policy-validation.md)

## Evidence expected

- source_system_record
- document_reference

## Evals

- [Run the P-Card Reconciliation Agent workflow for the current period. Cite the relevant source-system evidence and surface any escalations required.](/tests/p-card-reconciliation-agent-end-to-end.md)

# Citations

- [P-Card Reconciliation Agent Procurement Policy Guide](/documents/p-card-reconciliation-agent-policy-guide.md)
