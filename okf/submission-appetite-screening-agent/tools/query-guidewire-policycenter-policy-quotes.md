---
type: Agent Tool
title: query_guidewire_policycenter_policy_quotes
description: Retrieve policy quotes from Guidewire PolicyCenter for the Submission Appetite Screening Agent workflow.
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

# query_guidewire_policycenter_policy_quotes

Retrieve policy quotes from Guidewire PolicyCenter for the Submission Appetite Screening Agent workflow.

- **Kind:** query
- **Source system:** [Guidewire PolicyCenter](/systems/guidewire-policycenter.md)

## Inputs

- quote_number
- applicant_name
- date_range

## Outputs

- policy_quotes_records

## Side Effects

- No mutation is declared by the spec for this tool.

## Idempotency

No idempotency key declared; no mutation is declared by the spec for this tool.

## Confirmation

No write confirmation policy is derivable from the spec.

## Permissions

No explicit permission scopes declared; source-system access is tied to [Guidewire PolicyCenter](/systems/guidewire-policycenter.md).

## Failure Modes

No explicit failure modes are declared in the spec; rely on refusal/escalation policies for unsafe or incomplete evidence.

## Used By

_Not bound to a workflow stage._

## Evals

_No eval scenario explicitly exercises this tool._

## Evidence emitted

- source_system_record

## Required inputs

- quote_number
- applicant_name
- date_range

## Produces

- policy_quotes_records

# Examples

```
query_guidewire_policycenter_policy_quotes(quote_number=<quote_number>, applicant_name=<applicant_name>, date_range=<date_range>)
```

# Citations

- [Guidewire PolicyCenter](/systems/guidewire-policycenter.md)
