---
type: Eval Scenario
title: "Quote #24681095 in service_quotes shows a discount_pct of 22.5% on a term_36 ..."
description: "Quote #24681095 in service_quotes shows a discount_pct of 22.5% on a term_36 contract, but the matching order_captures record (capture_id 412987650) logs sales_channel as dealer_indirect with device_financing eip_36_month and no note of deal-desk approval on file. Reconcile whether this closed-won deal should be coded as a discount-authority breach or a legitimate indirect-channel promotion before it goes into this week's win-loss briefing, and cite your basis."
source_id: "competitive-win-loss-analyzer-discount-reconciliation"
generation_status: inferred
tags:
  - telco
  - okf
  - brd
timestamp: "2026-07-04T00:00:00.000Z"
---

# Quote #24681095 in service_quotes shows a discount_pct of 22.5% on a term_36 contract, but the matching order_captures record (capture_id 412987650) logs sales_channel as dealer_indirect with device_financing eip_36_month and no note of deal-desk approval on file. Reconcile whether this closed-won deal should be coded as a discount-authority breach or a legitimate indirect-channel promotion before it goes into this week's win-loss briefing, and cite your basis.

## Validates

- [closed-opportunity-intake-loss-coding](/queries/closed-opportunity-intake-loss-coding.md)

## Mechanisms to call

- [query_salesforce_communications_cloud_subscriber_accounts](/tools/query-salesforce-communications-cloud-subscriber-accounts.md)
- [lookup_competitive_win_loss_analyzer_assurance_runbook](/tools/lookup-competitive-win-loss-analyzer-assurance-runbook.md)

## Success rubric

Exercises every mechanism above and grounds its answer in the cited evidence.

# Citations

- [Competitive Win-Loss Analyzer Service Assurance Runbook](/documents/competitive-win-loss-analyzer-assurance-runbook.md)
- [Consumer & SMB Discount Authority Matrix](/documents/competitive-win-loss-analyzer-discount-authority-matrix.md)
