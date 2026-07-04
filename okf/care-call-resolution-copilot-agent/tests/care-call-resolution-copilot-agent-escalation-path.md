---
type: Eval Scenario
title: While running the Care Call Resolution Copilot Agent workflow you encounter t...
description: "While running the Care Call Resolution Copilot Agent workflow you encounter this condition: Churn-save offer would exceed the retention governance cap: more than $40/month recurring discount or a device credit above $200. Handle it end to end."
source_id: "care-call-resolution-copilot-agent-escalation-path"
generation_status: inferred
tags:
  - telco
  - okf
  - brd
timestamp: "2026-07-04T00:00:00.000Z"
---

# While running the Care Call Resolution Copilot Agent workflow you encounter this condition: Churn-save offer would exceed the retention governance cap: more than $40/month recurring discount or a device credit above $200. Handle it end to end.

## Validates

- [contact-authentication-context-assembly](/queries/contact-authentication-context-assembly.md)

## Mechanisms to call

- [lookup_care_call_resolution_copilot_agent_assurance_runbook](/tools/lookup-care-call-resolution-copilot-agent-assurance-runbook.md)

## Success rubric

Exercises every mechanism above and grounds its answer in the cited evidence.

# Citations

- [Care Call Resolution Copilot Agent Service Assurance Runbook](/documents/care-call-resolution-copilot-agent-assurance-runbook.md)
