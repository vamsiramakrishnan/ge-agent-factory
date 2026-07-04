---
type: Agent Tool
title: query_fenergo_clm_entity_profiles
description: Retrieve entity profiles from Fenergo CLM for the Beneficial Ownership Refresh Agent workflow.
tags:
  - banking
  - okf
  - brd
timestamp: "2026-07-04T00:00:00.000Z"
source_kind: generationSpec
source_path: behaviorContract.toolIntents
generation_status: generated
ge_status: generated
---

# query_fenergo_clm_entity_profiles

Retrieve entity profiles from Fenergo CLM for the Beneficial Ownership Refresh Agent workflow.

- **Kind:** query
- **Source system:** [Fenergo CLM](/systems/fenergo-clm.md)

## Inputs

- profile_id
- date_range

## Outputs

- entity_profiles_records

## Side Effects

- No mutation is declared by the spec for this tool.

## Idempotency

No idempotency key declared; no mutation is declared by the spec for this tool.

## Confirmation

No write confirmation policy is derivable from the spec.

## Permissions

No explicit permission scopes declared; source-system access is tied to [Fenergo CLM](/systems/fenergo-clm.md).

## Failure Modes

No explicit failure modes are declared in the spec; rely on refusal/escalation policies for unsafe or incomplete evidence.

## Used By

_Not bound to a workflow stage._

## Evals

_No eval scenario explicitly exercises this tool._

## Evidence emitted

- source_system_record

## Required inputs

- profile_id
- date_range

## Produces

- entity_profiles_records

# Examples

```
query_fenergo_clm_entity_profiles(profile_id=<profile_id>, date_range=<date_range>)
```

# Citations

- [Fenergo CLM](/systems/fenergo-clm.md)
