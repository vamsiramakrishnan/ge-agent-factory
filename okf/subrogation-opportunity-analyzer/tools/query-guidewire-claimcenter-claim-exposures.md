---
type: Agent Tool
title: query_guidewire_claimcenter_claim_exposures
description: Retrieve claim exposures from Guidewire ClaimCenter for the Subrogation Opportunity Analyzer workflow.
tags:
  - insurance
  - okf
  - brd
timestamp: "2026-07-04T00:00:00.000Z"
source_kind: generationSpec
source_path: behaviorContract.toolIntents
generation_status: generated
ge_status: generated
---

# query_guidewire_claimcenter_claim_exposures

Retrieve claim exposures from Guidewire ClaimCenter for the Subrogation Opportunity Analyzer workflow.

- **Kind:** query
- **Source system:** [Guidewire ClaimCenter](/systems/guidewire-claimcenter.md)

## Inputs

- exposure_id
- claim_number
- date_range

## Outputs

- claim_exposures_records

## Side Effects

- No mutation is declared by the spec for this tool.

## Idempotency

No idempotency key declared; no mutation is declared by the spec for this tool.

## Confirmation

No write confirmation policy is derivable from the spec.

## Permissions

No explicit permission scopes declared; source-system access is tied to [Guidewire ClaimCenter](/systems/guidewire-claimcenter.md).

## Failure Modes

No explicit failure modes are declared in the spec; rely on refusal/escalation policies for unsafe or incomplete evidence.

## Used By

_Not bound to a workflow stage._

## Evals

_No eval scenario explicitly exercises this tool._

## Evidence emitted

- source_system_record

## Required inputs

- exposure_id
- claim_number
- date_range

## Produces

- claim_exposures_records

# Examples

```
query_guidewire_claimcenter_claim_exposures(exposure_id=<exposure_id>, claim_number=<claim_number>, date_range=<date_range>)
```

# Citations

- [Guidewire ClaimCenter](/systems/guidewire-claimcenter.md)
