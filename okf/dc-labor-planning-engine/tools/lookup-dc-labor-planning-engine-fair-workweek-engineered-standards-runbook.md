---
type: Agent Tool
title: lookup_dc_labor_planning_engine_fair_workweek_engineered_standards_runbook
description: "Look up sections of the Fair Workweek Predictive Scheduling & Engineered Labor Standards Runbook to cite in narrative output and escalation rationale."
tags:
  - retail
  - okf
  - brd
timestamp: "2026-07-04T00:00:00.000Z"
source_kind: generationSpec
source_path: behaviorContract.toolIntents
generation_status: generated
ge_status: generated
---

# lookup_dc_labor_planning_engine_fair_workweek_engineered_standards_runbook

Look up sections of the Fair Workweek Predictive Scheduling & Engineered Labor Standards Runbook to cite in narrative output and escalation rationale.

- **Kind:** evidence_lookup
- **Source system:** [UKG Dimensions](/systems/ukg-dimensions.md)

## Inputs

- section_anchor

## Outputs

- document_section
- citation_anchor

## Side Effects

- No mutation is declared by the spec for this tool.

## Idempotency

No idempotency key declared; no mutation is declared by the spec for this tool.

## Confirmation

No write confirmation policy is derivable from the spec.

## Permissions

No explicit permission scopes declared; source-system access is tied to [UKG Dimensions](/systems/ukg-dimensions.md).

## Failure Modes

No explicit failure modes are declared in the spec; rely on refusal/escalation policies for unsafe or incomplete evidence.

## Used By

_Not bound to a workflow stage._

## Evals

_No eval scenario explicitly exercises this tool._

## Evidence emitted

- document_reference

## Required inputs

- section_anchor

## Produces

- document_section
- citation_anchor

# Examples

```
lookup_dc_labor_planning_engine_fair_workweek_engineered_standards_runbook(section_anchor=<section_anchor>)
```

# Citations

- [UKG Dimensions](/systems/ukg-dimensions.md)
