---
type: Workflow Stage
title: Treasury Briefing Generation
description: "Gemini generates narrative: 'Global cash is $234M across 45 accounts in 12 currencies. EUR balances elevated post-quarter -- recommend sweeping $15M to USD concentration account to fund next week's bond payment.' Actionable, not just informational."
source_id: treasury_briefing_generation
tags:
  - finance
  - okf
  - brd
timestamp: "2026-07-01T00:00:00.000Z"
---

# Treasury Briefing Generation

Gemini generates narrative: 'Global cash is $234M across 45 accounts in 12 currencies. EUR balances elevated post-quarter -- recommend sweeping $15M to USD concentration account to fund next week's bond payment.' Actionable, not just informational.

- **Mode:** sequential
- **Stage:** 3 of 4

## Tools

- [query_kyriba_cash_positions](/tools/query-kyriba-cash-positions.md)
- [action_kyriba_recommend](/tools/action-kyriba-recommend.md)

Next: [Dashboard & Alert Delivery](/workflow/dashboard-alert-delivery.md)
