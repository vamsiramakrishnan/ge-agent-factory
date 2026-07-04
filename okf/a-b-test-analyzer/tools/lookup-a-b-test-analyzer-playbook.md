---
type: Agent Tool
title: lookup_a_b_test_analyzer_playbook
description: "Look up sections of the A/B Test Analyzer Playbook to cite in narrative output, escalation rationale, and audit evidence."
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

# lookup_a_b_test_analyzer_playbook

Look up sections of the A/B Test Analyzer Playbook to cite in narrative output, escalation rationale, and audit evidence.

- **Kind:** evidence_lookup
- **Source system:** [GA4](/systems/ga4.md)

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

No explicit permission scopes declared; source-system access is tied to [GA4](/systems/ga4.md).

## Failure Modes

No explicit failure modes are declared in the spec; rely on refusal/escalation policies for unsafe or incomplete evidence.

## Used By

- [test_data_collection](/workflow/test-data-collection.md)
- [statistical_significance_analysis](/workflow/statistical-significance-analysis.md)
- [archive_learning](/workflow/archive-learning.md)

## Evals

- [Run the A/B Test Analyzer workflow for the current period. Cite the relevant source-system evidence and surface any escalations required.](/tests/a-b-test-analyzer-end-to-end.md)

## Evidence emitted

- document_reference

## Required inputs

- section_anchor

## Produces

- document_section
- citation_anchor

# Examples

```
lookup_a_b_test_analyzer_playbook(section_anchor=<section_anchor>)
```

# Citations

- [GA4](/systems/ga4.md)
