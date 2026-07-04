---
type: Agent Tool
title: query_culture_amp_engagement_surveys
description: "Retrieve engagement surveys from Culture Amp for the Engagement-to-Outcome Correlation Agent workflow."
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

# query_culture_amp_engagement_surveys

Retrieve engagement surveys from Culture Amp for the Engagement-to-Outcome Correlation Agent workflow.

- **Kind:** query
- **Source system:** [Culture Amp](/systems/culture-amp.md)

## Inputs

- lookup_key
- date_range

## Outputs

- engagement_surveys_records
- engagement_surveys_summary

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

- [data_integration](/workflow/data-integration.md)
- [statistical_correlation](/workflow/statistical-correlation.md)
- [impact_quantification](/workflow/impact-quantification.md)

## Evals

- [Run the Engagement-to-Outcome Correlation Agent workflow for the current period. Cite the relevant source-system evidence and surface any escalations required.](/tests/engagement-to-outcome-correlation-agent-end-to-end.md)

## Evidence emitted

- source_system_record

## Required inputs

- lookup_key
- date_range

## Produces

- engagement_surveys_records
- engagement_surveys_summary

# Examples

```
query_culture_amp_engagement_surveys(lookup_key=<lookup_key>, date_range=<date_range>)
```

# Citations

- [Culture Amp](/systems/culture-amp.md)
