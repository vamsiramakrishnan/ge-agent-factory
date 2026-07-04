---
type: Agent Tool
title: query_okta_users
description: Retrieve users from Okta for the Shadow IT Detector workflow.
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

# query_okta_users

Retrieve users from Okta for the Shadow IT Detector workflow.

- **Kind:** query
- **Source system:** [Okta](/systems/okta.md)

## Inputs

- lookup_key
- date_range

## Outputs

- users_records
- users_summary

## Side Effects

- No mutation is declared by the spec for this tool.

## Idempotency

No idempotency key declared; no mutation is declared by the spec for this tool.

## Confirmation

No write confirmation policy is derivable from the spec.

## Permissions

No explicit permission scopes declared; source-system access is tied to [Okta](/systems/okta.md).

## Failure Modes

No explicit failure modes are declared in the spec; rely on refusal/escalation policies for unsafe or incomplete evidence.

## Used By

- [multi_signal_detection](/workflow/multi-signal-detection.md)
- [policy_enforcement](/workflow/policy-enforcement.md)

## Evals

- [Run the Shadow IT Detector workflow for the current period. Cite the relevant source-system evidence and surface any escalations required.](/tests/shadow-it-detector-end-to-end.md)

## Evidence emitted

- source_system_record

## Required inputs

- lookup_key
- date_range

## Produces

- users_records
- users_summary

# Examples

```
query_okta_users(lookup_key=<lookup_key>, date_range=<date_range>)
```

# Citations

- [Okta](/systems/okta.md)
