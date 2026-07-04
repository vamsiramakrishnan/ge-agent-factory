---
type: Workflow Stage
title: "Advisor Re-Profiling Outreach Draft & Audit Log"
description: "Execute action_salesforce_financial_services_cloud_draft to prepare advisor re-profiling outreach for stale or contradicted client_households records, emitting a generated_audit_trail entry and notifying the Wealth Compliance Officer."
source_id: advisor_re_profiling_outreach_draft_audit_log
tags:
  - banking
  - okf
  - brd
timestamp: "2026-07-04T00:00:00.000Z"
---

# Advisor Re-Profiling Outreach Draft & Audit Log

Execute action_salesforce_financial_services_cloud_draft to prepare advisor re-profiling outreach for stale or contradicted client_households records, emitting a generated_audit_trail entry and notifying the Wealth Compliance Officer.

- **Mode:** sequential
- **Stage:** 5 of 5

## Tools

- [query_salesforce_financial_services_cloud_client_households](/tools/query-salesforce-financial-services-cloud-client-households.md)
- [lookup_suitability_drift_review_monitor_compliance_policy](/tools/lookup-suitability-drift-review-monitor-compliance-policy.md)
- [action_salesforce_financial_services_cloud_draft](/tools/action-salesforce-financial-services-cloud-draft.md)
