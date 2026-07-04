---
type: Query Capability
title: Assess individual competency gaps against target role requirements from Workd...
description: "Assess individual competency gaps against target role requirements from Workday. Cross-reference with learning history from Cornerstone."
source_id: "gap-analysis"
generation_status: inferred
tags:
  - hr
  - okf
  - brd
timestamp: "2026-07-01T00:00:00.000Z"
---

# Assess individual competency gaps against target role requirements from Workday. Cross-reference with learning history from Cornerstone.

## Tools used

- [query_workday_employees](/tools/query-workday-employees.md)
- [action_workday_assign](/tools/action-workday-assign.md)

## Runs in

- [gap_analysis](/workflow/gap-analysis.md)

## Evidence expected

- source_system_record
- api_response
- generated_audit_trail

## Evals

- [Run the HiPo Development Journey Agent workflow for the current period. Cite the relevant source-system evidence and surface any escalations required.](/tests/hipo-development-journey-agent-end-to-end.md)

# Citations

- [HiPo Development Journey Agent Policy Handbook](/documents/hipo-development-journey-agent-policy-handbook.md)
