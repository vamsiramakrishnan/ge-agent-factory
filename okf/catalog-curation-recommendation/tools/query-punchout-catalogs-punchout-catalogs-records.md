---
type: Agent Tool
title: query_punchout_catalogs_punchout_catalogs_records
description: "Retrieve punchout catalogs records from Punchout catalogs for the Catalog Curation & Recommendation workflow."
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

# query_punchout_catalogs_punchout_catalogs_records

Retrieve punchout catalogs records from Punchout catalogs for the Catalog Curation & Recommendation workflow.

- **Kind:** query
- **Source system:** [Punchout catalogs](/systems/punchout-catalogs.md)

## Inputs

- lookup_key
- date_range

## Outputs

- punchout_catalogs_records_records
- punchout_catalogs_records_summary

## Side Effects

- No mutation is declared by the spec for this tool.

## Idempotency

No idempotency key declared; no mutation is declared by the spec for this tool.

## Confirmation

No write confirmation policy is derivable from the spec.

## Permissions

No explicit permission scopes declared; source-system access is tied to [Punchout catalogs](/systems/punchout-catalogs.md).

## Failure Modes

No explicit failure modes are declared in the spec; rely on refusal/escalation policies for unsafe or incomplete evidence.

## Used By

_Not bound to a workflow stage._

## Evals

- [Run the Catalog Curation & Recommendation workflow for the current period. Cite the relevant source-system evidence and surface any escalations required.](/tests/catalog-curation-recommendation-end-to-end.md)

## Evidence emitted

- source_system_record

## Required inputs

- lookup_key
- date_range

## Produces

- punchout_catalogs_records_records
- punchout_catalogs_records_summary

# Examples

```
query_punchout_catalogs_punchout_catalogs_records(lookup_key=<lookup_key>, date_range=<date_range>)
```

# Citations

- [Punchout catalogs](/systems/punchout-catalogs.md)
