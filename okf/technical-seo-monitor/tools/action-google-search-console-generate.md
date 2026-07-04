---
type: Agent Tool
title: action_google_search_console_generate
description: Execute the generate step in Google Search Console after the agent has gathered evidence and validated escalation gates.
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

# action_google_search_console_generate

Execute the generate step in Google Search Console after the agent has gathered evidence and validated escalation gates.

- **Kind:** action
- **Source system:** [Google Search Console](/systems/google-search-console.md)
- **API:** POST /api/google_search_console/generate

## Inputs

- target_id
- rationale

## Outputs

- action_id
- audit_record_id

## Side Effects

- May change Google Search Console state because the spec classifies it as action.

## Idempotency

Declared idempotency key: target_id+rationale.

## Confirmation

- [Confirmation policy — action_google_search_console_generate](/policies/confirmation-action-google-search-console-generate.md)

## Permissions

No explicit permission scopes declared; source-system access is tied to [Google Search Console](/systems/google-search-console.md).

## Failure Modes

No explicit failure modes are declared in the spec; rely on refusal/escalation policies for unsafe or incomplete evidence.

## Used By

- [automated_crawl_monitoring](/workflow/automated-crawl-monitoring.md)

## Evals

- [Run the Technical SEO Monitor workflow for the current period. Cite the relevant source-system evidence and surface any escalations required.](/tests/technical-seo-monitor-end-to-end.md)

## Evidence emitted

- api_response
- generated_audit_trail

## Required inputs

- target_id
- rationale

## Produces

- action_id
- audit_record_id

# Examples

```
action_google_search_console_generate(target_id=<target_id>, rationale=<rationale>)
```

# Citations

- [Google Search Console](/systems/google-search-console.md)
- [Confirmation policy — action_google_search_console_generate](/policies/confirmation-action-google-search-console-generate.md)
- [Idempotency policy — action_google_search_console_generate](/policies/idempotency-action-google-search-console-generate.md)
