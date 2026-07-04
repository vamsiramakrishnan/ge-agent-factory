---
type: Query Capability
title: Push content card to sales rep via Slack and Salesforce. Track content usage ...
description: Push content card to sales rep via Slack and Salesforce. Track content usage and downstream deal outcome to continuously improve recommendation model.
source_id: "delivery-tracking"
generation_status: inferred
tags:
  - marketing
  - okf
  - brd
timestamp: "2026-07-01T00:00:00.000Z"
---

# Push content card to sales rep via Slack and Salesforce. Track content usage and downstream deal outcome to continuously improve recommendation model.

## Tools used

- [query_salesforce_crm_accounts](/tools/query-salesforce-crm-accounts.md)
- [lookup_sales_enablement_content_agent_playbook](/tools/lookup-sales-enablement-content-agent-playbook.md)
- [action_salesforce_crm_recommend](/tools/action-salesforce-crm-recommend.md)

## Runs in

- [delivery_tracking](/workflow/delivery-tracking.md)

## Evidence expected

- source_system_record
- document_reference
- api_response
- generated_audit_trail

## Evals

- [Run the Sales Enablement Content Agent workflow for the current period. Cite the relevant source-system evidence and surface any escalations required.](/tests/sales-enablement-content-agent-end-to-end.md)

# Citations

- [Sales Enablement Content Agent Playbook](/documents/sales-enablement-content-agent-playbook.md)
