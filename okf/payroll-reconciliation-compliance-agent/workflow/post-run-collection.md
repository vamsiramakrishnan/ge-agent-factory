---
type: Workflow Stage
title: "Post-Run Collection"
description: "Collect payroll run results and GL entries from ADP. Cross-reference with Workday compensation records and benefits deductions for complete reconciliation dataset."
source_id: post_run_collection
tags:
  - hr
  - okf
  - brd
timestamp: "2026-07-01T00:00:00.000Z"
---

# Post-Run Collection

Collect payroll run results and GL entries from ADP. Cross-reference with Workday compensation records and benefits deductions for complete reconciliation dataset.

- **Mode:** sequential
- **Stage:** 1 of 4

## Tools

- [query_adp_adp_records](/tools/query-adp-adp-records.md)
- [query_workday_employees](/tools/query-workday-employees.md)
- [query_tax_systems_tax_systems_records](/tools/query-tax-systems-tax-systems-records.md)
- [lookup_payroll_reconciliation_compliance_agent_policy_handbook](/tools/lookup-payroll-reconciliation-compliance-agent-policy-handbook.md)
- [action_adp_update](/tools/action-adp-update.md)

Next: [Variance Detection](/workflow/variance-detection.md)
