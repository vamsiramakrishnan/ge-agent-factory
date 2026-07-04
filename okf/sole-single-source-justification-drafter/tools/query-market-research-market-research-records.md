---
type: Agent Tool
title: query_market_research_market_research_records
description: Retrieve market research records from Market research for the Sole/Single Source Justification Drafter workflow.
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

# query_market_research_market_research_records

Retrieve market research records from Market research for the Sole/Single Source Justification Drafter workflow.

- **Kind:** query
- **Source system:** [Market research](/systems/market-research.md)

## Inputs

- lookup_key
- date_range

## Outputs

- market_research_records_records
- market_research_records_summary

## Side Effects

- No mutation is declared by the spec for this tool.

## Idempotency

No idempotency key declared; no mutation is declared by the spec for this tool.

## Confirmation

No write confirmation policy is derivable from the spec.

## Permissions

No explicit permission scopes declared; source-system access is tied to [Market research](/systems/market-research.md).

## Failure Modes

No explicit failure modes are declared in the spec; rely on refusal/escalation policies for unsafe or incomplete evidence.

## Used By

- [market_alternative_scan](/workflow/market-alternative-scan.md)
- [justification_drafting_challenge](/workflow/justification-drafting-challenge.md)

## Evals

- [Run the Sole/Single Source Justification Drafter workflow for the current period. Cite the relevant source-system evidence and surface any escalations required.](/tests/sole-single-source-justification-drafter-end-to-end.md)

## Evidence emitted

- source_system_record

## Required inputs

- lookup_key
- date_range

## Produces

- market_research_records_records
- market_research_records_summary

# Examples

```
query_market_research_market_research_records(lookup_key=<lookup_key>, date_range=<date_range>)
```

# Citations

- [Market research](/systems/market-research.md)
