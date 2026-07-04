---
type: Agent Tool
title: lookup_influencer_discovery_tracking_playbook
description: "Look up sections of the Influencer Discovery & Tracking Playbook to cite in narrative output, escalation rationale, and audit evidence."
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

# lookup_influencer_discovery_tracking_playbook

Look up sections of the Influencer Discovery & Tracking Playbook to cite in narrative output, escalation rationale, and audit evidence.

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

- [influencer_discovery](/workflow/influencer-discovery.md)
- [quantitative_scoring](/workflow/quantitative-scoring.md)
- [content_quality_assessment](/workflow/content-quality-assessment.md)
- [recommendation_tracking](/workflow/recommendation-tracking.md)

## Evals

- [Run the Influencer Discovery & Tracking workflow for the current period. Cite the relevant source-system evidence and surface any escalations required.](/tests/influencer-discovery-tracking-end-to-end.md)

## Evidence emitted

- document_reference

## Required inputs

- section_anchor

## Produces

- document_section
- citation_anchor

# Examples

```
lookup_influencer_discovery_tracking_playbook(section_anchor=<section_anchor>)
```

# Citations

- [BigQuery](/systems/bigquery.md)
