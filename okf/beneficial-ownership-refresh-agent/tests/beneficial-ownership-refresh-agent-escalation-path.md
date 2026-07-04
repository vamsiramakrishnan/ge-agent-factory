---
type: Eval Scenario
title: While running the Beneficial Ownership Refresh Agent workflow you encounter t...
description: "While running the Beneficial Ownership Refresh Agent workflow you encounter this condition: Cash deposit pattern of three or more transactions between $8,000 and $9,999 across any combination of branches or days within a 7-day window on one relationship. Handle it end to end."
source_id: "beneficial-ownership-refresh-agent-escalation-path"
generation_status: inferred
tags:
  - banking
  - okf
  - brd
timestamp: "2026-07-04T00:00:00.000Z"
---

# While running the Beneficial Ownership Refresh Agent workflow you encounter this condition: Cash deposit pattern of three or more transactions between $8,000 and $9,999 across any combination of branches or days within a 7-day window on one relationship. Handle it end to end.

## Validates

- [retrieve-records](/queries/retrieve-records.md)

## Mechanisms to call

- [lookup_beneficial_ownership_refresh_agent_compliance_policy](/tools/lookup-beneficial-ownership-refresh-agent-compliance-policy.md)

## Success rubric

Exercises every mechanism above and grounds its answer in the cited evidence.

# Citations

- [Beneficial Ownership Refresh Agent Banking Compliance Policy](/documents/beneficial-ownership-refresh-agent-compliance-policy.md)
