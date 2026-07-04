---
type: Workflow Stage
title: "Context Interpretation & Routing"
description: "Gemini reads receipt notes and descriptions to validate ambiguous cases — '$200 dinner for 8 attendees, client dinner' is valid business entertainment. Detects policy gaming patterns. Routes compliant expenses for auto-payment, flagged items to manager with context."
source_id: context_interpretation_routing
tags:
  - procurement
  - okf
  - brd
timestamp: "2026-07-01T00:00:00.000Z"
---

# Context Interpretation & Routing

Gemini reads receipt notes and descriptions to validate ambiguous cases — '$200 dinner for 8 attendees, client dinner' is valid business entertainment. Detects policy gaming patterns. Routes compliant expenses for auto-payment, flagged items to manager with context.

- **Mode:** sequential
- **Stage:** 3 of 3

## Tools

- [query_sap_concur_expense_reports](/tools/query-sap-concur-expense-reports.md)
- [query_policy_docs_policy_docs_records](/tools/query-policy-docs-policy-docs-records.md)
- [lookup_travel_expense_compliance_agent_policy_guide](/tools/lookup-travel-expense-compliance-agent-policy-guide.md)
