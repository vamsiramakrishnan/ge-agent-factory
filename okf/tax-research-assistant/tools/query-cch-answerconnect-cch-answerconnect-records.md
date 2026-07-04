---
type: Agent Tool
title: query_cch_answerconnect_cch_answerconnect_records
description: Retrieve cch answerconnect records from CCH AnswerConnect for the Tax Research Assistant workflow.
tags:
  - finance
  - okf
  - brd
timestamp: "2026-07-01T00:00:00.000Z"
source_kind: generationSpec
source_path: behaviorContract.toolIntents
generation_status: generated
ge_status: generated
---

# query_cch_answerconnect_cch_answerconnect_records

Retrieve cch answerconnect records from CCH AnswerConnect for the Tax Research Assistant workflow.

- **Kind:** query
- **Source system:** [CCH AnswerConnect](/systems/cch-answerconnect.md)

## Inputs

- lookup_key
- date_range

## Outputs

- cch_answerconnect_records_records
- cch_answerconnect_records_summary

## Side Effects

- No mutation is declared by the spec for this tool.

## Idempotency

No idempotency key declared; no mutation is declared by the spec for this tool.

## Confirmation

No write confirmation policy is derivable from the spec.

## Permissions

No explicit permission scopes declared; source-system access is tied to [CCH AnswerConnect](/systems/cch-answerconnect.md).

## Failure Modes

No explicit failure modes are declared in the spec; rely on refusal/escalation policies for unsafe or incomplete evidence.

## Used By

_Not bound to a workflow stage._

## Evals

- [Run the Tax Research Assistant workflow for the current period. Cite the relevant source-system evidence and surface any escalations required.](/tests/tax-research-assistant-end-to-end.md)

## Evidence emitted

- source_system_record

## Required inputs

- lookup_key
- date_range

## Produces

- cch_answerconnect_records_records
- cch_answerconnect_records_summary

# Examples

```
query_cch_answerconnect_cch_answerconnect_records(lookup_key=<lookup_key>, date_range=<date_range>)
```

# Citations

- [CCH AnswerConnect](/systems/cch-answerconnect.md)
