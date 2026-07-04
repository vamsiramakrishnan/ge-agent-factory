---
type: Agent Tool
title: lookup_social_listening_sentiment_analyzer_playbook
description: "Look up sections of the Social Listening & Sentiment Analyzer Playbook to cite in narrative output, escalation rationale, and audit evidence."
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

# lookup_social_listening_sentiment_analyzer_playbook

Look up sections of the Social Listening & Sentiment Analyzer Playbook to cite in narrative output, escalation rationale, and audit evidence.

- **Kind:** evidence_lookup
- **Source system:** [BigQuery](/systems/bigquery.md)

## Inputs

- section_anchor

## Outputs

- document_section
- citation_anchor

## Side Effects

- No mutation is declared by the spec for this tool.

## Idempotency

No idempotency key declared; no mutation is declared by the spec for this tool.

## Confirmation

No write confirmation policy is derivable from the spec.

## Permissions

No explicit permission scopes declared; source-system access is tied to [BigQuery](/systems/bigquery.md).

## Failure Modes

No explicit failure modes are declared in the spec; rely on refusal/escalation policies for unsafe or incomplete evidence.

## Used By

- [social_mention_aggregation](/workflow/social-mention-aggregation.md)
- [quantitative_sentiment_analysis](/workflow/quantitative-sentiment-analysis.md)
- [contextual_interpretation](/workflow/contextual-interpretation.md)
- [alert_distribution](/workflow/alert-distribution.md)

## Evals

- [Run the Social Listening & Sentiment Analyzer workflow for the current period. Cite the relevant source-system evidence and surface any escalations required.](/tests/social-listening-sentiment-analyzer-end-to-end.md)

## Evidence emitted

- document_reference

## Required inputs

- section_anchor

## Produces

- document_section
- citation_anchor

# Examples

```
lookup_social_listening_sentiment_analyzer_playbook(section_anchor=<section_anchor>)
```

# Citations

- [BigQuery](/systems/bigquery.md)
