---
type: Agent Tool
title: query_microsoft_word_microsoft_word_records
description: Retrieve microsoft word records from Microsoft Word for the Redline Comparison Agent workflow.
tags:
  - procurement
  - okf
  - brd
timestamp: "2026-07-01T00:00:00.000Z"
source_kind: generationSpec
source_path: behaviorContract.toolIntents
generation_status: generated
ge_status: generated
---

# query_microsoft_word_microsoft_word_records

Retrieve microsoft word records from Microsoft Word for the Redline Comparison Agent workflow.

- **Kind:** query
- **Source system:** [Microsoft Word](/systems/microsoft-word.md)

## Inputs

- lookup_key
- date_range

## Outputs

- microsoft_word_records_records
- microsoft_word_records_summary

## Side Effects

- No mutation is declared by the spec for this tool.

## Idempotency

No idempotency key declared; no mutation is declared by the spec for this tool.

## Confirmation

No write confirmation policy is derivable from the spec.

## Permissions

No explicit permission scopes declared; source-system access is tied to [Microsoft Word](/systems/microsoft-word.md).

## Failure Modes

No explicit failure modes are declared in the spec; rely on refusal/escalation policies for unsafe or incomplete evidence.

## Used By

- [version_retrieval](/workflow/version-retrieval.md)
- [structural_diff_detection](/workflow/structural-diff-detection.md)
- [semantic_impact_analysis](/workflow/semantic-impact-analysis.md)

## Evals

- [Run the Redline Comparison Agent workflow for the current period. Cite the relevant source-system evidence and surface any escalations required.](/tests/redline-comparison-agent-end-to-end.md)

## Evidence emitted

- source_system_record

## Required inputs

- lookup_key
- date_range

## Produces

- microsoft_word_records_records
- microsoft_word_records_summary

# Examples

```
query_microsoft_word_microsoft_word_records(lookup_key=<lookup_key>, date_range=<date_range>)
```

# Citations

- [Microsoft Word](/systems/microsoft-word.md)
