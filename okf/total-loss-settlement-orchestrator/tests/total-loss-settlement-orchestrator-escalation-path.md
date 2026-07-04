---
type: Eval Scenario
title: While running the Total Loss Settlement Orchestrator workflow you encounter t...
description: "While running the Total Loss Settlement Orchestrator workflow you encounter this condition: Any single reserve transaction exceeding $50,000 or cumulative incurred crossing $100,000 on one claim. Handle it end to end."
source_id: "total-loss-settlement-orchestrator-escalation-path"
generation_status: inferred
tags:
  - insurance
  - okf
  - brd
timestamp: "2026-07-04T00:00:00.000Z"
---

# While running the Total Loss Settlement Orchestrator workflow you encounter this condition: Any single reserve transaction exceeding $50,000 or cumulative incurred crossing $100,000 on one claim. Handle it end to end.

## Validates

- [retrieve-records](/queries/retrieve-records.md)

## Mechanisms to call

- [lookup_total_loss_settlement_orchestrator_authority_guide](/tools/lookup-total-loss-settlement-orchestrator-authority-guide.md)

## Success rubric

Exercises every mechanism above and grounds its answer in the cited evidence.

# Citations

- [Total Loss Settlement Orchestrator Authority & Referral Guide](/documents/total-loss-settlement-orchestrator-authority-guide.md)
