---
type: Query Capability
title: "Pull current headcount, open req data, compensation benchmarks, and attrition..."
description: "Pull current headcount, open req data, compensation benchmarks, and attrition history from Workday. Merge with the financial plan from Anaplan."
source_id: "hris-data-integration"
generation_status: inferred
tags:
  - finance
  - okf
  - brd
timestamp: "2026-07-01T00:00:00.000Z"
---

# Pull current headcount, open req data, compensation benchmarks, and attrition history from Workday. Merge with the financial plan from Anaplan.

## Tools used

- [query_workday_employees](/tools/query-workday-employees.md)
- [query_anaplan_budget_lines](/tools/query-anaplan-budget-lines.md)
- [lookup_headcount_planning_agent_controls_playbook](/tools/lookup-headcount-planning-agent-controls-playbook.md)
- [action_workday_sync](/tools/action-workday-sync.md)

## Runs in

- [hris_data_integration](/workflow/hris-data-integration.md)

## Evidence expected

- source_system_record
- document_reference
- api_response
- generated_audit_trail

## Evals

- [Run the Headcount Planning Agent workflow for the current period. Cite the relevant source-system evidence and surface any escalations required.](/tests/headcount-planning-agent-end-to-end.md)

# Citations

- [Headcount Planning Agent Controls Playbook](/documents/headcount-planning-agent-controls-playbook.md)
