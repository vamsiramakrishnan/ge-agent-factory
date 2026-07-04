---
type: Eval Scenario
title: While running the Premium Delinquency Outreach Agent workflow you encounter t...
description: "While running the Premium Delinquency Outreach Agent workflow you encounter this condition: Refund or premium adjustment request exceeding $10,000 on a single billing account. Handle it end to end."
source_id: "premium-delinquency-outreach-agent-escalation-path"
generation_status: inferred
tags:
  - insurance
  - okf
  - brd
timestamp: "2026-07-04T00:00:00.000Z"
---

# While running the Premium Delinquency Outreach Agent workflow you encounter this condition: Refund or premium adjustment request exceeding $10,000 on a single billing account. Handle it end to end.

## Validates

- [nightly-past-due-extraction-plan-reconciliation](/queries/nightly-past-due-extraction-plan-reconciliation.md)

## Mechanisms to call

- [lookup_premium_delinquency_outreach_agent_authority_guide](/tools/lookup-premium-delinquency-outreach-agent-authority-guide.md)

## Success rubric

Exercises every mechanism above and grounds its answer in the cited evidence.

# Citations

- [Premium Delinquency Outreach Agent Authority & Referral Guide](/documents/premium-delinquency-outreach-agent-authority-guide.md)
