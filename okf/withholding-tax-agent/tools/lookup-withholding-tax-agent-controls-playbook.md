---
type: Agent Tool
title: lookup_withholding_tax_agent_controls_playbook
description: "Look up sections of the Withholding Tax Agent Controls Playbook to cite in narrative output, escalation rationale, and audit evidence."
tags:
  - finance
  - okf
  - brd
timestamp: "2026-07-01T00:00:00.000Z"
source_kind: generationSpec
source_path: behaviorContract.toolIntents
generation_status: generated
ge_status: generated
---

# lookup_withholding_tax_agent_controls_playbook

Look up sections of the Withholding Tax Agent Controls Playbook to cite in narrative output, escalation rationale, and audit evidence.

- **Kind:** evidence_lookup
- **Source system:** [BigQuery](/systems/bigquery.md)

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

No explicit permission scopes declared; source-system access is tied to [BigQuery](/systems/bigquery.md).

## Failure Modes

No explicit failure modes are declared in the spec; rely on refusal/escalation policies for unsafe or incomplete evidence.

## Used By

- [rate_determination](/workflow/rate-determination.md)
- [treaty_provision_interpretation](/workflow/treaty-provision-interpretation.md)
- [application_reporting](/workflow/application-reporting.md)

## Evals

- [Run the Withholding Tax Agent workflow for the current period. Cite the relevant source-system evidence and surface any escalations required.](/tests/withholding-tax-agent-end-to-end.md)

## Evidence emitted

- document_reference

## Required inputs

- section_anchor

## Produces

- document_section
- citation_anchor

# Examples

```
lookup_withholding_tax_agent_controls_playbook(section_anchor=<section_anchor>)
```

# Citations

- [BigQuery](/systems/bigquery.md)
