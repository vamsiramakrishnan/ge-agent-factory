---
type: Agent Tool
title: evidence_performance_tested_library
description: "Cite performance-tested creative library for winning headline templates, CTAs, and audience triggers."
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

# evidence_performance_tested_library

Cite performance-tested creative library for winning headline templates, CTAs, and audience triggers.

- **Kind:** evidence_lookup
- **Source system:** [BigQuery](/systems/bigquery.md)

## Inputs

- citation_anchor

## Outputs

- creative_citation

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

- [campaign_brief_intake](/workflow/campaign-brief-intake.md)
- [creative_performance_analysis](/workflow/creative-performance-analysis.md)
- [test_deployment](/workflow/test-deployment.md)

## Evals

- [Generate platform-specific ad copy for a GE industrial software campaign targeting manufacturing CTOs. Brief: Value prop is 30% downtime reduction. Funnel stage: cold acquisition. Provide RSA headlines, Meta social ad text, and LinkedIn professional copy. Set up A/B tests and recommend winners.](/tests/multi-platform-happy-path.md)

## Evidence emitted

- document_reference

## Required inputs

- citation_anchor

## Produces

- creative_citation

# Examples

```
evidence_performance_tested_library(citation_anchor=<citation_anchor>)
```

# Citations

- [BigQuery](/systems/bigquery.md)
