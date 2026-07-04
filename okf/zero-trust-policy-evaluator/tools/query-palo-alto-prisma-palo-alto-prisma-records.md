---
type: Agent Tool
title: query_palo_alto_prisma_palo_alto_prisma_records
description: Retrieve palo alto prisma records from Palo Alto Prisma for the Zero Trust Policy Evaluator workflow.
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

# query_palo_alto_prisma_palo_alto_prisma_records

Retrieve palo alto prisma records from Palo Alto Prisma for the Zero Trust Policy Evaluator workflow.

- **Kind:** query
- **Source system:** [Palo Alto Prisma](/systems/palo-alto-prisma.md)

## Inputs

- lookup_key
- date_range

## Outputs

- palo_alto_prisma_records_records
- palo_alto_prisma_records_summary

## Side Effects

- No mutation is declared by the spec for this tool.

## Idempotency

No idempotency key declared; no mutation is declared by the spec for this tool.

## Confirmation

No write confirmation policy is derivable from the spec.

## Permissions

No explicit permission scopes declared; source-system access is tied to [Palo Alto Prisma](/systems/palo-alto-prisma.md).

## Failure Modes

No explicit failure modes are declared in the spec; rely on refusal/escalation policies for unsafe or incomplete evidence.

## Used By

- [policy_inventory](/workflow/policy-inventory.md)

## Evals

- [Run the Zero Trust Policy Evaluator workflow for the current period. Cite the relevant source-system evidence and surface any escalations required.](/tests/zero-trust-policy-evaluator-end-to-end.md)

## Evidence emitted

- source_system_record

## Required inputs

- lookup_key
- date_range

## Produces

- palo_alto_prisma_records_records
- palo_alto_prisma_records_summary

# Examples

```
query_palo_alto_prisma_palo_alto_prisma_records(lookup_key=<lookup_key>, date_range=<date_range>)
```

# Citations

- [Palo Alto Prisma](/systems/palo-alto-prisma.md)
