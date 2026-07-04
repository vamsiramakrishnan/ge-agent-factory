---
type: Query Capability
title: Continuous scan of HRIS fields across Workday and SAP SuccessFactors. Check f...
description: "Continuous scan of HRIS fields across Workday and SAP SuccessFactors. Check for completeness, format compliance, and cross-system consistency on every record."
source_id: "data-scan"
generation_status: inferred
tags:
  - hr
  - okf
  - brd
timestamp: "2026-07-01T00:00:00.000Z"
---

# Continuous scan of HRIS fields across Workday and SAP SuccessFactors. Check for completeness, format compliance, and cross-system consistency on every record.

## Tools used

- [query_workday_employees](/tools/query-workday-employees.md)
- [query_sap_successfactors_employee_records](/tools/query-sap-successfactors-employee-records.md)
- [lookup_hris_data_quality_monitor_agent_policy_handbook](/tools/lookup-hris-data-quality-monitor-agent-policy-handbook.md)
- [action_workday_log_entry](/tools/action-workday-log-entry.md)

## Runs in

- [data_scan](/workflow/data-scan.md)

## Evidence expected

- source_system_record
- document_reference
- api_response
- generated_audit_trail

## Evals

- [Run the HRIS Data Quality Monitor Agent workflow for the current period. Cite the relevant source-system evidence and surface any escalations required.](/tests/hris-data-quality-monitor-agent-end-to-end.md)

# Citations

- [HRIS Data Quality Monitor Agent Policy Handbook](/documents/hris-data-quality-monitor-agent-policy-handbook.md)
