---
type: Agent Tool
title: lookup_survey_design_communication_agent_policy_handbook
description: "Look up sections of the Survey Design & Communication Agent Policy Handbook to cite in narrative output, escalation rationale, and audit evidence."
tags:
  - hr
  - okf
  - brd
timestamp: "2026-07-01T00:00:00.000Z"
source_kind: generationSpec
source_path: behaviorContract.toolIntents
generation_status: generated
ge_status: generated
---

# lookup_survey_design_communication_agent_policy_handbook

Look up sections of the Survey Design & Communication Agent Policy Handbook to cite in narrative output, escalation rationale, and audit evidence.

- **Kind:** evidence_lookup
- **Source system:** [Qualtrics](/systems/qualtrics.md)

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

No explicit permission scopes declared; source-system access is tied to [Qualtrics](/systems/qualtrics.md).

## Failure Modes

No explicit failure modes are declared in the spec; rely on refusal/escalation policies for unsafe or incomplete evidence.

## Used By

- [theme_analysis](/workflow/theme-analysis.md)
- [survey_design](/workflow/survey-design.md)
- [communication_campaign](/workflow/communication-campaign.md)
- [distribution_monitoring](/workflow/distribution-monitoring.md)

## Evals

- [Run the Survey Design & Communication Agent workflow for the current period. Cite the relevant source-system evidence and surface any escalations required.](/tests/survey-design-communication-agent-end-to-end.md)

## Evidence emitted

- document_reference

## Required inputs

- section_anchor

## Produces

- document_section
- citation_anchor

# Examples

```
lookup_survey_design_communication_agent_policy_handbook(section_anchor=<section_anchor>)
```

# Citations

- [Qualtrics](/systems/qualtrics.md)
