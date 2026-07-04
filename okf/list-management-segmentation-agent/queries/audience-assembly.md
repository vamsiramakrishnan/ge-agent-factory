---
type: Query Capability
title: "Build audience list by querying CRM, MAP, and intent data. Apply suppression ..."
description: "Build audience list by querying CRM, MAP, and intent data. Apply suppression rules (opt-outs, competitors, existing customers). Calculate overlap with concurrent campaigns."
source_id: "audience-assembly"
generation_status: inferred
tags:
  - marketing
  - okf
  - brd
timestamp: "2026-07-01T00:00:00.000Z"
---

# Build audience list by querying CRM, MAP, and intent data. Apply suppression rules (opt-outs, competitors, existing customers). Calculate overlap with concurrent campaigns.

## Tools used

- [query_marketo_campaigns](/tools/query-marketo-campaigns.md)
- [query_salesforce_crm_accounts](/tools/query-salesforce-crm-accounts.md)
- [lookup_list_management_segmentation_agent_playbook](/tools/lookup-list-management-segmentation-agent-playbook.md)

## Runs in

- [audience_assembly](/workflow/audience-assembly.md)

## Evidence expected

- source_system_record
- document_reference

## Evals

- [Run the List Management & Segmentation Agent workflow for the current period. Cite the relevant source-system evidence and surface any escalations required.](/tests/list-management-segmentation-agent-end-to-end.md)

# Citations

- [List Management & Segmentation Agent Playbook](/documents/list-management-segmentation-agent-playbook.md)
