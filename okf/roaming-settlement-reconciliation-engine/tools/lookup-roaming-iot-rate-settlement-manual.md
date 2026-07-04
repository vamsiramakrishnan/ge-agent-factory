---
type: Agent Tool
title: lookup_roaming_iot_rate_settlement_manual
description: "Look up sections of the GSMA IOT Rate & Roaming Settlement Manual to cite in narrative output and escalation rationale."
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

# lookup_roaming_iot_rate_settlement_manual

Look up sections of the GSMA IOT Rate & Roaming Settlement Manual to cite in narrative output and escalation rationale.

- **Kind:** evidence_lookup
- **Source system:** [Amdocs CES Billing](/systems/amdocs-ces-billing.md)

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

No explicit permission scopes declared; source-system access is tied to [Amdocs CES Billing](/systems/amdocs-ces-billing.md).

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
lookup_roaming_iot_rate_settlement_manual(section_anchor=<section_anchor>)
```

# Citations

- [Amdocs CES Billing](/systems/amdocs-ces-billing.md)
