---
type: Agent Tool
title: lookup_martech_stack_health_monitor_playbook
description: "Look up sections of the MarTech Stack Health Monitor Playbook to cite in narrative output, escalation rationale, and audit evidence."
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

# lookup_martech_stack_health_monitor_playbook

Look up sections of the MarTech Stack Health Monitor Playbook to cite in narrative output, escalation rationale, and audit evidence.

- **Kind:** evidence_lookup
- **Source system:** [Google Analytics 4](/systems/google-analytics-4.md)

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

No explicit permission scopes declared; source-system access is tied to [Google Analytics 4](/systems/google-analytics-4.md).

## Failure Modes

No explicit failure modes are declared in the spec; rely on refusal/escalation policies for unsafe or incomplete evidence.

## Used By

- [health_polling](/workflow/health-polling.md)
- [root_cause_diagnosis](/workflow/root-cause-diagnosis.md)
- [alerting_reporting](/workflow/alerting-reporting.md)

## Evals

- [Run the MarTech Stack Health Monitor workflow for the current period. Cite the relevant source-system evidence and surface any escalations required.](/tests/martech-stack-health-monitor-end-to-end.md)

## Evidence emitted

- document_reference

## Required inputs

- section_anchor

## Produces

- document_section
- citation_anchor

# Examples

```
lookup_martech_stack_health_monitor_playbook(section_anchor=<section_anchor>)
```

# Citations

- [Google Analytics 4](/systems/google-analytics-4.md)
