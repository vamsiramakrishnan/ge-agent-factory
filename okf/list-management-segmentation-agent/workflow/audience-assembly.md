---
type: Workflow Stage
title: Audience Assembly
description: "Build audience list by querying CRM, MAP, and intent data. Apply suppression rules (opt-outs, competitors, existing customers). Calculate overlap with concurrent campaigns."
source_id: audience_assembly
tags:
  - marketing
  - okf
  - brd
timestamp: "2026-07-01T00:00:00.000Z"
---

# Audience Assembly

Build audience list by querying CRM, MAP, and intent data. Apply suppression rules (opt-outs, competitors, existing customers). Calculate overlap with concurrent campaigns.

- **Mode:** sequential
- **Stage:** 2 of 4

## Tools

- [query_marketo_campaigns](/tools/query-marketo-campaigns.md)
- [query_salesforce_crm_accounts](/tools/query-salesforce-crm-accounts.md)
- [lookup_list_management_segmentation_agent_playbook](/tools/lookup-list-management-segmentation-agent-playbook.md)

Next: [Quality Scoring](/workflow/quality-scoring.md)
