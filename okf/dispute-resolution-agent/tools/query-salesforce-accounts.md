---
type: Agent Tool
title: query_salesforce_accounts
description: Retrieve accounts from Salesforce for the Dispute Resolution Agent workflow.
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

# query_salesforce_accounts

Retrieve accounts from Salesforce for the Dispute Resolution Agent workflow.

- **Kind:** query
- **Source system:** [Salesforce](/systems/salesforce.md)

## Inputs

- lookup_key
- date_range

## Outputs

- accounts_records
- accounts_summary

## Side Effects

- No mutation is declared by the spec for this tool.

## Idempotency

No idempotency key declared; no mutation is declared by the spec for this tool.

## Confirmation

No write confirmation policy is derivable from the spec.

## Permissions

No explicit permission scopes declared; source-system access is tied to [Salesforce](/systems/salesforce.md).

## Failure Modes

No explicit failure modes are declared in the spec; rely on refusal/escalation policies for unsafe or incomplete evidence.

## Used By

_Not bound to a workflow stage._

## Evals

- [Run the Dispute Resolution Agent workflow for the current period. Cite the relevant source-system evidence and surface any escalations required.](/tests/dispute-resolution-agent-end-to-end.md)

## Evidence emitted

- source_system_record

## Required inputs

- lookup_key
- date_range

## Produces

- accounts_records
- accounts_summary

# Examples

```
query_salesforce_accounts(lookup_key=<lookup_key>, date_range=<date_range>)
```

# Citations

- [Salesforce](/systems/salesforce.md)
