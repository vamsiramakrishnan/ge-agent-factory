---
type: Query Capability
title: Monitor deal stage progression in CRM. Pull deal attributes including industr...
description: "Monitor deal stage progression in CRM. Pull deal attributes including industry, company size, stakeholder roles (CTO vs. CFO vs. user), competitive context, and engagement history."
source_id: "deal-context-assembly"
generation_status: inferred
tags:
  - marketing
  - okf
  - brd
timestamp: "2026-07-01T00:00:00.000Z"
---

# Monitor deal stage progression in CRM. Pull deal attributes including industry, company size, stakeholder roles (CTO vs. CFO vs. user), competitive context, and engagement history.

## Tools used

- [query_salesforce_crm_accounts](/tools/query-salesforce-crm-accounts.md)
- [lookup_sales_enablement_content_agent_playbook](/tools/lookup-sales-enablement-content-agent-playbook.md)
- [action_salesforce_crm_recommend](/tools/action-salesforce-crm-recommend.md)

## Runs in

- [deal_context_assembly](/workflow/deal-context-assembly.md)

## Evidence expected

- source_system_record
- document_reference
- api_response
- generated_audit_trail

## Evals

- [Run the Sales Enablement Content Agent workflow for the current period. Cite the relevant source-system evidence and surface any escalations required.](/tests/sales-enablement-content-agent-end-to-end.md)

# Citations

- [Sales Enablement Content Agent Playbook](/documents/sales-enablement-content-agent-playbook.md)
