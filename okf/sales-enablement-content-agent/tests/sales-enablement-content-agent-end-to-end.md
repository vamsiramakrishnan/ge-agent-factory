---
type: Eval Scenario
title: Run the Sales Enablement Content Agent workflow for the current period. Cite ...
description: "Run the Sales Enablement Content Agent workflow for the current period. Cite the relevant source-system evidence and surface any escalations required."
source_id: "sales-enablement-content-agent-end-to-end"
generation_status: inferred
tags:
  - marketing
  - okf
  - brd
timestamp: "2026-07-01T00:00:00.000Z"
---

# Run the Sales Enablement Content Agent workflow for the current period. Cite the relevant source-system evidence and surface any escalations required.

## Validates

- [deal-context-assembly](/queries/deal-context-assembly.md)

## Mechanisms to call

- [query_salesforce_crm_accounts](/tools/query-salesforce-crm-accounts.md)
- [query_highspot_highspot_records](/tools/query-highspot-highspot-records.md)
- [query_google_workspace_accounts](/tools/query-google-workspace-accounts.md)
- [lookup_sales_enablement_content_agent_playbook](/tools/lookup-sales-enablement-content-agent-playbook.md)
- [action_salesforce_crm_recommend](/tools/action-salesforce-crm-recommend.md)

## Success rubric

Action recommend executed against Salesforce CRM, with audit-trail entry and Product Marketing Mgr notified of outcomes.

# Citations

- [Sales Enablement Content Agent Playbook](/documents/sales-enablement-content-agent-playbook.md)
