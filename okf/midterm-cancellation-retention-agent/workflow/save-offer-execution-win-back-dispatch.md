---
type: Workflow Stage
title: "Save Offer Execution & Win-Back Dispatch"
description: "Execute the approved save offer via action_guidewire_policycenter_generate against Guidewire PolicyCenter with a full audit trail, notify the Retention Specialist directly for high-value accounts, and trigger a Salesforce Marketing Cloud campaign_influence win-back journey for the remainder."
source_id: save_offer_execution_win_back_dispatch
tags:
  - insurance
  - okf
  - brd
timestamp: "2026-07-04T00:00:00.000Z"
---

# Save Offer Execution & Win-Back Dispatch

Execute the approved save offer via action_guidewire_policycenter_generate against Guidewire PolicyCenter with a full audit trail, notify the Retention Specialist directly for high-value accounts, and trigger a Salesforce Marketing Cloud campaign_influence win-back journey for the remainder.

- **Mode:** sequential
- **Stage:** 4 of 4

## Tools

- [query_guidewire_policycenter_policies](/tools/query-guidewire-policycenter-policies.md)
- [query_salesforce_marketing_cloud_accounts](/tools/query-salesforce-marketing-cloud-accounts.md)
- [lookup_midterm_cancellation_retention_agent_authority_guide](/tools/lookup-midterm-cancellation-retention-agent-authority-guide.md)
- [action_guidewire_policycenter_generate](/tools/action-guidewire-policycenter-generate.md)
