---
type: Query Capability
title: "Receive CapEx request from SAP, pull comparable past projects from the projec..."
description: "Receive CapEx request from SAP, pull comparable past projects from the project database, and retrieve current hurdle rates from Anaplan."
source_id: "request-comparable-retrieval"
generation_status: inferred
tags:
  - finance
  - okf
  - brd
timestamp: "2026-07-01T00:00:00.000Z"
---

# Receive CapEx request from SAP, pull comparable past projects from the project database, and retrieve current hurdle rates from Anaplan.

## Tools used

- [query_sap_s_4hana_transactions](/tools/query-sap-s-4hana-transactions.md)
- [query_anaplan_budget_lines](/tools/query-anaplan-budget-lines.md)
- [action_sap_s_4hana_generate](/tools/action-sap-s-4hana-generate.md)

## Runs in

- [request_comparable_retrieval](/workflow/request-comparable-retrieval.md)

## Evidence expected

- source_system_record
- api_response
- generated_audit_trail

## Evals

- [Run the Capital Expenditure Analyzer workflow for the current period. Cite the relevant source-system evidence and surface any escalations required.](/tests/capital-expenditure-analyzer-end-to-end.md)

# Citations

- [Capital Expenditure Analyzer Controls Playbook](/documents/capital-expenditure-analyzer-controls-playbook.md)
