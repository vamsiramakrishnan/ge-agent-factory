---
type: Agent Tool
title: query_regulatory_feeds_regulatory_feeds_records
description: Retrieve regulatory feeds records from Regulatory Feeds for the Regulatory Compliance Tracker workflow.
tags:
  - procurement
  - okf
  - brd
timestamp: "2026-07-01T00:00:00.000Z"
source_kind: generationSpec
source_path: behaviorContract.toolIntents
generation_status: generated
ge_status: generated
---

# query_regulatory_feeds_regulatory_feeds_records

Retrieve regulatory feeds records from Regulatory Feeds for the Regulatory Compliance Tracker workflow.

- **Kind:** query
- **Source system:** [Regulatory Feeds](/systems/regulatory-feeds.md)

## Inputs

- lookup_key
- date_range

## Outputs

- regulatory_feeds_records_records
- regulatory_feeds_records_summary

## Side Effects

- No mutation is declared by the spec for this tool.

## Idempotency

No idempotency key declared; no mutation is declared by the spec for this tool.

## Confirmation

No write confirmation policy is derivable from the spec.

## Permissions

No explicit permission scopes declared; source-system access is tied to [Regulatory Feeds](/systems/regulatory-feeds.md).

## Failure Modes

No explicit failure modes are declared in the spec; rely on refusal/escalation policies for unsafe or incomplete evidence.

## Used By

- [regulatory_change_detection](/workflow/regulatory-change-detection.md)
- [compliance_gap_scoring](/workflow/compliance-gap-scoring.md)
- [regulatory_impact_interpretation](/workflow/regulatory-impact-interpretation.md)

## Evals

- [Run the Regulatory Compliance Tracker workflow for the current period. Cite the relevant source-system evidence and surface any escalations required.](/tests/regulatory-compliance-tracker-end-to-end.md)

## Evidence emitted

- source_system_record

## Required inputs

- lookup_key
- date_range

## Produces

- regulatory_feeds_records_records
- regulatory_feeds_records_summary

# Examples

```
query_regulatory_feeds_regulatory_feeds_records(lookup_key=<lookup_key>, date_range=<date_range>)
```

# Citations

- [Regulatory Feeds](/systems/regulatory-feeds.md)
