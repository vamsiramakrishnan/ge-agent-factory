---
type: Agent Tool
title: query_mentoring_platform_mentoring_platform_records
description: Retrieve mentoring platform records from Mentoring Platform for the HiPo Development Journey Agent workflow.
tags:
  - hr
  - okf
  - brd
timestamp: "2026-07-01T00:00:00.000Z"
source_kind: generationSpec
source_path: behaviorContract.toolIntents
generation_status: generated
ge_status: generated
---

# query_mentoring_platform_mentoring_platform_records

Retrieve mentoring platform records from Mentoring Platform for the HiPo Development Journey Agent workflow.

- **Kind:** query
- **Source system:** [Mentoring Platform](/systems/mentoring-platform.md)

## Inputs

- lookup_key
- date_range

## Outputs

- mentoring_platform_records_records
- mentoring_platform_records_summary

## Side Effects

- No mutation is declared by the spec for this tool.

## Idempotency

No idempotency key declared; no mutation is declared by the spec for this tool.

## Confirmation

No write confirmation policy is derivable from the spec.

## Permissions

No explicit permission scopes declared; source-system access is tied to [Mentoring Platform](/systems/mentoring-platform.md).

## Failure Modes

No explicit failure modes are declared in the spec; rely on refusal/escalation policies for unsafe or incomplete evidence.

## Used By

- [journey_design](/workflow/journey-design.md)

## Evals

- [Run the HiPo Development Journey Agent workflow for the current period. Cite the relevant source-system evidence and surface any escalations required.](/tests/hipo-development-journey-agent-end-to-end.md)

## Evidence emitted

- source_system_record

## Required inputs

- lookup_key
- date_range

## Produces

- mentoring_platform_records_records
- mentoring_platform_records_summary

# Examples

```
query_mentoring_platform_mentoring_platform_records(lookup_key=<lookup_key>, date_range=<date_range>)
```

# Citations

- [Mentoring Platform](/systems/mentoring-platform.md)
