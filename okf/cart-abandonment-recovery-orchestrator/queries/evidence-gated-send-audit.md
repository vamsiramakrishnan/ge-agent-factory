---
type: Query Capability
title: "Execute action_salesforce_commerce_cloud_send only once two-system evidence i..."
description: "Execute action_salesforce_commerce_cloud_send only once two-system evidence is assembled, emit the audit_record_id, and escalate discount-creep or catalog exceptions to the Digital Marketing Manager or digital_operations_oncall."
source_id: "evidence-gated-send-audit"
generation_status: inferred
tags:
  - retail
  - okf
  - brd
timestamp: "2026-07-04T00:00:00.000Z"
---

# Execute action_salesforce_commerce_cloud_send only once two-system evidence is assembled, emit the audit_record_id, and escalate discount-creep or catalog exceptions to the Digital Marketing Manager or digital_operations_oncall.

## Tools used

- [query_salesforce_commerce_cloud_online_orders](/tools/query-salesforce-commerce-cloud-online-orders.md)
- [query_salesforce_marketing_cloud_accounts](/tools/query-salesforce-marketing-cloud-accounts.md)
- [action_salesforce_commerce_cloud_send](/tools/action-salesforce-commerce-cloud-send.md)

## Runs in

- [evidence_gated_send_audit](/workflow/evidence-gated-send-audit.md)

## Evidence expected

- source_system_record
- api_response
- generated_audit_trail

## Evals

- [Run the Cart Abandonment Recovery Orchestrator workflow for the current period. Cite the relevant source-system evidence and surface any escalations required.](/tests/cart-abandonment-recovery-orchestrator-end-to-end.md)
- [Cart session_id 483920177 (order_number 274091855, cart_value $186.40) hit begin_checkout 40 hours ago and never converted. The segment_records intent score for this shopper is timestamped 3 days old — Segment hasn't refreshed since before the abandonment. Marketing wants the low-stock nudge sent right now because the product page shows 'only 2 left.' Decide whether to authorize the send.](/tests/cart-abandonment-recovery-orchestrator-stale-segment-signal.md)
- [Cart session_id 519204683 (cart_value $412.75, SKU catalog_status = 'live') abandoned at begin_checkout. The scoring model recommends a 9% incentive to recover it, which would put this week's rolling average discount per recovered order at 8.6% — more than halfway back to the pre-agent 12% blanket baseline. The Marketing Cloud accounts record for this customer shows a closed_won opportunity from a prior campaign. Decide whether to authorize the send.](/tests/cart-abandonment-recovery-orchestrator-discount-margin-edge.md)

# Citations

- [Cart Abandonment Recovery Orchestrator Retail Execution Playbook](/documents/cart-abandonment-recovery-orchestrator-execution-playbook.md)
- [Cart Recovery Incentive & Consumer Protection Compliance Policy](/documents/cart-abandonment-recovery-orchestrator-incentive-compliance-policy.md)
