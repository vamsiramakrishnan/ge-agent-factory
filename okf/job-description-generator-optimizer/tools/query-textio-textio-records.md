---
type: Agent Tool
title: query_textio_textio_records
description: "Retrieve textio records from Textio for the Job Description Generator & Optimizer workflow."
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

# query_textio_textio_records

Retrieve textio records from Textio for the Job Description Generator & Optimizer workflow.

- **Kind:** query
- **Source system:** [Textio](/systems/textio.md)

## Inputs

- lookup_key
- date_range

## Outputs

- textio_records_records
- textio_records_summary

## Side Effects

- No mutation is declared by the spec for this tool.

## Idempotency

No idempotency key declared; no mutation is declared by the spec for this tool.

## Confirmation

No write confirmation policy is derivable from the spec.

## Permissions

No explicit permission scopes declared; source-system access is tied to [Textio](/systems/textio.md).

## Failure Modes

No explicit failure modes are declared in the spec; rely on refusal/escalation policies for unsafe or incomplete evidence.

## Used By

- [jd_generation_bias_scan](/workflow/jd-generation-bias-scan.md)

## Evals

- [Run the Job Description Generator & Optimizer workflow for the current period. Cite the relevant source-system evidence and surface any escalations required.](/tests/job-description-generator-optimizer-end-to-end.md)

## Evidence emitted

- source_system_record

## Required inputs

- lookup_key
- date_range

## Produces

- textio_records_records
- textio_records_summary

# Examples

```
query_textio_textio_records(lookup_key=<lookup_key>, date_range=<date_range>)
```

# Citations

- [Textio](/systems/textio.md)
