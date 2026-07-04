---
type: Agent Tool
title: query_legal_playbook_legal_playbook_records
description: Retrieve legal playbook records from Legal Playbook for the Clause Risk Analyzer workflow.
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

# query_legal_playbook_legal_playbook_records

Retrieve legal playbook records from Legal Playbook for the Clause Risk Analyzer workflow.

- **Kind:** query
- **Source system:** [Legal Playbook](/systems/legal-playbook.md)

## Inputs

- lookup_key
- date_range

## Outputs

- legal_playbook_records_records
- legal_playbook_records_summary

## Side Effects

- No mutation is declared by the spec for this tool.

## Idempotency

No idempotency key declared; no mutation is declared by the spec for this tool.

## Confirmation

No write confirmation policy is derivable from the spec.

## Permissions

No explicit permission scopes declared; source-system access is tied to [Legal Playbook](/systems/legal-playbook.md).

## Failure Modes

No explicit failure modes are declared in the spec; rely on refusal/escalation policies for unsafe or incomplete evidence.

## Used By

- [deviation_scoring](/workflow/deviation-scoring.md)

## Evals

- [Run the Clause Risk Analyzer workflow for the current period. Cite the relevant source-system evidence and surface any escalations required.](/tests/clause-risk-analyzer-end-to-end.md)

## Evidence emitted

- source_system_record

## Required inputs

- lookup_key
- date_range

## Produces

- legal_playbook_records_records
- legal_playbook_records_summary

# Examples

```
query_legal_playbook_legal_playbook_records(lookup_key=<lookup_key>, date_range=<date_range>)
```

# Citations

- [Legal Playbook](/systems/legal-playbook.md)
