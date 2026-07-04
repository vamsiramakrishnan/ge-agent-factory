---
type: Agent Tool
title: query_sap_grc_control_tests
description: Retrieve control tests from SAP GRC for the SOX Control Testing Agent workflow.
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

# query_sap_grc_control_tests

Retrieve control tests from SAP GRC for the SOX Control Testing Agent workflow.

- **Kind:** query
- **Source system:** [SAP GRC](/systems/sap-grc.md)

## Inputs

- lookup_key
- date_range

## Outputs

- control_tests_records
- control_tests_summary

## Side Effects

- No mutation is declared by the spec for this tool.

## Idempotency

No idempotency key declared; no mutation is declared by the spec for this tool.

## Confirmation

No write confirmation policy is derivable from the spec.

## Permissions

No explicit permission scopes declared; source-system access is tied to [SAP GRC](/systems/sap-grc.md).

## Failure Modes

No explicit failure modes are declared in the spec; rely on refusal/escalation policies for unsafe or incomplete evidence.

## Used By

- [evidence_collection](/workflow/evidence-collection.md)
- [deficiency_reasoning](/workflow/deficiency-reasoning.md)

## Evals

- [Run the SOX Control Testing Agent workflow for the current period. Cite the relevant source-system evidence and surface any escalations required.](/tests/sox-control-testing-agent-end-to-end.md)

## Evidence emitted

- source_system_record

## Required inputs

- lookup_key
- date_range

## Produces

- control_tests_records
- control_tests_summary

# Examples

```
query_sap_grc_control_tests(lookup_key=<lookup_key>, date_range=<date_range>)
```

# Citations

- [SAP GRC](/systems/sap-grc.md)
