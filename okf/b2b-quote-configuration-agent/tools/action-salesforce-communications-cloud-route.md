---
type: Agent Tool
title: action_salesforce_communications_cloud_route
description: Execute the route step in Salesforce Communications Cloud after the agent has gathered evidence and validated escalation gates.
tags:
  - telco
  - okf
  - brd
timestamp: "2026-07-04T00:00:00.000Z"
source_kind: generationSpec
source_path: behaviorContract.toolIntents
generation_status: generated
ge_status: generated
---

# action_salesforce_communications_cloud_route

Execute the route step in Salesforce Communications Cloud after the agent has gathered evidence and validated escalation gates.

- **Kind:** action
- **Source system:** [Salesforce Communications Cloud](/systems/salesforce-communications-cloud.md)
- **API:** POST /api/salesforce_communications_cloud/route

## Inputs

- target_id
- rationale

## Outputs

- action_id
- audit_record_id

## Side Effects

- May change Salesforce Communications Cloud state because the spec classifies it as action.

## Idempotency

Declared idempotency key: target_id+rationale.

## Confirmation

- [Confirmation policy — action_salesforce_communications_cloud_route](/policies/confirmation-action-salesforce-communications-cloud-route.md)

## Permissions

No explicit permission scopes declared; source-system access is tied to [Salesforce Communications Cloud](/systems/salesforce-communications-cloud.md).

## Failure Modes

No explicit failure modes are declared in the spec; rely on refusal/escalation policies for unsafe or incomplete evidence.

## Used By

- [retrieve_records](/workflow/retrieve-records.md)
- [act_audit](/workflow/act-audit.md)

## Evals

- [Run the B2B Quote Configuration Agent workflow for the current period. Cite the relevant source-system evidence and surface any escalations required.](/tests/b2b-quote-configuration-agent-end-to-end.md)

## Evidence emitted

- api_response
- generated_audit_trail

## Required inputs

- target_id
- rationale

## Produces

- action_id
- audit_record_id

# Examples

```
action_salesforce_communications_cloud_route(target_id=<target_id>, rationale=<rationale>)
```

# Citations

- [Salesforce Communications Cloud](/systems/salesforce-communications-cloud.md)
- [Confirmation policy — action_salesforce_communications_cloud_route](/policies/confirmation-action-salesforce-communications-cloud-route.md)
- [Idempotency policy — action_salesforce_communications_cloud_route](/policies/idempotency-action-salesforce-communications-cloud-route.md)
