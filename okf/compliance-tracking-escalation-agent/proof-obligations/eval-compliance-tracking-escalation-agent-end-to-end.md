---
type: Proof Obligation
title: "Golden eval obligation — Run the Compliance Tracking & Escalation Agent workflow for the current period. Cite the relevant source-system evidence and surface any escalations required."
description: golden eval proof obligation
source_id: "eval-compliance-tracking-escalation-agent-end-to-end"
tags:
  - hr
  - okf
  - brd
timestamp: "2026-07-01T00:00:00.000Z"
source_kind: generationSpec
source_path: behaviorContract.goldenEvals.0
generation_status: generated
ge_status: generated
---

# Golden eval obligation — Run the Compliance Tracking & Escalation Agent workflow for the current period. Cite the relevant source-system evidence and surface any escalations required.

- **Kind:** golden eval
- **Spec source:** behaviorContract.goldenEvals.0
- **Eval:** [compliance-tracking-escalation-agent-end-to-end](/tests/compliance-tracking-escalation-agent-end-to-end.md)


## Mechanisms

- [query_lms_lms_records](/tools/query-lms-lms-records.md)
- [query_workday_employees](/tools/query-workday-employees.md)
- [query_slack_messages](/tools/query-slack-messages.md)
- [query_servicenow_tickets](/tools/query-servicenow-tickets.md)
- [lookup_compliance_tracking_escalation_agent_policy_handbook](/tools/lookup-compliance-tracking-escalation-agent-policy-handbook.md)
- [action_lms_execute](/tools/action-lms-execute.md)

## Entities that must be referenced

- lms_records
- employees
- messages
- tickets

## Forbidden behaviors

- do not invent KPI numbers
- do not skip the evidence_lookup step before any recommendation
- do not execute execute without two-system evidence

# Citations

- [compliance-tracking-escalation-agent-policy-handbook](/documents/compliance-tracking-escalation-agent-policy-handbook.md)
