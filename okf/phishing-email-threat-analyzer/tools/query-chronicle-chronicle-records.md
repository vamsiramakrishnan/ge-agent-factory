---
type: Agent Tool
title: query_chronicle_chronicle_records
description: "Retrieve chronicle records from Chronicle for the Phishing & Email Threat Analyzer workflow."
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

# query_chronicle_chronicle_records

Retrieve chronicle records from Chronicle for the Phishing & Email Threat Analyzer workflow.

- **Kind:** query
- **Source system:** [Chronicle](/systems/chronicle.md)

## Inputs

- lookup_key
- date_range

## Outputs

- chronicle_records_records
- chronicle_records_summary

## Side Effects

- No mutation is declared by the spec for this tool.

## Idempotency

No idempotency key declared; no mutation is declared by the spec for this tool.

## Confirmation

No write confirmation policy is derivable from the spec.

## Permissions

No explicit permission scopes declared; source-system access is tied to [Chronicle](/systems/chronicle.md).

## Failure Modes

No explicit failure modes are declared in the spec; rely on refusal/escalation policies for unsafe or incomplete evidence.

## Used By

- [threat_intelligence_matching](/workflow/threat-intelligence-matching.md)

## Evals

- [Run the Phishing & Email Threat Analyzer workflow for the current period. Cite the relevant source-system evidence and surface any escalations required.](/tests/phishing-email-threat-analyzer-end-to-end.md)

## Evidence emitted

- source_system_record

## Required inputs

- lookup_key
- date_range

## Produces

- chronicle_records_records
- chronicle_records_summary

# Examples

```
query_chronicle_chronicle_records(lookup_key=<lookup_key>, date_range=<date_range>)
```

# Citations

- [Chronicle](/systems/chronicle.md)
