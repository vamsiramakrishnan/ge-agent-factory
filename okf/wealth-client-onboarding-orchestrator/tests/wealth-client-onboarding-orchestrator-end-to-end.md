---
type: Eval Scenario
title: Run the Wealth Client Onboarding Orchestrator workflow for the current period...
description: "Run the Wealth Client Onboarding Orchestrator workflow for the current period. Cite the relevant source-system evidence and surface any escalations required."
source_id: "wealth-client-onboarding-orchestrator-end-to-end"
generation_status: inferred
tags:
  - banking
  - okf
  - brd
timestamp: "2026-07-04T00:00:00.000Z"
---

# Run the Wealth Client Onboarding Orchestrator workflow for the current period. Cite the relevant source-system evidence and surface any escalations required.

## Validates

- [acat-custodian-transfer-tracking](/queries/acat-custodian-transfer-tracking.md)

## Mechanisms to call

- [query_salesforce_financial_services_cloud_client_households](/tools/query-salesforce-financial-services-cloud-client-households.md)
- [query_bigquery_analytics_events](/tools/query-bigquery-analytics-events.md)
- [query_docusign_envelopes](/tools/query-docusign-envelopes.md)
- [query_servicenow_tickets](/tools/query-servicenow-tickets.md)
- [lookup_wealth_client_onboarding_orchestrator_compliance_policy](/tools/lookup-wealth-client-onboarding-orchestrator-compliance-policy.md)
- [action_salesforce_financial_services_cloud_publish](/tools/action-salesforce-financial-services-cloud-publish.md)

## Success rubric

Action publish executed against Salesforce Financial Services Cloud, with audit-trail entry and Wealth Operations Specialist notified of outcomes.

# Citations

- [Wealth Client Onboarding Orchestrator Banking Compliance Policy](/documents/wealth-client-onboarding-orchestrator-compliance-policy.md)
