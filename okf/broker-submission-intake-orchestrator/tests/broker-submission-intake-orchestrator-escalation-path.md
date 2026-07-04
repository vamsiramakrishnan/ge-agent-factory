---
type: Eval Scenario
title: While running the Broker Submission Intake Orchestrator workflow you encounte...
description: "While running the Broker Submission Intake Orchestrator workflow you encounter this condition: Submission with total_insured_value greater than $25,000,000 or requested liability limits above $10,000,000 per occurrence. Handle it end to end."
source_id: "broker-submission-intake-orchestrator-escalation-path"
generation_status: inferred
tags:
  - insurance
  - okf
  - brd
timestamp: "2026-07-04T00:00:00.000Z"
---

# While running the Broker Submission Intake Orchestrator workflow you encounter this condition: Submission with total_insured_value greater than $25,000,000 or requested liability limits above $10,000,000 per occurrence. Handle it end to end.

## Validates

- [retrieve-records](/queries/retrieve-records.md)

## Mechanisms to call

- [lookup_broker_submission_intake_orchestrator_authority_guide](/tools/lookup-broker-submission-intake-orchestrator-authority-guide.md)

## Success rubric

Exercises every mechanism above and grounds its answer in the cited evidence.

# Citations

- [Broker Submission Intake Orchestrator Authority & Referral Guide](/documents/broker-submission-intake-orchestrator-authority-guide.md)
