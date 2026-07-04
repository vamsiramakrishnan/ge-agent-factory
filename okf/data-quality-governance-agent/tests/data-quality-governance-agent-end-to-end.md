---
type: Eval Scenario
title: "Run the Data Quality & Governance Agent workflow for the current period. Cite..."
description: "Run the Data Quality & Governance Agent workflow for the current period. Cite the relevant source-system evidence and surface any escalations required."
source_id: "data-quality-governance-agent-end-to-end"
generation_status: inferred
tags:
  - marketing
  - okf
  - brd
timestamp: "2026-07-01T00:00:00.000Z"
---

# Run the Data Quality & Governance Agent workflow for the current period. Cite the relevant source-system evidence and surface any escalations required.

## Validates

- [cross-system-record-scanning](/queries/cross-system-record-scanning.md)

## Mechanisms to call

- [query_salesforce_crm_accounts](/tools/query-salesforce-crm-accounts.md)
- [query_hubspot_contacts](/tools/query-hubspot-contacts.md)
- [query_bigquery_analytics_events](/tools/query-bigquery-analytics-events.md)
- [lookup_data_quality_governance_agent_playbook](/tools/lookup-data-quality-governance-agent-playbook.md)

## Success rubric

Marketing Ops Lead receives a fully-cited recommendation; no external state change without explicit approval.

# Citations

- [Data Quality & Governance Agent Playbook](/documents/data-quality-governance-agent-playbook.md)
