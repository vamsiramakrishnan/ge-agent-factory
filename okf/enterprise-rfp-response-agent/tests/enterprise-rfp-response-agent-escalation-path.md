---
type: Eval Scenario
title: While running the Enterprise RFP Response Agent workflow you encounter this c...
description: "While running the Enterprise RFP Response Agent workflow you encounter this condition: Requested discount exceeds 20% off rate card, or any non-standard MRR concession on a term deal. Handle it end to end."
source_id: "enterprise-rfp-response-agent-escalation-path"
generation_status: inferred
tags:
  - telco
  - okf
  - brd
timestamp: "2026-07-04T00:00:00.000Z"
---

# While running the Enterprise RFP Response Agent workflow you encounter this condition: Requested discount exceeds 20% off rate card, or any non-standard MRR concession on a term deal. Handle it end to end.

## Validates

- [retrieve-records](/queries/retrieve-records.md)

## Mechanisms to call

- [lookup_enterprise_rfp_response_agent_assurance_runbook](/tools/lookup-enterprise-rfp-response-agent-assurance-runbook.md)

## Success rubric

Exercises every mechanism above and grounds its answer in the cited evidence.

# Citations

- [Enterprise RFP Response Agent Service Assurance Runbook](/documents/enterprise-rfp-response-agent-assurance-runbook.md)
