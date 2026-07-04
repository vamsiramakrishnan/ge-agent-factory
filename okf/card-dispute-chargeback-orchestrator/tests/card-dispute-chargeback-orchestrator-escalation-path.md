---
type: Eval Scenario
title: While running the Card Dispute Chargeback Orchestrator workflow you encounter...
description: "While running the Card Dispute Chargeback Orchestrator workflow you encounter this condition: Outbound wire of $250,000 or more to a first-time beneficiary, or any wire where payment instructions were changed via email or inbound phone call (business email compromise indicators). Handle it end to end."
source_id: "card-dispute-chargeback-orchestrator-escalation-path"
generation_status: inferred
tags:
  - banking
  - okf
  - brd
timestamp: "2026-07-04T00:00:00.000Z"
---

# While running the Card Dispute Chargeback Orchestrator workflow you encounter this condition: Outbound wire of $250,000 or more to a first-time beneficiary, or any wire where payment instructions were changed via email or inbound phone call (business email compromise indicators). Handle it end to end.

## Validates

- [retrieve-records](/queries/retrieve-records.md)

## Mechanisms to call

- [lookup_card_dispute_chargeback_orchestrator_compliance_policy](/tools/lookup-card-dispute-chargeback-orchestrator-compliance-policy.md)

## Success rubric

Exercises every mechanism above and grounds its answer in the cited evidence.

# Citations

- [Card Dispute Chargeback Orchestrator Banking Compliance Policy](/documents/card-dispute-chargeback-orchestrator-compliance-policy.md)
