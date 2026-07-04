---
type: Workflow Stage
title: Retrieve Records
description: Query client households and financial accounts from Salesforce Financial Services Cloud and correlate with DocuSign for the Wealth Client Onboarding Orchestrator workflow.
source_id: retrieve_records
tags:
  - banking
  - okf
  - brd
timestamp: "2026-07-04T00:00:00.000Z"
---

# Retrieve Records

Query client households and financial accounts from Salesforce Financial Services Cloud and correlate with DocuSign for the Wealth Client Onboarding Orchestrator workflow.

- **Mode:** sequential
- **Stage:** 1 of 4

## Tools

- [query_salesforce_financial_services_cloud_client_households](/tools/query-salesforce-financial-services-cloud-client-households.md)
- [query_docusign_envelopes](/tools/query-docusign-envelopes.md)
- [lookup_wealth_client_onboarding_orchestrator_compliance_policy](/tools/lookup-wealth-client-onboarding-orchestrator-compliance-policy.md)
- [action_salesforce_financial_services_cloud_publish](/tools/action-salesforce-financial-services-cloud-publish.md)

Next: [Analyze & Detect](/workflow/analyze-detect.md)
