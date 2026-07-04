---
type: Eval Scenario
title: While running the Bill Dispute Resolution Agent workflow you encounter this c...
description: "While running the Bill Dispute Resolution Agent workflow you encounter this condition: Mediation-to-billing reconciliation shows revenue leakage variance greater than 0.5% of billed revenue for the cycle. Handle it end to end."
source_id: "bill-dispute-resolution-agent-escalation-path"
generation_status: inferred
tags:
  - telco
  - okf
  - brd
timestamp: "2026-07-04T00:00:00.000Z"
---

# While running the Bill Dispute Resolution Agent workflow you encounter this condition: Mediation-to-billing reconciliation shows revenue leakage variance greater than 0.5% of billed revenue for the cycle. Handle it end to end.

## Validates

- [retrieve-records](/queries/retrieve-records.md)

## Mechanisms to call

- [lookup_bill_dispute_resolution_agent_assurance_runbook](/tools/lookup-bill-dispute-resolution-agent-assurance-runbook.md)

## Success rubric

Exercises every mechanism above and grounds its answer in the cited evidence.

# Citations

- [Bill Dispute Resolution Agent Service Assurance Runbook](/documents/bill-dispute-resolution-agent-assurance-runbook.md)
