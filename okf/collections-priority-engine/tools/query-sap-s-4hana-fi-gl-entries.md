---
type: Agent Tool
title: query_sap_s_4hana_fi_gl_entries
description: Retrieve gl entries from SAP S/4HANA FI for the Collections Priority Engine workflow.
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

# query_sap_s_4hana_fi_gl_entries

Retrieve gl entries from SAP S/4HANA FI for the Collections Priority Engine workflow.

- **Kind:** query
- **Source system:** [SAP S/4HANA FI](/systems/sap-s-4hana-fi.md)

## Inputs

- lookup_key
- date_range

## Outputs

- gl_entries_records
- gl_entries_summary

## Side Effects

- No mutation is declared by the spec for this tool.

## Idempotency

No idempotency key declared; no mutation is declared by the spec for this tool.

## Confirmation

No write confirmation policy is derivable from the spec.

## Permissions

No explicit permission scopes declared; source-system access is tied to [SAP S/4HANA FI](/systems/sap-s-4hana-fi.md).

## Failure Modes

No explicit failure modes are declared in the spec; rely on refusal/escalation policies for unsafe or incomplete evidence.

## Used By

_Not bound to a workflow stage._

## Evals

- [Run the Collections Priority Engine workflow for the current period. Cite the relevant source-system evidence and surface any escalations required.](/tests/collections-priority-engine-end-to-end.md)

## Evidence emitted

- source_system_record

## Required inputs

- lookup_key
- date_range

## Produces

- gl_entries_records
- gl_entries_summary

# Examples

```
query_sap_s_4hana_fi_gl_entries(lookup_key=<lookup_key>, date_range=<date_range>)
```

# Citations

- [SAP S/4HANA FI](/systems/sap-s-4hana-fi.md)
