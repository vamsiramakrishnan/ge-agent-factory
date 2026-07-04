---
type: Agent Tool
title: action_ahrefs_recommend
description: Execute the recommend step in Ahrefs after the agent has gathered evidence and validated escalation gates.
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

# action_ahrefs_recommend

Execute the recommend step in Ahrefs after the agent has gathered evidence and validated escalation gates.

- **Kind:** action
- **Source system:** [Ahrefs](/systems/ahrefs.md)
- **API:** POST /api/ahrefs/recommend

## Inputs

- target_id
- rationale

## Outputs

- action_id
- audit_record_id

## Side Effects

- May change Ahrefs state because the spec classifies it as action.

## Idempotency

Declared idempotency key: target_id+rationale.

## Confirmation

- [Confirmation policy — action_ahrefs_recommend](/policies/confirmation-action-ahrefs-recommend.md)

## Permissions

No explicit permission scopes declared; source-system access is tied to [Ahrefs](/systems/ahrefs.md).

## Failure Modes

No explicit failure modes are declared in the spec; rely on refusal/escalation policies for unsafe or incomplete evidence.

## Used By

- [technical_crawl_aggregation](/workflow/technical-crawl-aggregation.md)
- [ticket_report_generation](/workflow/ticket-report-generation.md)

## Evals

- [Run the SEO Audit & Recommendation Engine workflow for the current period. Cite the relevant source-system evidence and surface any escalations required.](/tests/seo-audit-recommendation-engine-end-to-end.md)

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
action_ahrefs_recommend(target_id=<target_id>, rationale=<rationale>)
```

# Citations

- [Ahrefs](/systems/ahrefs.md)
- [Confirmation policy — action_ahrefs_recommend](/policies/confirmation-action-ahrefs-recommend.md)
- [Idempotency policy — action_ahrefs_recommend](/policies/idempotency-action-ahrefs-recommend.md)
