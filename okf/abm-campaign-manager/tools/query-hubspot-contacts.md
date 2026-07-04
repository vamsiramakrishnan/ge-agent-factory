---
type: Agent Tool
title: query_hubspot_contacts
description: Retrieve contacts from HubSpot for the ABM Campaign Manager workflow.
tags:
  - marketing
  - okf
  - brd
timestamp: "2026-07-01T00:00:00.000Z"
source_kind: generationSpec
source_path: behaviorContract.toolIntents
generation_status: generated
ge_status: generated
---

# query_hubspot_contacts

Retrieve contacts from HubSpot for the ABM Campaign Manager workflow.

- **Kind:** query
- **Source system:** [HubSpot](/systems/hubspot.md)

## Inputs

- lookup_key
- date_range

## Outputs

- contacts_records
- contacts_summary

## Side Effects

- No mutation is declared by the spec for this tool.

## Idempotency

No idempotency key declared; no mutation is declared by the spec for this tool.

## Confirmation

No write confirmation policy is derivable from the spec.

## Permissions

No explicit permission scopes declared; source-system access is tied to [HubSpot](/systems/hubspot.md).

## Failure Modes

No explicit failure modes are declared in the spec; rely on refusal/escalation policies for unsafe or incomplete evidence.

## Used By

- [campaign_activation](/workflow/campaign-activation.md)

## Evals

- [Run the ABM Campaign Manager workflow for the current period. Cite the relevant source-system evidence and surface any escalations required.](/tests/abm-campaign-manager-end-to-end.md)

## Evidence emitted

- source_system_record

## Required inputs

- lookup_key
- date_range

## Produces

- contacts_records
- contacts_summary

# Examples

```
query_hubspot_contacts(lookup_key=<lookup_key>, date_range=<date_range>)
```

# Citations

- [HubSpot](/systems/hubspot.md)
