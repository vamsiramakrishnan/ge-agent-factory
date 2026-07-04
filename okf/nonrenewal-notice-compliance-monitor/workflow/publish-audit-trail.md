---
type: Workflow Stage
title: "Publish & Audit Trail"
description: "Execute action_guidewire_policycenter_publish to finalize the compliant non-renewal notice on the policy record in Guidewire PolicyCenter, publish the daily compliance exception report to BigQuery, and escalate any at-risk deadline to the Compliance Officer with the full audit trail attached."
source_id: publish_audit_trail
tags:
  - insurance
  - okf
  - brd
timestamp: "2026-07-04T00:00:00.000Z"
---

# Publish & Audit Trail

Execute action_guidewire_policycenter_publish to finalize the compliant non-renewal notice on the policy record in Guidewire PolicyCenter, publish the daily compliance exception report to BigQuery, and escalate any at-risk deadline to the Compliance Officer with the full audit trail attached.

- **Mode:** sequential
- **Stage:** 5 of 5

## Tools

- [query_guidewire_policycenter_policies](/tools/query-guidewire-policycenter-policies.md)
- [query_bigquery_analytics_events](/tools/query-bigquery-analytics-events.md)
- [lookup_nonrenewal_notice_compliance_monitor_authority_guide](/tools/lookup-nonrenewal-notice-compliance-monitor-authority-guide.md)
- [action_guidewire_policycenter_publish](/tools/action-guidewire-policycenter-publish.md)
