---
type: Eval Scenario
title: While running the Cancellation Notice Compliance Agent workflow you encounter...
description: "While running the Cancellation Notice Compliance Agent workflow you encounter this condition: Refund or premium adjustment request exceeding $10,000 on a single billing account. Handle it end to end."
source_id: "cancellation-notice-compliance-agent-escalation-path"
generation_status: inferred
tags:
  - insurance
  - okf
  - brd
timestamp: "2026-07-04T00:00:00.000Z"
---

# While running the Cancellation Notice Compliance Agent workflow you encounter this condition: Refund or premium adjustment request exceeding $10,000 on a single billing account. Handle it end to end.

## Validates

- [nonpay-queue-triage](/queries/nonpay-queue-triage.md)

## Mechanisms to call

- [lookup_cancellation_notice_compliance_agent_authority_guide](/tools/lookup-cancellation-notice-compliance-agent-authority-guide.md)

## Success rubric

Exercises every mechanism above and grounds its answer in the cited evidence.

# Citations

- [Cancellation Notice Compliance Agent Authority & Referral Guide](/documents/cancellation-notice-compliance-agent-authority-guide.md)
