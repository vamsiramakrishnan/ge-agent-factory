---
type: Agent Tool
title: action_google_trends_recommend
description: Execute the recommend step in Google Trends after the agent has gathered evidence and validated escalation gates.
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

# action_google_trends_recommend

Execute the recommend step in Google Trends after the agent has gathered evidence and validated escalation gates.

- **Kind:** action
- **Source system:** [Google Trends](/systems/google-trends.md)
- **API:** POST /api/google_trends/recommend

## Inputs

- target_id
- rationale

## Outputs

- action_id
- audit_record_id

## Side Effects

- May change Google Trends state because the spec classifies it as action.

## Idempotency

Declared idempotency key: target_id+rationale.

## Confirmation

- [Confirmation policy — action_google_trends_recommend](/policies/confirmation-action-google-trends-recommend.md)

## Permissions

No explicit permission scopes declared; source-system access is tied to [Google Trends](/systems/google-trends.md).

## Failure Modes

No explicit failure modes are declared in the spec; rely on refusal/escalation policies for unsafe or incomplete evidence.

## Used By

- [multi_signal_collection](/workflow/multi-signal-collection.md)
- [signal_vs_noise_assessment](/workflow/signal-vs-noise-assessment.md)
- [brief_alerting](/workflow/brief-alerting.md)

## Evals

- [Run the Market Trend & Signal Detector workflow for the current period. Cite the relevant source-system evidence and surface any escalations required.](/tests/market-trend-signal-detector-end-to-end.md)

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
action_google_trends_recommend(target_id=<target_id>, rationale=<rationale>)
```

# Citations

- [Google Trends](/systems/google-trends.md)
- [Confirmation policy — action_google_trends_recommend](/policies/confirmation-action-google-trends-recommend.md)
- [Idempotency policy — action_google_trends_recommend](/policies/idempotency-action-google-trends-recommend.md)
