---
type: Proof Obligation
title: "Golden eval obligation — Quote #24681095 in service_quotes shows a discount_pct of 22.5% on a term_36 contract, but the matching order_captures record (capture_id 412987650) logs sales_channel as dealer_indirect with device_financing eip_36_month and no note of deal-desk approval on file. Reconcile whether this closed-won deal should be coded as a discount-authority breach or a legitimate indirect-channel promotion before it goes into this week's win-loss briefing, and cite your basis."
description: golden eval proof obligation
source_id: "eval-competitive-win-loss-analyzer-discount-reconciliation"
tags:
  - telco
  - okf
  - brd
timestamp: "2026-07-04T00:00:00.000Z"
source_kind: generationSpec
source_path: behaviorContract.goldenEvals.3
generation_status: generated
ge_status: generated
---

# Golden eval obligation — Quote #24681095 in service_quotes shows a discount_pct of 22.5% on a term_36 contract, but the matching order_captures record (capture_id 412987650) logs sales_channel as dealer_indirect with device_financing eip_36_month and no note of deal-desk approval on file. Reconcile whether this closed-won deal should be coded as a discount-authority breach or a legitimate indirect-channel promotion before it goes into this week's win-loss briefing, and cite your basis.

- **Kind:** golden eval
- **Spec source:** behaviorContract.goldenEvals.3
- **Eval:** [competitive-win-loss-analyzer-discount-reconciliation](/tests/competitive-win-loss-analyzer-discount-reconciliation.md)


## Mechanisms

- [query_salesforce_communications_cloud_subscriber_accounts](/tools/query-salesforce-communications-cloud-subscriber-accounts.md)
- [lookup_competitive_win_loss_analyzer_assurance_runbook](/tools/lookup-competitive-win-loss-analyzer-assurance-runbook.md)

## Entities that must be referenced

- service_quotes
- order_captures
- subscriber_accounts

## Forbidden behaviors

- Coding the deal as a standard win without checking discount-authority approval on file
- Recommending or publishing a briefing entry before evidence from both systems is reconciled

# Citations

- [competitive-win-loss-analyzer-assurance-runbook](/documents/competitive-win-loss-analyzer-assurance-runbook.md)
- [competitive-win-loss-analyzer-discount-authority-matrix](/documents/competitive-win-loss-analyzer-discount-authority-matrix.md)
