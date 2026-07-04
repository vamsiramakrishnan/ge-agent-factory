---
type: Eval Scenario
title: While running the B2B Quote Configuration Agent workflow you encounter this c...
description: "While running the B2B Quote Configuration Agent workflow you encounter this condition: Requested discount exceeds 20% off rate card, or any non-standard MRR concession on a term deal. Handle it end to end."
source_id: "b2b-quote-configuration-agent-escalation-path"
generation_status: inferred
tags:
  - telco
  - okf
  - brd
timestamp: "2026-07-04T00:00:00.000Z"
---

# While running the B2B Quote Configuration Agent workflow you encounter this condition: Requested discount exceeds 20% off rate card, or any non-standard MRR concession on a term deal. Handle it end to end.

## Validates

- [retrieve-records](/queries/retrieve-records.md)

## Mechanisms to call

- [lookup_b2b_quote_configuration_agent_assurance_runbook](/tools/lookup-b2b-quote-configuration-agent-assurance-runbook.md)

## Success rubric

Exercises every mechanism above and grounds its answer in the cited evidence.

# Citations

- [B2B Quote Configuration Agent Service Assurance Runbook](/documents/b2b-quote-configuration-agent-assurance-runbook.md)
