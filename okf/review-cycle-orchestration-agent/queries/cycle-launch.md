---
type: Query Capability
title: "Initiate review cycle with role-specific timelines and milestones in Workday ..."
description: "Initiate review cycle with role-specific timelines and milestones in Workday and Lattice. Configure assignment rules and escalation paths."
source_id: "cycle-launch"
generation_status: inferred
tags:
  - hr
  - okf
  - brd
timestamp: "2026-07-01T00:00:00.000Z"
---

# Initiate review cycle with role-specific timelines and milestones in Workday and Lattice. Configure assignment rules and escalation paths.

## Tools used

- [query_workday_employees](/tools/query-workday-employees.md)
- [lookup_review_cycle_orchestration_agent_policy_handbook](/tools/lookup-review-cycle-orchestration-agent-policy-handbook.md)
- [action_workday_execute](/tools/action-workday-execute.md)

## Runs in

- [cycle_launch](/workflow/cycle-launch.md)

## Evidence expected

- source_system_record
- document_reference
- api_response
- generated_audit_trail

## Evals

- [Run the Review Cycle Orchestration Agent workflow for the current period. Cite the relevant source-system evidence and surface any escalations required.](/tests/review-cycle-orchestration-agent-end-to-end.md)

# Citations

- [Review Cycle Orchestration Agent Policy Handbook](/documents/review-cycle-orchestration-agent-policy-handbook.md)
