---
type: Agent Tool
title: query_culture_amp_engagement_scores
description: "Query engagement survey responses by theme (leadership, growth, belonging, compensation) to correlate with flight risk."
tags:
  - hr
  - okf
  - brd
timestamp: "2026-07-01T00:00:00.000Z"
source_kind: generationSpec
source_path: behaviorContract.toolIntents
generation_status: generated
ge_status: generated
---

# query_culture_amp_engagement_scores

Query engagement survey responses by theme (leadership, growth, belonging, compensation) to correlate with flight risk.

- **Kind:** query
- **Source system:** [Culture Amp](/systems/culture-amp.md)

## Inputs

- survey_cycle
- team_id

## Outputs

- engagement_responses
- theme_scores
- comments

## Side Effects

- No mutation is declared by the spec for this tool.

## Idempotency

No idempotency key declared; no mutation is declared by the spec for this tool.

## Confirmation

No write confirmation policy is derivable from the spec.

## Permissions

No explicit permission scopes declared; source-system access is tied to [Culture Amp](/systems/culture-amp.md).

## Failure Modes

No explicit failure modes are declared in the spec; rely on refusal/escalation policies for unsafe or incomplete evidence.

## Used By

- [feature_engineering](/workflow/feature-engineering.md)

## Evals

- [Analyze attrition risk for the Finance team (25 employees) over Q2 2025 and publish a Looker dashboard with risk heatmap and prior intervention ROI.](/tests/team-heatmap-with-intervention-roi.md)
- [Compute flight risk for a Finance analyst with low engagement trend and 18 months tenure. Identify root cause and recommend an intervention.](/tests/individual-risk-with-root-cause-and-recommendation.md)

## Evidence emitted

- source_system_record

## Required inputs

- survey_cycle
- team_id

## Produces

- engagement_responses
- theme_scores
- comments

# Examples

```
query_culture_amp_engagement_scores(survey_cycle=<survey_cycle>, team_id=<team_id>)
```

# Citations

- [Culture Amp](/systems/culture-amp.md)
