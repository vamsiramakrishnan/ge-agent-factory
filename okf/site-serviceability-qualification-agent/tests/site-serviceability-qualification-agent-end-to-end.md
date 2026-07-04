---
type: Eval Scenario
title: Run the Site Serviceability Qualification Agent workflow for the current peri...
description: "Run the Site Serviceability Qualification Agent workflow for the current period. Cite the relevant source-system evidence and surface any escalations required."
source_id: "site-serviceability-qualification-agent-end-to-end"
generation_status: inferred
tags:
  - telco
  - okf
  - brd
timestamp: "2026-07-04T00:00:00.000Z"
---

# Run the Site Serviceability Qualification Agent workflow for the current period. Cite the relevant source-system evidence and surface any escalations required.

## Validates

- [multi-site-address-intake-crm-reconciliation](/queries/multi-site-address-intake-crm-reconciliation.md)

## Mechanisms to call

- [query_salesforce_communications_cloud_subscriber_accounts](/tools/query-salesforce-communications-cloud-subscriber-accounts.md)
- [query_bigquery_analytics_events](/tools/query-bigquery-analytics-events.md)
- [query_telco_3_telco_3_records](/tools/query-telco-3-telco-3-records.md)
- [lookup_site_serviceability_qualification_agent_assurance_runbook](/tools/lookup-site-serviceability-qualification-agent-assurance-runbook.md)
- [action_salesforce_communications_cloud_publish](/tools/action-salesforce-communications-cloud-publish.md)

## Success rubric

Action publish executed against Salesforce Communications Cloud, with audit-trail entry and Sales Solution Consultant notified of outcomes.

# Citations

- [Site Serviceability Qualification Agent Service Assurance Runbook](/documents/site-serviceability-qualification-agent-assurance-runbook.md)
