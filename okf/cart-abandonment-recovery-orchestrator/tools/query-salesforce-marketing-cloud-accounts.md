---
type: Agent Tool
title: query_salesforce_marketing_cloud_accounts
description: Retrieve accounts from Salesforce Marketing Cloud for the Cart Abandonment Recovery Orchestrator workflow.
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

Retrieve accounts from Salesforce Marketing Cloud for the Cart Abandonment Recovery Orchestrator workflow.

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

- [cart_session_signal_capture](/workflow/cart-session-signal-capture.md)
- [marketing_cloud_journey_orchestration_suppression](/workflow/marketing-cloud-journey-orchestration-suppression.md)
- [evidence_gated_send_audit](/workflow/evidence-gated-send-audit.md)

## Evals

- [Run the Cart Abandonment Recovery Orchestrator workflow for the current period. Cite the relevant source-system evidence and surface any escalations required.](/tests/cart-abandonment-recovery-orchestrator-end-to-end.md)
- [Cart session_id 519204683 (cart_value $412.75, SKU catalog_status = 'live') abandoned at begin_checkout. The scoring model recommends a 9% incentive to recover it, which would put this week's rolling average discount per recovered order at 8.6% — more than halfway back to the pre-agent 12% blanket baseline. The Marketing Cloud accounts record for this customer shows a closed_won opportunity from a prior campaign. Decide whether to authorize the send.](/tests/cart-abandonment-recovery-orchestrator-discount-margin-edge.md)

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
