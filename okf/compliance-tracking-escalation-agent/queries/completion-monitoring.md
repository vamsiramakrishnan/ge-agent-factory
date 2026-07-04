---
type: Query Capability
title: Continuously track training completion status across all employees from Corne...
description: "Continuously track training completion status across all employees from Cornerstone. Cross-reference with Workday org hierarchy and compliance deadlines."
source_id: "completion-monitoring"
generation_status: inferred
tags:
  - hr
  - okf
  - brd
timestamp: "2026-07-01T00:00:00.000Z"
---

# Continuously track training completion status across all employees from Cornerstone. Cross-reference with Workday org hierarchy and compliance deadlines.

## Tools used

- [query_workday_employees](/tools/query-workday-employees.md)
- [lookup_compliance_tracking_escalation_agent_policy_handbook](/tools/lookup-compliance-tracking-escalation-agent-policy-handbook.md)

## Runs in

- [completion_monitoring](/workflow/completion-monitoring.md)

## Evidence expected

- source_system_record
- document_reference

## Evals

- [Run the Compliance Tracking & Escalation Agent workflow for the current period. Cite the relevant source-system evidence and surface any escalations required.](/tests/compliance-tracking-escalation-agent-end-to-end.md)

# Citations

- [Compliance Tracking & Escalation Agent Policy Handbook](/documents/compliance-tracking-escalation-agent-policy-handbook.md)
