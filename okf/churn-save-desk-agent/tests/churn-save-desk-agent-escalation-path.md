---
type: Eval Scenario
title: While running the Churn Save Desk Agent workflow you encounter this condition...
description: "While running the Churn Save Desk Agent workflow you encounter this condition: Churn-save offer would exceed the retention governance cap: more than $40/month recurring discount or a device credit above $200. Handle it end to end."
source_id: "churn-save-desk-agent-escalation-path"
generation_status: inferred
tags:
  - telco
  - okf
  - brd
timestamp: "2026-07-04T00:00:00.000Z"
---

# While running the Churn Save Desk Agent workflow you encounter this condition: Churn-save offer would exceed the retention governance cap: more than $40/month recurring discount or a device credit above $200. Handle it end to end.

## Validates

- [retrieve-records](/queries/retrieve-records.md)

## Mechanisms to call

- [lookup_churn_save_desk_agent_assurance_runbook](/tools/lookup-churn-save-desk-agent-assurance-runbook.md)

## Success rubric

Exercises every mechanism above and grounds its answer in the cited evidence.

# Citations

- [Churn Save Desk Agent Service Assurance Runbook](/documents/churn-save-desk-agent-assurance-runbook.md)
