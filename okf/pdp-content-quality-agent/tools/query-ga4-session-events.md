---
type: Agent Tool
title: query_ga4_session_events
description: Retrieve session events from GA4 for the PDP Content Quality Agent workflow.
tags:
  - retail
  - okf
  - brd
timestamp: "2026-07-04T00:00:00.000Z"
source_kind: generationSpec
source_path: behaviorContract.toolIntents
generation_status: generated
ge_status: generated
---

# query_ga4_session_events

Retrieve session events from GA4 for the PDP Content Quality Agent workflow.

- **Kind:** query
- **Source system:** [GA4](/systems/ga4.md)

## Inputs

- lookup_key
- date_range

## Outputs

- session_events_records
- session_events_summary

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

- [traffic_revenue_impact_scoring](/workflow/traffic-revenue-impact-scoring.md)
- [evidence_playbook_validation](/workflow/evidence-playbook-validation.md)

## Evals

- [Run the PDP Content Quality Agent workflow for the current period. Cite the relevant source-system evidence and surface any escalations required.](/tests/pdp-content-quality-agent-end-to-end.md)
- [SKU 84213067 (product_catalog_entries id 41) shows content_completeness_score 0.93, but its session_events tied to conversion_path id 118 haven't refreshed since June 30 (5 days stale), and cart_events show 14 abandon_cart events against only 2 complete_purchase events in the trailing 48 hours. Merchandising wants this SKU published to the enriched queue today. What do you do?](/tests/pdp-content-quality-agent-stale-conversion-evidence.md)

## Evidence emitted

- sql_result

## Required inputs

- lookup_key
- date_range

## Produces

- session_events_records
- session_events_summary

# Examples

```
query_ga4_session_events(lookup_key=<lookup_key>, date_range=<date_range>)
```

# Citations

- [GA4](/systems/ga4.md)
