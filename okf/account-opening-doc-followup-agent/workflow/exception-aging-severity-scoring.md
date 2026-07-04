---
type: Workflow Stage
title: "Exception Aging & Severity Scoring"
description: "Compare open exceptions against historical_metrics and analytics_events baselines in BigQuery to score days-since-open_date and rank the Branch Operations Manager's daily aging queue against the ten-day cure threshold."
source_id: exception_aging_severity_scoring
tags:
  - banking
  - okf
  - brd
timestamp: "2026-07-04T00:00:00.000Z"
---

# Exception Aging & Severity Scoring

Compare open exceptions against historical_metrics and analytics_events baselines in BigQuery to score days-since-open_date and rank the Branch Operations Manager's daily aging queue against the ten-day cure threshold.

- **Mode:** sequential
- **Stage:** 3 of 5

## Tools

- [query_temenos_transact_core_accounts](/tools/query-temenos-transact-core-accounts.md)
- [query_bigquery_analytics_events](/tools/query-bigquery-analytics-events.md)
- [lookup_account_opening_doc_followup_agent_compliance_policy](/tools/lookup-account-opening-doc-followup-agent-compliance-policy.md)

Next: [Compliance & Checklist Evidence Validation](/workflow/compliance-checklist-evidence-validation.md)
