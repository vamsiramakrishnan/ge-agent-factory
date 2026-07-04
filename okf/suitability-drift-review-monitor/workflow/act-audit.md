---
type: Workflow Stage
title: "Act & Audit"
description: "Execute the draft step in Salesforce Financial Services Cloud with a full audit trail, and escalate exceptions to the Wealth Compliance Officer."
source_id: act_audit
tags:
  - banking
  - okf
  - brd
timestamp: "2026-07-04T00:00:00.000Z"
---

# Act & Audit

Execute the draft step in Salesforce Financial Services Cloud with a full audit trail, and escalate exceptions to the Wealth Compliance Officer.

- **Mode:** sequential
- **Stage:** 4 of 4

## Tools

- [query_salesforce_financial_services_cloud_client_households](/tools/query-salesforce-financial-services-cloud-client-households.md)
- [lookup_suitability_drift_review_monitor_compliance_policy](/tools/lookup-suitability-drift-review-monitor-compliance-policy.md)
- [action_salesforce_financial_services_cloud_draft](/tools/action-salesforce-financial-services-cloud-draft.md)
