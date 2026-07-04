---
type: Agent Tool
title: query_email_metadata_email_metadata_records
description: Retrieve email metadata records from Email Metadata for the Relationship Health Analyzer workflow.
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

# query_email_metadata_email_metadata_records

Retrieve email metadata records from Email Metadata for the Relationship Health Analyzer workflow.

- **Kind:** query
- **Source system:** [Email Metadata](/systems/email-metadata.md)

## Inputs

- lookup_key
- date_range

## Outputs

- email_metadata_records_records
- email_metadata_records_summary

## Side Effects

- No mutation is declared by the spec for this tool.

## Idempotency

No idempotency key declared; no mutation is declared by the spec for this tool.

## Confirmation

No write confirmation policy is derivable from the spec.

## Permissions

No explicit permission scopes declared; source-system access is tied to [Email Metadata](/systems/email-metadata.md).

## Failure Modes

No explicit failure modes are declared in the spec; rely on refusal/escalation policies for unsafe or incomplete evidence.

## Used By

- [signal_aggregation](/workflow/signal-aggregation.md)

## Evals

- [Run the Relationship Health Analyzer workflow for the current period. Cite the relevant source-system evidence and surface any escalations required.](/tests/relationship-health-analyzer-end-to-end.md)

## Evidence emitted

- source_system_record

## Required inputs

- lookup_key
- date_range

## Produces

- email_metadata_records_records
- email_metadata_records_summary

# Examples

```
query_email_metadata_email_metadata_records(lookup_key=<lookup_key>, date_range=<date_range>)
```

# Citations

- [Email Metadata](/systems/email-metadata.md)
