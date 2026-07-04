---
type: Workflow Stage
title: "Agency Book Scan & Baseline Pull"
description: "Query policy_forms, rating_worksheets, and endorsement_records from Duck Creek Policy and accounts/opportunities from Salesforce Marketing Cloud (query_duck_creek_policy_policy_forms, query_salesforce_marketing_cloud_accounts) to assemble the current-period production picture per agency."
source_id: agency_book_scan_baseline_pull
tags:
  - insurance
  - okf
  - brd
timestamp: "2026-07-04T00:00:00.000Z"
---

# Agency Book Scan & Baseline Pull

Query policy_forms, rating_worksheets, and endorsement_records from Duck Creek Policy and accounts/opportunities from Salesforce Marketing Cloud (query_duck_creek_policy_policy_forms, query_salesforce_marketing_cloud_accounts) to assemble the current-period production picture per agency.

- **Mode:** sequential
- **Stage:** 1 of 5

## Tools

- [query_duck_creek_policy_policy_forms](/tools/query-duck-creek-policy-policy-forms.md)
- [query_salesforce_marketing_cloud_accounts](/tools/query-salesforce-marketing-cloud-accounts.md)
- [lookup_agency_production_performance_monitor_authority_guide](/tools/lookup-agency-production-performance-monitor-authority-guide.md)
- [action_duck_creek_policy_recommend](/tools/action-duck-creek-policy-recommend.md)

Next: [Variance Scoring Against Historical Baseline](/workflow/variance-scoring-against-historical-baseline.md)
