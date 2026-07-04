---
type: Agent Tool
title: query_mitre_att_ck_mitre_att_ck_records
description: "Retrieve mitre att ck records from MITRE ATT&CK for the Threat Intelligence Aggregator workflow."
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

# query_mitre_att_ck_mitre_att_ck_records

Retrieve mitre att ck records from MITRE ATT&CK for the Threat Intelligence Aggregator workflow.

- **Kind:** query
- **Source system:** [MITRE ATT&CK](/systems/mitre-att-ck.md)

## Inputs

- lookup_key
- date_range

## Outputs

- mitre_att_ck_records_records
- mitre_att_ck_records_summary

## Side Effects

- No mutation is declared by the spec for this tool.

## Idempotency

No idempotency key declared; no mutation is declared by the spec for this tool.

## Confirmation

No write confirmation policy is derivable from the spec.

## Permissions

No explicit permission scopes declared; source-system access is tied to [MITRE ATT&CK](/systems/mitre-att-ck.md).

## Failure Modes

No explicit failure modes are declared in the spec; rely on refusal/escalation policies for unsafe or incomplete evidence.

## Used By

- [threat_feed_ingestion](/workflow/threat-feed-ingestion.md)
- [threat_contextualization](/workflow/threat-contextualization.md)

## Evals

- [Run the Threat Intelligence Aggregator workflow for the current period. Cite the relevant source-system evidence and surface any escalations required.](/tests/threat-intelligence-aggregator-end-to-end.md)

## Evidence emitted

- source_system_record

## Required inputs

- lookup_key
- date_range

## Produces

- mitre_att_ck_records_records
- mitre_att_ck_records_summary

# Examples

```
query_mitre_att_ck_mitre_att_ck_records(lookup_key=<lookup_key>, date_range=<date_range>)
```

# Citations

- [MITRE ATT&CK](/systems/mitre-att-ck.md)
