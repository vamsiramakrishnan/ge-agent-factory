---
type: Workflow Stage
title: "Act & Audit"
description: "Execute the publish step in Salesforce Financial Services Cloud with a full audit trail, and escalate exceptions to the Wealth Operations Specialist."
source_id: act_audit
tags:
  - banking
  - okf
  - brd
timestamp: "2026-07-04T00:00:00.000Z"
---

# Act & Audit

Execute the publish step in Salesforce Financial Services Cloud with a full audit trail, and escalate exceptions to the Wealth Operations Specialist.

- **Mode:** sequential
- **Stage:** 4 of 4

## Tools

- [query_salesforce_financial_services_cloud_client_households](/tools/query-salesforce-financial-services-cloud-client-households.md)
- [lookup_wealth_client_onboarding_orchestrator_compliance_policy](/tools/lookup-wealth-client-onboarding-orchestrator-compliance-policy.md)
- [action_salesforce_financial_services_cloud_publish](/tools/action-salesforce-financial-services-cloud-publish.md)
