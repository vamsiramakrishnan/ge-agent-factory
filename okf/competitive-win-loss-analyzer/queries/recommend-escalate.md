---
type: Query Capability
title: Execute action_salesforce_communications_cloud_recommend to publish the recom...
description: "Execute action_salesforce_communications_cloud_recommend to publish the recommended counter-play with a full audit trail, routing discount-authority, credit, or enterprise-threshold breaches to the Sales Operations Analyst, sales_pricing_desk, or enterprise_deal_desk."
source_id: "recommend-escalate"
generation_status: inferred
tags:
  - telco
  - okf
  - brd
timestamp: "2026-07-04T00:00:00.000Z"
---

# Execute action_salesforce_communications_cloud_recommend to publish the recommended counter-play with a full audit trail, routing discount-authority, credit, or enterprise-threshold breaches to the Sales Operations Analyst, sales_pricing_desk, or enterprise_deal_desk.

## Tools used

- [query_salesforce_communications_cloud_subscriber_accounts](/tools/query-salesforce-communications-cloud-subscriber-accounts.md)
- [action_salesforce_communications_cloud_recommend](/tools/action-salesforce-communications-cloud-recommend.md)

## Runs in

- [recommend_escalate](/workflow/recommend-escalate.md)

## Evidence expected

- source_system_record
- api_response
- generated_audit_trail

## Evals

- [Run the Competitive Win-Loss Analyzer workflow for the current period. Cite the relevant source-system evidence and surface any escalations required.](/tests/competitive-win-loss-analyzer-end-to-end.md)
- [Quote #24681095 in service_quotes shows a discount_pct of 22.5% on a term_36 contract, but the matching order_captures record (capture_id 412987650) logs sales_channel as dealer_indirect with device_financing eip_36_month and no note of deal-desk approval on file. Reconcile whether this closed-won deal should be coded as a discount-authority breach or a legitimate indirect-channel promotion before it goes into this week's win-loss briefing, and cite your basis.](/tests/competitive-win-loss-analyzer-discount-reconciliation.md)

# Citations

- [Competitive Win-Loss Analyzer Service Assurance Runbook](/documents/competitive-win-loss-analyzer-assurance-runbook.md)
- [Consumer & SMB Discount Authority Matrix](/documents/competitive-win-loss-analyzer-discount-authority-matrix.md)
