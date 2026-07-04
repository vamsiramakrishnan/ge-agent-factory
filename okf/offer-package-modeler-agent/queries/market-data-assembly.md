---
type: Query Capability
title: "Pull current compensation benchmarks from Mercer and Radford. Cross-reference..."
description: "Pull current compensation benchmarks from Mercer and Radford. Cross-reference with internal comp bands and equity guidelines from Workday."
source_id: "market-data-assembly"
generation_status: inferred
tags:
  - hr
  - okf
  - brd
timestamp: "2026-07-01T00:00:00.000Z"
---

# Pull current compensation benchmarks from Mercer and Radford. Cross-reference with internal comp bands and equity guidelines from Workday.

## Tools used

- [query_workday_employees](/tools/query-workday-employees.md)
- [query_mercer_mercer_records](/tools/query-mercer-mercer-records.md)
- [query_radford_radford_records](/tools/query-radford-radford-records.md)
- [action_workday_trigger](/tools/action-workday-trigger.md)

## Runs in

- [market_data_assembly](/workflow/market-data-assembly.md)

## Evidence expected

- source_system_record
- api_response
- generated_audit_trail

## Evals

- [Run the Offer Package Modeler Agent workflow for the current period. Cite the relevant source-system evidence and surface any escalations required.](/tests/offer-package-modeler-agent-end-to-end.md)

# Citations

- [Offer Package Modeler Agent Policy Handbook](/documents/offer-package-modeler-agent-policy-handbook.md)
