---
type: Proof Obligation
title: "Golden eval obligation — Run the HRIS Data Quality Monitor Agent workflow for the current period. Cite the relevant source-system evidence and surface any escalations required."
description: golden eval proof obligation
source_id: "eval-hris-data-quality-monitor-agent-end-to-end"
tags:
  - hr
  - okf
  - brd
timestamp: "2026-07-01T00:00:00.000Z"
source_kind: generationSpec
source_path: behaviorContract.goldenEvals.0
generation_status: generated
ge_status: generated
---

# Golden eval obligation — Run the HRIS Data Quality Monitor Agent workflow for the current period. Cite the relevant source-system evidence and surface any escalations required.

- **Kind:** golden eval
- **Spec source:** behaviorContract.goldenEvals.0
- **Eval:** [hris-data-quality-monitor-agent-end-to-end](/tests/hris-data-quality-monitor-agent-end-to-end.md)


## Mechanisms

- [query_workday_employees](/tools/query-workday-employees.md)
- [query_sap_successfactors_employee_records](/tools/query-sap-successfactors-employee-records.md)
- [query_servicenow_tickets](/tools/query-servicenow-tickets.md)
- [lookup_hris_data_quality_monitor_agent_policy_handbook](/tools/lookup-hris-data-quality-monitor-agent-policy-handbook.md)
- [action_workday_log_entry](/tools/action-workday-log-entry.md)

## Entities that must be referenced

- employees
- employee_records
- tickets

## Forbidden behaviors

- do not invent KPI numbers
- do not skip the evidence_lookup step before any recommendation
- do not execute log entry without two-system evidence

# Citations

- [hris-data-quality-monitor-agent-policy-handbook](/documents/hris-data-quality-monitor-agent-policy-handbook.md)
