---
type: Agent Tool
title: lookup_gtm_launch_planner_playbook
description: "Look up sections of the GTM Launch Planner Playbook to cite in narrative output, escalation rationale, and audit evidence."
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

# lookup_gtm_launch_planner_playbook

Look up sections of the GTM Launch Planner Playbook to cite in narrative output, escalation rationale, and audit evidence.

- **Kind:** evidence_lookup
- **Source system:** [Asana](/systems/asana.md)

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

No explicit permission scopes declared; source-system access is tied to [Asana](/systems/asana.md).

## Failure Modes

No explicit failure modes are declared in the spec; rely on refusal/escalation policies for unsafe or incomplete evidence.

## Used By

- [requirements_parsing](/workflow/requirements-parsing.md)
- [historical_benchmarking](/workflow/historical-benchmarking.md)
- [plan_messaging_generation](/workflow/plan-messaging-generation.md)
- [orchestration_setup](/workflow/orchestration-setup.md)

## Evals

- [Run the GTM Launch Planner workflow for the current period. Cite the relevant source-system evidence and surface any escalations required.](/tests/gtm-launch-planner-end-to-end.md)

## Evidence emitted

- document_reference

## Required inputs

- section_anchor

## Produces

- document_section
- citation_anchor

# Examples

```
lookup_gtm_launch_planner_playbook(section_anchor=<section_anchor>)
```

# Citations

- [Asana](/systems/asana.md)
