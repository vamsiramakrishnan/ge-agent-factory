---
type: Workflow Stage
title: HRIS Data Integration
description: "Pull current headcount, open req data, compensation benchmarks, and attrition history from Workday. Merge with the financial plan from Anaplan."
source_id: hris_data_integration
tags:
  - finance
  - okf
  - brd
timestamp: "2026-07-01T00:00:00.000Z"
---

# HRIS Data Integration

Pull current headcount, open req data, compensation benchmarks, and attrition history from Workday. Merge with the financial plan from Anaplan.

- **Mode:** sequential
- **Stage:** 1 of 4

## Tools

- [query_workday_employees](/tools/query-workday-employees.md)
- [query_anaplan_budget_lines](/tools/query-anaplan-budget-lines.md)
- [lookup_headcount_planning_agent_controls_playbook](/tools/lookup-headcount-planning-agent-controls-playbook.md)
- [action_workday_sync](/tools/action-workday-sync.md)

Next: [Fully-Loaded Cost Modeling](/workflow/fully-loaded-cost-modeling.md)
