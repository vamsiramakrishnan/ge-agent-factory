---
type: Agent Tool
title: lookup_renewal_risk_requalification_agent_nonrenewal_notice_manual
description: "Look up sections of the Renewal Non-Renewal & Rate Action Notice Timing Manual to cite in narrative output and escalation rationale."
tags:
  - insurance
  - okf
  - brd
timestamp: "2026-07-04T00:00:00.000Z"
source_kind: generationSpec
source_path: behaviorContract.toolIntents
generation_status: generated
ge_status: generated
---

# lookup_renewal_risk_requalification_agent_nonrenewal_notice_manual

Look up sections of the Renewal Non-Renewal & Rate Action Notice Timing Manual to cite in narrative output and escalation rationale.

- **Kind:** evidence_lookup
- **Source system:** [Guidewire PolicyCenter](/systems/guidewire-policycenter.md)
- **API:** POST /api/guidewire_policycenter/route

## Inputs

- section_anchor

## Outputs

- document_section
- citation_anchor

## Side Effects

- May change Guidewire PolicyCenter state because the spec classifies it as evidence_lookup.

## Idempotency

Declared idempotency key: target_id+rationale.

## Confirmation

- [Confirmation policy — lookup_renewal_risk_requalification_agent_nonrenewal_notice_manual](/policies/confirmation-lookup-renewal-risk-requalification-agent-nonrenewal-notice-manual.md)

## Permissions

No explicit permission scopes declared; source-system access is tied to [Guidewire PolicyCenter](/systems/guidewire-policycenter.md).

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
lookup_renewal_risk_requalification_agent_nonrenewal_notice_manual(section_anchor=<section_anchor>)
```

# Citations

- [Guidewire PolicyCenter](/systems/guidewire-policycenter.md)
- [Confirmation policy — lookup_renewal_risk_requalification_agent_nonrenewal_notice_manual](/policies/confirmation-lookup-renewal-risk-requalification-agent-nonrenewal-notice-manual.md)
- [Idempotency policy — lookup_renewal_risk_requalification_agent_nonrenewal_notice_manual](/policies/idempotency-lookup-renewal-risk-requalification-agent-nonrenewal-notice-manual.md)
