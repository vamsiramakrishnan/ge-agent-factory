---
type: Agent Tool
title: query_qualtrics_survey_responses
description: Retrieve survey responses from Qualtrics for the Engagement Insight Synthesizer workflow.
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

# query_qualtrics_survey_responses

Retrieve survey responses from Qualtrics for the Engagement Insight Synthesizer workflow.

- **Kind:** query
- **Source system:** [Qualtrics](/systems/qualtrics.md)

## Inputs

- lookup_key
- date_range

## Outputs

- survey_responses_records
- survey_responses_summary

## Side Effects

- No mutation is declared by the spec for this tool.

## Idempotency

No idempotency key declared; no mutation is declared by the spec for this tool.

## Confirmation

No write confirmation policy is derivable from the spec.

## Permissions

No explicit permission scopes declared; source-system access is tied to [Qualtrics](/systems/qualtrics.md).

## Failure Modes

No explicit failure modes are declared in the spec; rely on refusal/escalation policies for unsafe or incomplete evidence.

## Used By

- [response_ingestion](/workflow/response-ingestion.md)
- [theme_sentiment_extraction](/workflow/theme-sentiment-extraction.md)

## Evals

- [Run the Engagement Insight Synthesizer workflow for the current period. Cite the relevant source-system evidence and surface any escalations required.](/tests/engagement-insight-synthesizer-end-to-end.md)

## Evidence emitted

- source_system_record

## Required inputs

- lookup_key
- date_range

## Produces

- survey_responses_records
- survey_responses_summary

# Examples

```
query_qualtrics_survey_responses(lookup_key=<lookup_key>, date_range=<date_range>)
```

# Citations

- [Qualtrics](/systems/qualtrics.md)
