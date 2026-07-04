---
type: Agent Tool
title: lookup_revenue_assurance_adjustment_authority_matrix
description: "Look up sections of the Revenue Assurance Adjustment & Write-Off Delegation of Authority Policy to cite in narrative output and escalation rationale."
tags:
  - telco
  - okf
  - brd
timestamp: "2026-07-04T00:00:00.000Z"
source_kind: generationSpec
source_path: behaviorContract.toolIntents
generation_status: generated
ge_status: generated
---

# lookup_revenue_assurance_adjustment_authority_matrix

Look up sections of the Revenue Assurance Adjustment & Write-Off Delegation of Authority Policy to cite in narrative output and escalation rationale.

- **Kind:** evidence_lookup
- **Source system:** [BigQuery](/systems/bigquery.md)

## Inputs

- section_anchor

## Outputs

- document_section
- citation_anchor

## Side Effects

- May change BigQuery state because the spec classifies it as evidence_lookup.

## Idempotency

No idempotency key is declared in the spec or matched API; require one before production writes.

## Confirmation

- [Confirmation policy — lookup_revenue_assurance_adjustment_authority_matrix](/policies/confirmation-lookup-revenue-assurance-adjustment-authority-matrix.md)

## Permissions

No explicit permission scopes declared; source-system access is tied to [BigQuery](/systems/bigquery.md).

## Failure Modes

No explicit failure modes are declared in the spec; rely on refusal/escalation policies for unsafe or incomplete evidence.

## Used By

_Not bound to a workflow stage._

## Evals

_No eval scenario explicitly exercises this tool._

## Evidence emitted

- document_reference

## Required inputs

- section_anchor

## Produces

- document_section
- citation_anchor

# Examples

```
lookup_revenue_assurance_adjustment_authority_matrix(section_anchor=<section_anchor>)
```

# Citations

- [BigQuery](/systems/bigquery.md)
- [Confirmation policy — lookup_revenue_assurance_adjustment_authority_matrix](/policies/confirmation-lookup-revenue-assurance-adjustment-authority-matrix.md)
