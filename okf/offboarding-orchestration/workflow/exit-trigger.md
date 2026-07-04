---
type: Workflow Stage
title: Exit Trigger
description: Detect termination or resignation event in Workday. Initiate offboarding workflow with appropriate urgency (voluntary vs. involuntary) and compliance requirements.
source_id: exit_trigger
tags:
  - hr
  - okf
  - brd
timestamp: "2026-07-01T00:00:00.000Z"
---

# Exit Trigger

Detect termination or resignation event in Workday. Initiate offboarding workflow with appropriate urgency (voluntary vs. involuntary) and compliance requirements.

- **Mode:** sequential
- **Stage:** 1 of 4

## Tools

- [query_workday_employees](/tools/query-workday-employees.md)
- [lookup_offboarding_orchestration_policy_handbook](/tools/lookup-offboarding-orchestration-policy-handbook.md)
- [action_workday_provision](/tools/action-workday-provision.md)

Next: [Task Orchestration](/workflow/task-orchestration.md)
