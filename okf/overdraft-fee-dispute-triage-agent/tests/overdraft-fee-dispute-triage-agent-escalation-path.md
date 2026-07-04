---
type: Eval Scenario
title: While running the Overdraft Fee Dispute Triage Agent workflow you encounter t...
description: "While running the Overdraft Fee Dispute Triage Agent workflow you encounter this condition: Customer requests release of a deposit hold exceeding $25,000 or has had two or more case-by-case holds released early in the trailing 90 days. Handle it end to end."
source_id: "overdraft-fee-dispute-triage-agent-escalation-path"
generation_status: inferred
tags:
  - banking
  - okf
  - brd
timestamp: "2026-07-04T00:00:00.000Z"
---

# While running the Overdraft Fee Dispute Triage Agent workflow you encounter this condition: Customer requests release of a deposit hold exceeding $25,000 or has had two or more case-by-case holds released early in the trailing 90 days. Handle it end to end.

## Validates

- [retrieve-records](/queries/retrieve-records.md)

## Mechanisms to call

- [lookup_overdraft_fee_dispute_triage_agent_compliance_policy](/tools/lookup-overdraft-fee-dispute-triage-agent-compliance-policy.md)

## Success rubric

Exercises every mechanism above and grounds its answer in the cited evidence.

# Citations

- [Overdraft Fee Dispute Triage Agent Banking Compliance Policy](/documents/overdraft-fee-dispute-triage-agent-compliance-policy.md)
