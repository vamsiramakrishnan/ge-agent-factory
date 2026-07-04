---
type: Agent Tool
title: query_docusign_envelopes
description: Retrieve envelopes from DocuSign for the Wealth Client Onboarding Orchestrator workflow.
tags:
  - banking
  - okf
  - brd
timestamp: "2026-07-04T00:00:00.000Z"
source_kind: generationSpec
source_path: behaviorContract.toolIntents
generation_status: generated
ge_status: generated
---

# query_docusign_envelopes

Retrieve envelopes from DocuSign for the Wealth Client Onboarding Orchestrator workflow.

- **Kind:** query
- **Source system:** [DocuSign](/systems/docusign.md)

## Inputs

- lookup_key
- date_range

## Outputs

- envelopes_records
- envelopes_summary

## Side Effects

- No mutation is declared by the spec for this tool.

## Idempotency

No idempotency key declared; no mutation is declared by the spec for this tool.

## Confirmation

No write confirmation policy is derivable from the spec.

## Permissions

No explicit permission scopes declared; source-system access is tied to [DocuSign](/systems/docusign.md).

## Failure Modes

No explicit failure modes are declared in the spec; rely on refusal/escalation policies for unsafe or incomplete evidence.

## Used By

- [retrieve_records](/workflow/retrieve-records.md)

## Evals

- [Run the Wealth Client Onboarding Orchestrator workflow for the current period. Cite the relevant source-system evidence and surface any escalations required.](/tests/wealth-client-onboarding-orchestrator-end-to-end.md)

## Evidence emitted

- source_system_record

## Required inputs

- lookup_key
- date_range

## Produces

- envelopes_records
- envelopes_summary

# Examples

```
query_docusign_envelopes(lookup_key=<lookup_key>, date_range=<date_range>)
```

# Citations

- [DocuSign](/systems/docusign.md)
