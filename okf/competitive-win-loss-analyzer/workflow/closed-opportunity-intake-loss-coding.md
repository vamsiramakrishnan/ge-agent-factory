---
type: Workflow Stage
title: "Closed-Opportunity Intake & Loss Coding"
description: "Pull closed-deal records from Salesforce Communications Cloud's subscriber_accounts, service_quotes, and order_captures, and code each closed opportunity with a loss driver drawn from CRM notes, call summaries, and quote history."
source_id: closed_opportunity_intake_loss_coding
tags:
  - telco
  - okf
  - brd
timestamp: "2026-07-04T00:00:00.000Z"
---

# Closed-Opportunity Intake & Loss Coding

Pull closed-deal records from Salesforce Communications Cloud's subscriber_accounts, service_quotes, and order_captures, and code each closed opportunity with a loss driver drawn from CRM notes, call summaries, and quote history.

- **Mode:** sequential
- **Stage:** 1 of 5

## Tools

- [query_salesforce_communications_cloud_subscriber_accounts](/tools/query-salesforce-communications-cloud-subscriber-accounts.md)
- [lookup_competitive_win_loss_analyzer_assurance_runbook](/tools/lookup-competitive-win-loss-analyzer-assurance-runbook.md)
- [action_salesforce_communications_cloud_recommend](/tools/action-salesforce-communications-cloud-recommend.md)

Next: [Competitive Pricing Signal Scan](/workflow/competitive-pricing-signal-scan.md)
