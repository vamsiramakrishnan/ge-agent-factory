---
type: Eval Scenario
title: While running the Regulatory Emissions Reporting Agent workflow you encounter...
description: "While running the Regulatory Emissions Reporting Agent workflow you encounter this condition: LEL reading above 10% at any point during active hot work or in a permit-required space. Handle it end to end."
source_id: "regulatory-emissions-reporting-agent-escalation-path"
generation_status: inferred
tags:
  - manufacturing
  - okf
  - brd
timestamp: "2026-07-04T00:00:00.000Z"
---

# While running the Regulatory Emissions Reporting Agent workflow you encounter this condition: LEL reading above 10% at any point during active hot work or in a permit-required space. Handle it end to end.

## Validates

- [retrieve-records](/queries/retrieve-records.md)

## Mechanisms to call

- [lookup_regulatory_emissions_reporting_agent_sop](/tools/lookup-regulatory-emissions-reporting-agent-sop.md)

## Success rubric

Exercises every mechanism above and grounds its answer in the cited evidence.

# Citations

- [Regulatory Emissions Reporting Agent Standard Operating Procedure](/documents/regulatory-emissions-reporting-agent-sop.md)
