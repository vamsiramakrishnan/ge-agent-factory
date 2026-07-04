---
type: Workflow Stage
title: "Funded-status publish & advisor/client sync"
description: "Execute action_salesforce_financial_services_cloud_publish once two-system evidence (Salesforce Financial Services Cloud plus DocuSign audit_trails or BigQuery analytics_events) confirms funding, writing the milestone back to Salesforce Financial Services Cloud for the advisor and client portal."
source_id: funded_status_publish_advisor_client_sync
tags:
  - banking
  - okf
  - brd
timestamp: "2026-07-04T00:00:00.000Z"
---

# Funded-status publish & advisor/client sync

Execute action_salesforce_financial_services_cloud_publish once two-system evidence (Salesforce Financial Services Cloud plus DocuSign audit_trails or BigQuery analytics_events) confirms funding, writing the milestone back to Salesforce Financial Services Cloud for the advisor and client portal.

- **Mode:** sequential
- **Stage:** 4 of 5

## Tools

- [query_salesforce_financial_services_cloud_client_households](/tools/query-salesforce-financial-services-cloud-client-households.md)
- [query_bigquery_analytics_events](/tools/query-bigquery-analytics-events.md)
- [query_docusign_envelopes](/tools/query-docusign-envelopes.md)
- [lookup_wealth_client_onboarding_orchestrator_compliance_policy](/tools/lookup-wealth-client-onboarding-orchestrator-compliance-policy.md)
- [action_salesforce_financial_services_cloud_publish](/tools/action-salesforce-financial-services-cloud-publish.md)

Next: [Exception escalation & service-desk deflection](/workflow/exception-escalation-service-desk-deflection.md)
