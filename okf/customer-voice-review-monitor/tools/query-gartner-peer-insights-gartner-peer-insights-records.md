---
type: Agent Tool
title: query_gartner_peer_insights_gartner_peer_insights_records
description: "Retrieve gartner peer insights records from Gartner Peer Insights for the Customer Voice & Review Monitor workflow."
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

# query_gartner_peer_insights_gartner_peer_insights_records

Retrieve gartner peer insights records from Gartner Peer Insights for the Customer Voice & Review Monitor workflow.

- **Kind:** query
- **Source system:** [Gartner Peer Insights](/systems/gartner-peer-insights.md)

## Inputs

- lookup_key
- date_range

## Outputs

- gartner_peer_insights_records_records
- gartner_peer_insights_records_summary

## Side Effects

- No mutation is declared by the spec for this tool.

## Idempotency

No idempotency key declared; no mutation is declared by the spec for this tool.

## Confirmation

No write confirmation policy is derivable from the spec.

## Permissions

No explicit permission scopes declared; source-system access is tied to [Gartner Peer Insights](/systems/gartner-peer-insights.md).

## Failure Modes

No explicit failure modes are declared in the spec; rely on refusal/escalation policies for unsafe or incomplete evidence.

## Used By

- [review_collection](/workflow/review-collection.md)

## Evals

- [Run the Customer Voice & Review Monitor workflow for the current period. Cite the relevant source-system evidence and surface any escalations required.](/tests/customer-voice-review-monitor-end-to-end.md)

## Evidence emitted

- source_system_record

## Required inputs

- lookup_key
- date_range

## Produces

- gartner_peer_insights_records_records
- gartner_peer_insights_records_summary

# Examples

```
query_gartner_peer_insights_gartner_peer_insights_records(lookup_key=<lookup_key>, date_range=<date_range>)
```

# Citations

- [Gartner Peer Insights](/systems/gartner-peer-insights.md)
