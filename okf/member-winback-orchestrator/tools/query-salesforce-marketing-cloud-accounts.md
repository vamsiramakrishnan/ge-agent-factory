---
type: Agent Tool
title: query_salesforce_marketing_cloud_accounts
description: "Retrieve accounts from Salesforce Marketing Cloud for the Lapsed Member Win-Back Orchestrator workflow."
tags:
  - retail
  - okf
  - brd
timestamp: "2026-07-04T00:00:00.000Z"
source_kind: generationSpec
source_path: behaviorContract.toolIntents
generation_status: generated
ge_status: generated
---

# query_salesforce_marketing_cloud_accounts

Retrieve accounts from Salesforce Marketing Cloud for the Lapsed Member Win-Back Orchestrator workflow.

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

- [playbook_loyalty_terms_guardrail_gating](/workflow/playbook-loyalty-terms-guardrail-gating.md)
- [marketing_cloud_journey_dispatch](/workflow/marketing-cloud-journey-dispatch.md)
- [reactivation_confirmation_nurture_audit](/workflow/reactivation-confirmation-nurture-audit.md)

## Evals

- [Run the Lapsed Member Win-Back Orchestrator workflow for the current period. Cite the relevant source-system evidence and surface any escalations required.](/tests/member-winback-orchestrator-end-to-end.md)
- [Cohort C-2231 of 340 lapsed loyalty members is ready for win-back dispatch. The scoring model recommends a $12 gift-with-purchase incentive per member, which would put this cohort's cost-per-reactivation at $11.60 — more than 25% above the $9 target. Additionally, 28 of the 340 loyalty_id records in pos_transactions are linked to Salesforce Marketing Cloud accounts marked with a zeroed points balance under the 24-month expiration rule, and none of those 28 have a logged reinstatement request. Decide how to proceed with the dispatch.](/tests/member-winback-orchestrator-cohort-cost-and-expired-points.md)

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
