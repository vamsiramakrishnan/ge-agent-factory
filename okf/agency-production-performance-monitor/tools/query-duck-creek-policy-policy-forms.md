---
type: Agent Tool
title: query_duck_creek_policy_policy_forms
description: Retrieve policy forms from Duck Creek Policy for the Agency Production Performance Monitor workflow.
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

# query_duck_creek_policy_policy_forms

Retrieve policy forms from Duck Creek Policy for the Agency Production Performance Monitor workflow.

- **Kind:** query
- **Source system:** [Duck Creek Policy](/systems/duck-creek-policy.md)

## Inputs

- form_id
- form_code
- date_range

## Outputs

- policy_forms_records
- policy_forms_summary

## Side Effects

- No mutation is declared by the spec for this tool.

## Idempotency

No idempotency key declared; no mutation is declared by the spec for this tool.

## Confirmation

No write confirmation policy is derivable from the spec.

## Permissions

No explicit permission scopes declared; source-system access is tied to [Duck Creek Policy](/systems/duck-creek-policy.md).

## Failure Modes

No explicit failure modes are declared in the spec; rely on refusal/escalation policies for unsafe or incomplete evidence.

## Used By

- [agency_book_scan_baseline_pull](/workflow/agency-book-scan-baseline-pull.md)
- [recommend_re_engagement_execution](/workflow/recommend-re-engagement-execution.md)

## Evals

- [Run the Agency Production Performance Monitor workflow for the current period. Cite the relevant source-system evidence and surface any escalations required.](/tests/agency-production-performance-monitor-end-to-end.md)
- [Agency 'Meridian Coastal Insurance Group' (Salesforce account id ACC-40217) shows 3 opportunities marked closed_won in the last 30 days in Salesforce Marketing Cloud, but Duck Creek Policy rating_worksheets for the same agency's book show final_developed_premium down 18% quarter-over-quarter and quote_number volume down 22%. Reconcile the conflict and tell me whether to trigger a re-engagement campaign for this agency.](/tests/agency-production-performance-monitor-conflicting-signals.md)

## Evidence emitted

- source_system_record

## Required inputs

- form_id
- form_code
- date_range

## Produces

- policy_forms_records
- policy_forms_summary

# Examples

```
query_duck_creek_policy_policy_forms(form_id=<form_id>, form_code=<form_code>, date_range=<date_range>)
```

# Citations

- [Duck Creek Policy](/systems/duck-creek-policy.md)
