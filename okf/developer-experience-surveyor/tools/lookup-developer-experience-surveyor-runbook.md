---
type: Agent Tool
title: lookup_developer_experience_surveyor_runbook
description: "Look up sections of the Developer Experience Surveyor Operations Runbook to cite in narrative output, escalation rationale, and audit evidence."
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

# lookup_developer_experience_surveyor_runbook

Look up sections of the Developer Experience Surveyor Operations Runbook to cite in narrative output, escalation rationale, and audit evidence.

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

- [metric_collection](/workflow/metric-collection.md)
- [dora_sentiment_scoring](/workflow/dora-sentiment-scoring.md)
- [dev_ex_synthesis](/workflow/dev-ex-synthesis.md)
- [report_distribution](/workflow/report-distribution.md)

## Evals

- [Run the Developer Experience Surveyor workflow for the current period. Cite the relevant source-system evidence and surface any escalations required.](/tests/developer-experience-surveyor-end-to-end.md)

## Evidence emitted

- document_reference

## Required inputs

- section_anchor

## Produces

- document_section
- citation_anchor

# Examples

```
lookup_developer_experience_surveyor_runbook(section_anchor=<section_anchor>)
```

# Citations

- [BigQuery](/systems/bigquery.md)
