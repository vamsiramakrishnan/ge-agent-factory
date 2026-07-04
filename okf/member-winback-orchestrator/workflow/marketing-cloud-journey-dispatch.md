---
type: Workflow Stage
title: Marketing Cloud Journey Dispatch
description: "Draft and route the gated win-back journey through Salesforce Marketing Cloud accounts, opportunities, and campaign_influence records (query_salesforce_marketing_cloud_accounts) so send timing and creative match the scored segment."
source_id: marketing_cloud_journey_dispatch
tags:
  - retail
  - okf
  - brd
timestamp: "2026-07-04T00:00:00.000Z"
---

# Marketing Cloud Journey Dispatch

Draft and route the gated win-back journey through Salesforce Marketing Cloud accounts, opportunities, and campaign_influence records (query_salesforce_marketing_cloud_accounts) so send timing and creative match the scored segment.

- **Mode:** sequential
- **Stage:** 4 of 5

## Tools

- [query_salesforce_marketing_cloud_accounts](/tools/query-salesforce-marketing-cloud-accounts.md)
- [query_segment_segment_records](/tools/query-segment-segment-records.md)
- [lookup_member_winback_orchestrator_execution_playbook](/tools/lookup-member-winback-orchestrator-execution-playbook.md)

Next: [Reactivation Confirmation & Nurture Audit](/workflow/reactivation-confirmation-nurture-audit.md)
