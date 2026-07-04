---
type: Agent Tool
title: lookup_marketing_investment_governance_policy
description: "Look up Marketing Investment Governance Policy sections to justify executive escalation, budget reallocation thresholds, and quarterly review distribution rules."
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

# lookup_marketing_investment_governance_policy

Look up Marketing Investment Governance Policy sections to justify executive escalation, budget reallocation thresholds, and quarterly review distribution rules.

- **Kind:** evidence_lookup
- **Source system:** [Looker](/systems/looker.md)

## Inputs

- section_anchor

## Outputs

- policy_section
- approval_threshold

## Side Effects

- No mutation is declared by the spec for this tool.

## Idempotency

No idempotency key declared; no mutation is declared by the spec for this tool.

## Confirmation

No write confirmation policy is derivable from the spec.

## Permissions

No explicit permission scopes declared; source-system access is tied to [Looker](/systems/looker.md).

## Failure Modes

No explicit failure modes are declared in the spec; rely on refusal/escalation policies for unsafe or incomplete evidence.

## Used By

- [roi_narrative_generation](/workflow/roi-narrative-generation.md)
- [reporting_dashboards](/workflow/reporting-dashboards.md)

## Evals

_No eval scenario explicitly exercises this tool._

## Evidence emitted

- document_reference

## Required inputs

- section_anchor

## Produces

- policy_section
- approval_threshold

# Examples

```
lookup_marketing_investment_governance_policy(section_anchor=<section_anchor>)
```

# Citations

- [Looker](/systems/looker.md)
