---
type: Agent Tool
title: action_sap_ariba_discovery_match
description: Execute the match step in SAP Ariba Discovery after the agent has gathered evidence and validated escalation gates.
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

# action_sap_ariba_discovery_match

Execute the match step in SAP Ariba Discovery after the agent has gathered evidence and validated escalation gates.

- **Kind:** action
- **Source system:** [SAP Ariba Discovery](/systems/sap-ariba-discovery.md)
- **API:** POST /api/sap_ariba_discovery/match

## Inputs

- target_id
- rationale

## Outputs

- action_id
- audit_record_id

## Side Effects

- May change SAP Ariba Discovery state because the spec classifies it as action.

## Idempotency

Declared idempotency key: target_id+rationale.

## Confirmation

- [Confirmation policy — action_sap_ariba_discovery_match](/policies/confirmation-action-sap-ariba-discovery-match.md)

## Permissions

No explicit permission scopes declared; source-system access is tied to [SAP Ariba Discovery](/systems/sap-ariba-discovery.md).

## Failure Modes

No explicit failure modes are declared in the spec; rely on refusal/escalation policies for unsafe or incomplete evidence.

## Used By

- [requirement_parsing_taxonomy_translation](/workflow/requirement-parsing-taxonomy-translation.md)
- [multi_source_discovery_filtering](/workflow/multi-source-discovery-filtering.md)
- [semantic_capability_matching_ranking](/workflow/semantic-capability-matching-ranking.md)

## Evals

- [Run the Supplier Discovery & Matching workflow for the current period. Cite the relevant source-system evidence and surface any escalations required.](/tests/supplier-discovery-matching-end-to-end.md)

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
action_sap_ariba_discovery_match(target_id=<target_id>, rationale=<rationale>)
```

# Citations

- [SAP Ariba Discovery](/systems/sap-ariba-discovery.md)
- [Confirmation policy — action_sap_ariba_discovery_match](/policies/confirmation-action-sap-ariba-discovery-match.md)
- [Idempotency policy — action_sap_ariba_discovery_match](/policies/idempotency-action-sap-ariba-discovery-match.md)
