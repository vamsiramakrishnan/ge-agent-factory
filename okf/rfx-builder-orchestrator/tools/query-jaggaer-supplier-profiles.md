---
type: Agent Tool
title: query_jaggaer_supplier_profiles
description: "Retrieve supplier profiles from Jaggaer for the RFx Builder & Orchestrator workflow."
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

# query_jaggaer_supplier_profiles

Retrieve supplier profiles from Jaggaer for the RFx Builder & Orchestrator workflow.

- **Kind:** query
- **Source system:** [Jaggaer](/systems/jaggaer.md)

## Inputs

- lookup_key
- date_range

## Outputs

- supplier_profiles_records
- supplier_profiles_summary

## Side Effects

- No mutation is declared by the spec for this tool.

## Idempotency

No idempotency key declared; no mutation is declared by the spec for this tool.

## Confirmation

No write confirmation policy is derivable from the spec.

## Permissions

No explicit permission scopes declared; source-system access is tied to [Jaggaer](/systems/jaggaer.md).

## Failure Modes

No explicit failure modes are declared in the spec; rely on refusal/escalation policies for unsafe or incomplete evidence.

## Used By

- [requirements_ingestion](/workflow/requirements-ingestion.md)
- [shortlist_response_prediction](/workflow/shortlist-response-prediction.md)
- [rfp_drafting_q_a](/workflow/rfp-drafting-q-a.md)
- [event_orchestration_distribution](/workflow/event-orchestration-distribution.md)

## Evals

- [Run the RFx Builder & Orchestrator workflow for the current period. Cite the relevant source-system evidence and surface any escalations required.](/tests/rfx-builder-orchestrator-end-to-end.md)

## Evidence emitted

- source_system_record

## Required inputs

- lookup_key
- date_range

## Produces

- supplier_profiles_records
- supplier_profiles_summary

# Examples

```
query_jaggaer_supplier_profiles(lookup_key=<lookup_key>, date_range=<date_range>)
```

# Citations

- [Jaggaer](/systems/jaggaer.md)
