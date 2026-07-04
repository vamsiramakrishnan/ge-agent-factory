---
type: Workflow Stage
title: "Request & Comparable Retrieval"
description: "Receive CapEx request from SAP, pull comparable past projects from the project database, and retrieve current hurdle rates from Anaplan."
source_id: request_comparable_retrieval
tags:
  - finance
  - okf
  - brd
timestamp: "2026-07-01T00:00:00.000Z"
---

# Request & Comparable Retrieval

Receive CapEx request from SAP, pull comparable past projects from the project database, and retrieve current hurdle rates from Anaplan.

- **Mode:** sequential
- **Stage:** 1 of 2

## Tools

- [query_sap_s_4hana_transactions](/tools/query-sap-s-4hana-transactions.md)
- [query_anaplan_budget_lines](/tools/query-anaplan-budget-lines.md)
- [action_sap_s_4hana_generate](/tools/action-sap-s-4hana-generate.md)

Next: [Strategic Alignment Assessment](/workflow/strategic-alignment-assessment.md)
