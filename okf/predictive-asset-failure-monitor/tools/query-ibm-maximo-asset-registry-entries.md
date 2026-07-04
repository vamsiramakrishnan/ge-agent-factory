---
type: Agent Tool
title: query_ibm_maximo_asset_registry_entries
description: Retrieve asset registry entries from IBM Maximo for the Predictive Asset Failure Monitor workflow.
tags:
  - manufacturing
  - okf
  - brd
timestamp: "2026-07-04T00:00:00.000Z"
source_kind: generationSpec
source_path: behaviorContract.toolIntents
generation_status: generated
ge_status: generated
---

# query_ibm_maximo_asset_registry_entries

Retrieve asset registry entries from IBM Maximo for the Predictive Asset Failure Monitor workflow.

- **Kind:** query
- **Source system:** [IBM Maximo](/systems/ibm-maximo.md)

## Inputs

- asset_number
- date_range

## Outputs

- asset_registry_entries_records

## Side Effects

- No mutation is declared by the spec for this tool.

## Idempotency

No idempotency key declared; no mutation is declared by the spec for this tool.

## Confirmation

No write confirmation policy is derivable from the spec.

## Permissions

No explicit permission scopes declared; source-system access is tied to [IBM Maximo](/systems/ibm-maximo.md).

## Failure Modes

No explicit failure modes are declared in the spec; rely on refusal/escalation policies for unsafe or incomplete evidence.

## Used By

_Not bound to a workflow stage._

## Evals

_No eval scenario explicitly exercises this tool._

## Evidence emitted

- source_system_record

## Required inputs

- asset_number
- date_range

## Produces

- asset_registry_entries_records

# Examples

```
query_ibm_maximo_asset_registry_entries(asset_number=<asset_number>, date_range=<date_range>)
```

# Citations

- [IBM Maximo](/systems/ibm-maximo.md)
