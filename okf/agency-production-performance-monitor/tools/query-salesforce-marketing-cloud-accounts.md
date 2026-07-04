---
type: Agent Tool
title: query_salesforce_marketing_cloud_accounts
description: Retrieve accounts from Salesforce Marketing Cloud for the Agency Production Performance Monitor workflow.
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

# query_salesforce_marketing_cloud_accounts

Retrieve accounts from Salesforce Marketing Cloud for the Agency Production Performance Monitor workflow.

- **Kind:** query
- **Source system:** [Salesforce Marketing Cloud](/systems/salesforce-marketing-cloud.md)

## Inputs

- lookup_key
- date_range

## Outputs

- accounts_records
- accounts_summary

## Side Effects

- No mutation is declared by the spec for this tool.

## Idempotency

No idempotency key declared; no mutation is declared by the spec for this tool.

## Confirmation

No write confirmation policy is derivable from the spec.

## Permissions

No explicit permission scopes declared; source-system access is tied to [Salesforce Marketing Cloud](/systems/salesforce-marketing-cloud.md).

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

- lookup_key
- date_range

## Produces

- accounts_records
- accounts_summary

# Examples

```
query_salesforce_marketing_cloud_accounts(lookup_key=<lookup_key>, date_range=<date_range>)
```

# Citations

- [Salesforce Marketing Cloud](/systems/salesforce-marketing-cloud.md)
