---
type: Agent Tool
title: lookup_data_catalog_lineage_agent_runbook
description: "Look up sections of the Data Catalog & Lineage Agent Operations Runbook to cite in narrative output, escalation rationale, and audit evidence."
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

# lookup_data_catalog_lineage_agent_runbook

Look up sections of the Data Catalog & Lineage Agent Operations Runbook to cite in narrative output, escalation rationale, and audit evidence.

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

- [auto_cataloging](/workflow/auto-cataloging.md)
- [lineage_graph_construction](/workflow/lineage-graph-construction.md)
- [natural_language_data_discovery](/workflow/natural-language-data-discovery.md)
- [pii_classification_governance](/workflow/pii-classification-governance.md)

## Evals

- [Run the Data Catalog & Lineage Agent workflow for the current period. Cite the relevant source-system evidence and surface any escalations required.](/tests/data-catalog-lineage-agent-end-to-end.md)

## Evidence emitted

- document_reference

## Required inputs

- section_anchor

## Produces

- document_section
- citation_anchor

# Examples

```
lookup_data_catalog_lineage_agent_runbook(section_anchor=<section_anchor>)
```

# Citations

- [BigQuery](/systems/bigquery.md)
