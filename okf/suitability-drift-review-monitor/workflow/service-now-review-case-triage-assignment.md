---
type: Workflow Stage
title: "ServiceNow Review Case Triage & Assignment"
description: "Open or update ServiceNow tickets (category=policy) for material mismatches surfaced in client_households and advisory_referrals, attaching the cited policy sections and routing by severity."
source_id: service_now_review_case_triage_assignment
tags:
  - banking
  - okf
  - brd
timestamp: "2026-07-04T00:00:00.000Z"
---

# ServiceNow Review Case Triage & Assignment

Open or update ServiceNow tickets (category=policy) for material mismatches surfaced in client_households and advisory_referrals, attaching the cited policy sections and routing by severity.

- **Mode:** sequential
- **Stage:** 4 of 5

## Tools

- [query_salesforce_financial_services_cloud_client_households](/tools/query-salesforce-financial-services-cloud-client-households.md)
- [query_servicenow_tickets](/tools/query-servicenow-tickets.md)
- [lookup_suitability_drift_review_monitor_compliance_policy](/tools/lookup-suitability-drift-review-monitor-compliance-policy.md)

Next: [Advisor Re-Profiling Outreach Draft & Audit Log](/workflow/advisor-re-profiling-outreach-draft-audit-log.md)
