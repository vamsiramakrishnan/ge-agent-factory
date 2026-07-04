---
type: Agent Tool
title: query_screaming_frog_screaming_frog_records
description: Retrieve screaming frog records from Screaming Frog for the Technical SEO Monitor workflow.
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

# query_screaming_frog_screaming_frog_records

Retrieve screaming frog records from Screaming Frog for the Technical SEO Monitor workflow.

- **Kind:** query
- **Source system:** [Screaming Frog](/systems/screaming-frog.md)

## Inputs

- lookup_key
- date_range

## Outputs

- screaming_frog_records_records
- screaming_frog_records_summary

## Side Effects

- No mutation is declared by the spec for this tool.

## Idempotency

No idempotency key declared; no mutation is declared by the spec for this tool.

## Confirmation

No write confirmation policy is derivable from the spec.

## Permissions

No explicit permission scopes declared; source-system access is tied to [Screaming Frog](/systems/screaming-frog.md).

## Failure Modes

No explicit failure modes are declared in the spec; rely on refusal/escalation policies for unsafe or incomplete evidence.

## Used By

- [automated_crawl_monitoring](/workflow/automated-crawl-monitoring.md)

## Evals

- [Run the Technical SEO Monitor workflow for the current period. Cite the relevant source-system evidence and surface any escalations required.](/tests/technical-seo-monitor-end-to-end.md)

## Evidence emitted

- source_system_record

## Required inputs

- lookup_key
- date_range

## Produces

- screaming_frog_records_records
- screaming_frog_records_summary

# Examples

```
query_screaming_frog_screaming_frog_records(lookup_key=<lookup_key>, date_range=<date_range>)
```

# Citations

- [Screaming Frog](/systems/screaming-frog.md)
