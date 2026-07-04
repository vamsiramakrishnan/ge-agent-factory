---
type: Workflow Stage
title: ACAT / custodian transfer tracking
description: "Compare current financial_accounts state against BigQuery historical_metrics, cached_aggregates, and analytics_events to detect transfers stalled past the custodian's expected window, matching envelope and audit_trails status in DocuSign for corroborating evidence."
source_id: acat_custodian_transfer_tracking
tags:
  - banking
  - okf
  - brd
timestamp: "2026-07-04T00:00:00.000Z"
---

# ACAT / custodian transfer tracking

Compare current financial_accounts state against BigQuery historical_metrics, cached_aggregates, and analytics_events to detect transfers stalled past the custodian's expected window, matching envelope and audit_trails status in DocuSign for corroborating evidence.

- **Mode:** sequential
- **Stage:** 3 of 5

## Tools

- [query_salesforce_financial_services_cloud_client_households](/tools/query-salesforce-financial-services-cloud-client-households.md)
- [query_bigquery_analytics_events](/tools/query-bigquery-analytics-events.md)
- [query_docusign_envelopes](/tools/query-docusign-envelopes.md)
- [lookup_wealth_client_onboarding_orchestrator_compliance_policy](/tools/lookup-wealth-client-onboarding-orchestrator-compliance-policy.md)
- [action_salesforce_financial_services_cloud_publish](/tools/action-salesforce-financial-services-cloud-publish.md)

Next: [Funded-status publish & advisor/client sync](/workflow/funded-status-publish-advisor-client-sync.md)
