---
type: Workflow Stage
title: Market Data Assembly
description: "Pull current compensation benchmarks from Mercer and Radford. Cross-reference with internal comp bands and equity guidelines from Workday."
source_id: market_data_assembly
tags:
  - hr
  - okf
  - brd
timestamp: "2026-07-01T00:00:00.000Z"
---

# Market Data Assembly

Pull current compensation benchmarks from Mercer and Radford. Cross-reference with internal comp bands and equity guidelines from Workday.

- **Mode:** sequential
- **Stage:** 1 of 3

## Tools

- [query_workday_employees](/tools/query-workday-employees.md)
- [query_mercer_mercer_records](/tools/query-mercer-mercer-records.md)
- [query_radford_radford_records](/tools/query-radford-radford-records.md)
- [action_workday_trigger](/tools/action-workday-trigger.md)

Next: [Scenario Modeling](/workflow/scenario-modeling.md)
