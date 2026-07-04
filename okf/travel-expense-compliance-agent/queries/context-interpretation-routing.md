---
type: Query Capability
title: "Gemini reads receipt notes and descriptions to validate ambiguous cases — '$2..."
description: "Gemini reads receipt notes and descriptions to validate ambiguous cases — '$200 dinner for 8 attendees, client dinner' is valid business entertainment. Detects policy gaming patterns. Routes compliant expenses for auto-payment, flagged items to manager with context."
source_id: "context-interpretation-routing"
generation_status: inferred
tags:
  - procurement
  - okf
  - brd
timestamp: "2026-07-01T00:00:00.000Z"
---

# Gemini reads receipt notes and descriptions to validate ambiguous cases — '$200 dinner for 8 attendees, client dinner' is valid business entertainment. Detects policy gaming patterns. Routes compliant expenses for auto-payment, flagged items to manager with context.

## Tools used

- [query_sap_concur_expense_reports](/tools/query-sap-concur-expense-reports.md)
- [query_policy_docs_policy_docs_records](/tools/query-policy-docs-policy-docs-records.md)
- [lookup_travel_expense_compliance_agent_policy_guide](/tools/lookup-travel-expense-compliance-agent-policy-guide.md)

## Runs in

- [context_interpretation_routing](/workflow/context-interpretation-routing.md)

## Evidence expected

- source_system_record
- document_reference

## Evals

- [Run the Travel & Expense Compliance Agent workflow for the current period. Cite the relevant source-system evidence and surface any escalations required.](/tests/travel-expense-compliance-agent-end-to-end.md)

# Citations

- [Travel & Expense Compliance Agent Procurement Policy Guide](/documents/travel-expense-compliance-agent-policy-guide.md)
