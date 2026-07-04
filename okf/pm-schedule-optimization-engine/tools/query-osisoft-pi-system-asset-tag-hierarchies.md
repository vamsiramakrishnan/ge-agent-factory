---
type: Agent Tool
title: query_osisoft_pi_system_asset_tag_hierarchies
description: Retrieve asset tag hierarchies from OSIsoft PI System for the PM Schedule Optimization Engine workflow.
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

# query_osisoft_pi_system_asset_tag_hierarchies

Retrieve asset tag hierarchies from OSIsoft PI System for the PM Schedule Optimization Engine workflow.

- **Kind:** query
- **Source system:** [OSIsoft PI System](/systems/osisoft-pi-system.md)

## Inputs

- tag_id
- asset_number
- date_range

## Outputs

- asset_tag_hierarchies_records

## Side Effects

- No mutation is declared by the spec for this tool.

## Idempotency

No idempotency key declared; no mutation is declared by the spec for this tool.

## Confirmation

No write confirmation policy is derivable from the spec.

## Permissions

No explicit permission scopes declared; source-system access is tied to [OSIsoft PI System](/systems/osisoft-pi-system.md).

## Failure Modes

No explicit failure modes are declared in the spec; rely on refusal/escalation policies for unsafe or incomplete evidence.

## Used By

_Not bound to a workflow stage._

## Evals

_No eval scenario explicitly exercises this tool._

## Evidence emitted

- sql_result

## Required inputs

- tag_id
- asset_number
- date_range

## Produces

- asset_tag_hierarchies_records

# Examples

```
query_osisoft_pi_system_asset_tag_hierarchies(tag_id=<tag_id>, asset_number=<asset_number>, date_range=<date_range>)
```

# Citations

- [OSIsoft PI System](/systems/osisoft-pi-system.md)
