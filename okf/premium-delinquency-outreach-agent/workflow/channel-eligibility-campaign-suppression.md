---
type: Workflow Stage
title: "Channel Eligibility & Campaign Suppression"
description: "Cross-reference the scored accounts against Salesforce Marketing Cloud accounts, opportunities, and campaign_influence records to select the channel most likely to reach the policyholder and suppress accounts already inside an active, engaged dunning or card-update campaign."
source_id: channel_eligibility_campaign_suppression
tags:
  - insurance
  - okf
  - brd
timestamp: "2026-07-04T00:00:00.000Z"
---

# Channel Eligibility & Campaign Suppression

Cross-reference the scored accounts against Salesforce Marketing Cloud accounts, opportunities, and campaign_influence records to select the channel most likely to reach the policyholder and suppress accounts already inside an active, engaged dunning or card-update campaign.

- **Mode:** sequential
- **Stage:** 3 of 5

## Tools

- [query_guidewire_billingcenter_billing_accounts](/tools/query-guidewire-billingcenter-billing-accounts.md)
- [query_salesforce_marketing_cloud_accounts](/tools/query-salesforce-marketing-cloud-accounts.md)

Next: [Authority & Notice-Period Gate](/workflow/authority-notice-period-gate.md)
