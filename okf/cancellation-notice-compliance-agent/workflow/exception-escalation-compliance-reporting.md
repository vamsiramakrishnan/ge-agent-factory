---
type: Workflow Stage
title: "Exception Escalation & Compliance Reporting"
description: "Compare current-period notice-defect rates against BigQuery analytics_events and historical_metrics baselines, escalate any notice-window breach or missing lienholder copy to the Billing Supervisor, and update KPI aggregates."
source_id: exception_escalation_compliance_reporting
tags:
  - insurance
  - okf
  - brd
timestamp: "2026-07-04T00:00:00.000Z"
---

# Exception Escalation & Compliance Reporting

Compare current-period notice-defect rates against BigQuery analytics_events and historical_metrics baselines, escalate any notice-window breach or missing lienholder copy to the Billing Supervisor, and update KPI aggregates.

- **Mode:** sequential
- **Stage:** 5 of 5

## Tools

- [query_guidewire_billingcenter_billing_accounts](/tools/query-guidewire-billingcenter-billing-accounts.md)
- [query_bigquery_analytics_events](/tools/query-bigquery-analytics-events.md)
- [lookup_cancellation_notice_compliance_agent_authority_guide](/tools/lookup-cancellation-notice-compliance-agent-authority-guide.md)
