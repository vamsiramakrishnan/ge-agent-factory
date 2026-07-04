---
type: Workflow Stage
title: Retrieve Records
description: Query core accounts and account transactions from Temenos Transact for the Branch Cash Position Forecast Engine workflow.
source_id: retrieve_records
tags:
  - banking
  - okf
  - brd
timestamp: "2026-07-04T00:00:00.000Z"
---

# Retrieve Records

Query core accounts and account transactions from Temenos Transact for the Branch Cash Position Forecast Engine workflow.

- **Mode:** sequential
- **Stage:** 1 of 4

## Tools

- [query_temenos_transact_core_accounts](/tools/query-temenos-transact-core-accounts.md)
- [lookup_branch_cash_position_forecast_engine_compliance_policy](/tools/lookup-branch-cash-position-forecast-engine-compliance-policy.md)
- [action_temenos_transact_publish](/tools/action-temenos-transact-publish.md)

Next: [Analyze & Detect](/workflow/analyze-detect.md)
