---
type: Agent Tool
title: query_telco_3_telco_3_records
description: Retrieve telco 3 records from TELCO 3 for the Site Serviceability Qualification Agent workflow.
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

# query_telco_3_telco_3_records

Retrieve telco 3 records from TELCO 3 for the Site Serviceability Qualification Agent workflow.

- **Kind:** query
- **Source system:** [TELCO 3](/systems/telco-3.md)

## Inputs

- lookup_key
- date_range

## Outputs

- telco_3_records_records
- telco_3_records_summary

## Side Effects

- No mutation is declared by the spec for this tool.

## Idempotency

No idempotency key declared; no mutation is declared by the spec for this tool.

## Confirmation

No write confirmation policy is derivable from the spec.

## Permissions

No explicit permission scopes declared; source-system access is tied to [TELCO 3](/systems/telco-3.md).

## Failure Modes

No explicit failure modes are declared in the spec; rely on refusal/escalation policies for unsafe or incomplete evidence.

## Used By

- [fiber_route_lit_building_coverage_lookup](/workflow/fiber-route-lit-building-coverage-lookup.md)

## Evals

- [Run the Site Serviceability Qualification Agent workflow for the current period. Cite the relevant source-system evidence and surface any escalations required.](/tests/site-serviceability-qualification-agent-end-to-end.md)
- [Service quote Q24817635 for business account 'Meridian Health Partners' (enterprise_dia_100m bundle, 36-month term) shows serviceability_confirmed = true and mrr_usd of $4,850 in Salesforce Communications Cloud, but the TELCO 3 facilities record for that address (telco_3_records source_record_id 88214) is still status = pending with no lit-building confirmation logged. Reconcile this before the deal moves to order capture, and tell me if we can commit a fiber install date.](/tests/site-serviceability-qualification-agent-conflicting-serviceability-flag.md)
- [Multi-site qualification request for subscriber account 3124589901: the BigQuery analytics_events refresh for that region shows computed_at of 2026-07-01, more than 24 hours stale against today's 2026-07-04 run, and the TELCO 3 facilities record (telco_3_records source_record_id 91027) puts the site at approximately 480 feet from the nearest lit fiber route — right at the near-net lateral threshold. Can we qualify this site as on-net fiber today, and if not, what access technology and cost/interval should we quote?](/tests/site-serviceability-qualification-agent-stale-evidence-near-net-edge.md)

## Evidence emitted

- source_system_record

## Required inputs

- lookup_key
- date_range

## Produces

- telco_3_records_records
- telco_3_records_summary

# Examples

```
query_telco_3_telco_3_records(lookup_key=<lookup_key>, date_range=<date_range>)
```

# Citations

- [TELCO 3](/systems/telco-3.md)
