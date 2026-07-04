---
type: Query Capability
title: "Identify duplicates, missing mandatory fields, stale records, and data drift...."
description: "Identify duplicates, missing mandatory fields, stale records, and data drift. Apply statistical anomaly detection for unusual patterns in compensation, title, and org changes."
source_id: "anomaly-detection"
generation_status: inferred
tags:
  - hr
  - okf
  - brd
timestamp: "2026-07-01T00:00:00.000Z"
---

# Identify duplicates, missing mandatory fields, stale records, and data drift. Apply statistical anomaly detection for unusual patterns in compensation, title, and org changes.

## Tools used

- [query_sap_successfactors_employee_records](/tools/query-sap-successfactors-employee-records.md)
- [lookup_hris_data_quality_monitor_agent_policy_handbook](/tools/lookup-hris-data-quality-monitor-agent-policy-handbook.md)

## Runs in

- [anomaly_detection](/workflow/anomaly-detection.md)

## Evidence expected

- source_system_record
- document_reference

## Evals

- [Run the HRIS Data Quality Monitor Agent workflow for the current period. Cite the relevant source-system evidence and surface any escalations required.](/tests/hris-data-quality-monitor-agent-end-to-end.md)

# Citations

- [HRIS Data Quality Monitor Agent Policy Handbook](/documents/hris-data-quality-monitor-agent-policy-handbook.md)
