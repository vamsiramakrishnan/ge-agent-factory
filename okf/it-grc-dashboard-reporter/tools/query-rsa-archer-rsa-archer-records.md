---
type: Agent Tool
title: query_rsa_archer_rsa_archer_records
description: "Retrieve rsa archer records from RSA Archer for the IT GRC Dashboard & Reporter workflow."
tags:
  - it
  - okf
  - brd
timestamp: "2026-07-01T00:00:00.000Z"
source_kind: generationSpec
source_path: behaviorContract.toolIntents
generation_status: generated
ge_status: generated
---

# query_rsa_archer_rsa_archer_records

Retrieve rsa archer records from RSA Archer for the IT GRC Dashboard & Reporter workflow.

- **Kind:** query
- **Source system:** [RSA Archer](/systems/rsa-archer.md)

## Inputs

- lookup_key
- date_range

## Outputs

- rsa_archer_records_records
- rsa_archer_records_summary

## Side Effects

- No mutation is declared by the spec for this tool.

## Idempotency

No idempotency key declared; no mutation is declared by the spec for this tool.

## Confirmation

No write confirmation policy is derivable from the spec.

## Permissions

No explicit permission scopes declared; source-system access is tied to [RSA Archer](/systems/rsa-archer.md).

## Failure Modes

No explicit failure modes are declared in the spec; rely on refusal/escalation policies for unsafe or incomplete evidence.

## Used By

- [cross_domain_aggregation](/workflow/cross-domain-aggregation.md)

## Evals

- [Run the IT GRC Dashboard & Reporter workflow for the current period. Cite the relevant source-system evidence and surface any escalations required.](/tests/it-grc-dashboard-reporter-end-to-end.md)

## Evidence emitted

- source_system_record

## Required inputs

- lookup_key
- date_range

## Produces

- rsa_archer_records_records
- rsa_archer_records_summary

# Examples

```
query_rsa_archer_rsa_archer_records(lookup_key=<lookup_key>, date_range=<date_range>)
```

# Citations

- [RSA Archer](/systems/rsa-archer.md)
