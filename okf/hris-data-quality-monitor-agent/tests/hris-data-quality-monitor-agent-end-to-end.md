---
type: Eval Scenario
title: Run the HRIS Data Quality Monitor Agent workflow for the current period. Cite...
description: "Run the HRIS Data Quality Monitor Agent workflow for the current period. Cite the relevant source-system evidence and surface any escalations required."
source_id: "hris-data-quality-monitor-agent-end-to-end"
generation_status: inferred
tags:
  - hr
  - okf
  - brd
timestamp: "2026-07-01T00:00:00.000Z"
---

# Run the HRIS Data Quality Monitor Agent workflow for the current period. Cite the relevant source-system evidence and surface any escalations required.

## Validates

- [data-scan](/queries/data-scan.md)

## Mechanisms to call

- [query_workday_employees](/tools/query-workday-employees.md)
- [query_sap_successfactors_employee_records](/tools/query-sap-successfactors-employee-records.md)
- [query_servicenow_tickets](/tools/query-servicenow-tickets.md)
- [lookup_hris_data_quality_monitor_agent_policy_handbook](/tools/lookup-hris-data-quality-monitor-agent-policy-handbook.md)
- [action_workday_log_entry](/tools/action-workday-log-entry.md)

## Success rubric

Action log entry executed against Workday, with audit-trail entry and HR Ops Lead notified of outcomes.

# Citations

- [HRIS Data Quality Monitor Agent Policy Handbook](/documents/hris-data-quality-monitor-agent-policy-handbook.md)
