---
type: Agent Tool
title: query_wordpress_content_entries
description: Retrieve content entries from WordPress for the Brand Voice Checker workflow.
tags:
  - marketing
  - okf
  - brd
timestamp: "2026-07-01T00:00:00.000Z"
source_kind: generationSpec
source_path: behaviorContract.toolIntents
generation_status: generated
ge_status: generated
---

# query_wordpress_content_entries

Retrieve content entries from WordPress for the Brand Voice Checker workflow.

- **Kind:** query
- **Source system:** [WordPress](/systems/wordpress.md)

## Inputs

- lookup_key
- date_range

## Outputs

- content_entries_records
- content_entries_summary

## Side Effects

- No mutation is declared by the spec for this tool.

## Idempotency

No idempotency key declared; no mutation is declared by the spec for this tool.

## Confirmation

No write confirmation policy is derivable from the spec.

## Permissions

No explicit permission scopes declared; source-system access is tied to [WordPress](/systems/wordpress.md).

## Failure Modes

No explicit failure modes are declared in the spec; rely on refusal/escalation policies for unsafe or incomplete evidence.

## Used By

- [content_interception](/workflow/content-interception.md)
- [style_consistency_scoring](/workflow/style-consistency-scoring.md)
- [tonal_assessment](/workflow/tonal-assessment.md)

## Evals

- [Run the Brand Voice Checker workflow for the current period. Cite the relevant source-system evidence and surface any escalations required.](/tests/brand-voice-checker-end-to-end.md)

## Evidence emitted

- source_system_record

## Required inputs

- lookup_key
- date_range

## Produces

- content_entries_records
- content_entries_summary

# Examples

```
query_wordpress_content_entries(lookup_key=<lookup_key>, date_range=<date_range>)
```

# Citations

- [WordPress](/systems/wordpress.md)
