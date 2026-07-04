---
type: Agent Tool
title: query_banking_3_banking_3_records
description: Retrieve banking 3 records from BANKING 3 for the Commercial Credit Memo Drafting Agent workflow.
tags:
  - banking
  - okf
  - brd
timestamp: "2026-07-04T00:00:00.000Z"
source_kind: generationSpec
source_path: behaviorContract.toolIntents
generation_status: generated
ge_status: generated
---

# query_banking_3_banking_3_records

Retrieve banking 3 records from BANKING 3 for the Commercial Credit Memo Drafting Agent workflow.

- **Kind:** query
- **Source system:** [BANKING 3](/systems/banking-3.md)

## Inputs

- lookup_key
- date_range

## Outputs

- banking_3_records_records
- banking_3_records_summary

## Side Effects

- No mutation is declared by the spec for this tool.

## Idempotency

No idempotency key declared; no mutation is declared by the spec for this tool.

## Confirmation

No write confirmation policy is derivable from the spec.

## Permissions

No explicit permission scopes declared; source-system access is tied to [BANKING 3](/systems/banking-3.md).

## Failure Modes

No explicit failure modes are declared in the spec; rely on refusal/escalation policies for unsafe or incomplete evidence.

## Used By

- [deal_intake_financial_spread_assembly](/workflow/deal-intake-financial-spread-assembly.md)
- [global_exposure_covenant_aggregation](/workflow/global-exposure-covenant-aggregation.md)
- [policy_authority_threshold_screening](/workflow/policy-authority-threshold-screening.md)
- [exception_escalation_committee_routing](/workflow/exception-escalation-committee-routing.md)

## Evals

- [Run the Commercial Credit Memo Drafting Agent workflow for the current period. Cite the relevant source-system evidence and surface any escalations required.](/tests/commercial-credit-memo-drafting-agent-end-to-end.md)
- [Meridian Fabricators Inc. already carries $7.4M in committed exposure per its existing loan_applications and credit_memos records; new application 30184793 requests an additional $2.8M revolver, which would bring aggregate obligor exposure to $10.2M -- just above the $10,000,000 house limit. Also check covenant_records for covenant_id 612044 (compliance_status breached, next_test_date 2026-05-15) on the existing facility, which has not cured within 30 days. Determine whether the new application can be sent through action_ncino_loan_origination_generate.](/tests/commercial-credit-memo-drafting-agent-house-limit-covenant-edge.md)

## Evidence emitted

- source_system_record

## Required inputs

- lookup_key
- date_range

## Produces

- banking_3_records_records
- banking_3_records_summary

# Examples

```
query_banking_3_banking_3_records(lookup_key=<lookup_key>, date_range=<date_range>)
```

# Citations

- [BANKING 3](/systems/banking-3.md)
