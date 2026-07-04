---
type: Workflow Stage
title: Data Scan
description: "Continuous scan of HRIS fields across Workday and SAP SuccessFactors. Check for completeness, format compliance, and cross-system consistency on every record."
source_id: data_scan
tags:
  - hr
  - okf
  - brd
timestamp: "2026-07-01T00:00:00.000Z"
---

# Data Scan

Continuous scan of HRIS fields across Workday and SAP SuccessFactors. Check for completeness, format compliance, and cross-system consistency on every record.

- **Mode:** sequential
- **Stage:** 1 of 4

## Tools

- [query_workday_employees](/tools/query-workday-employees.md)
- [query_sap_successfactors_employee_records](/tools/query-sap-successfactors-employee-records.md)
- [lookup_hris_data_quality_monitor_agent_policy_handbook](/tools/lookup-hris-data-quality-monitor-agent-policy-handbook.md)
- [action_workday_log_entry](/tools/action-workday-log-entry.md)

Next: [Anomaly Detection](/workflow/anomaly-detection.md)
