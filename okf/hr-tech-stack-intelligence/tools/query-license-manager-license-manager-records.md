---
type: Agent Tool
title: query_license_manager_license_manager_records
description: Retrieve license manager records from License Manager for the HR Tech Stack Intelligence workflow.
tags:
  - hr
  - okf
  - brd
timestamp: "2026-07-01T00:00:00.000Z"
source_kind: generationSpec
source_path: behaviorContract.toolIntents
generation_status: generated
ge_status: generated
---

# query_license_manager_license_manager_records

Retrieve license manager records from License Manager for the HR Tech Stack Intelligence workflow.

- **Kind:** query
- **Source system:** [License Manager](/systems/license-manager.md)

## Inputs

- lookup_key
- date_range

## Outputs

- license_manager_records_records
- license_manager_records_summary

## Side Effects

- No mutation is declared by the spec for this tool.

## Idempotency

No idempotency key declared; no mutation is declared by the spec for this tool.

## Confirmation

No write confirmation policy is derivable from the spec.

## Permissions

No explicit permission scopes declared; source-system access is tied to [License Manager](/systems/license-manager.md).

## Failure Modes

No explicit failure modes are declared in the spec; rely on refusal/escalation policies for unsafe or incomplete evidence.

## Used By

- [usage_data_collection](/workflow/usage-data-collection.md)
- [utilization_analysis](/workflow/utilization-analysis.md)

## Evals

- [Run the HR Tech Stack Intelligence workflow for the current period. Cite the relevant source-system evidence and surface any escalations required.](/tests/hr-tech-stack-intelligence-end-to-end.md)

## Evidence emitted

- source_system_record

## Required inputs

- lookup_key
- date_range

## Produces

- license_manager_records_records
- license_manager_records_summary

# Examples

```
query_license_manager_license_manager_records(lookup_key=<lookup_key>, date_range=<date_range>)
```

# Citations

- [License Manager](/systems/license-manager.md)
