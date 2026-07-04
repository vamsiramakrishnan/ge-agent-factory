---
type: Query Capability
title: "Execute action_ibm_maximo_recommend to raise a prioritized condition-based ma..."
description: "Execute action_ibm_maximo_recommend to raise a prioritized condition-based maintenance_work_orders record in IBM Maximo, or hand off to the Reliability Engineer when an escalation rule fires."
source_id: "work-order-issuance-escalation"
generation_status: inferred
tags:
  - manufacturing
  - okf
  - brd
timestamp: "2026-07-04T00:00:00.000Z"
---

# Execute action_ibm_maximo_recommend to raise a prioritized condition-based maintenance_work_orders record in IBM Maximo, or hand off to the Reliability Engineer when an escalation rule fires.

## Tools used

- [query_ibm_maximo_maintenance_work_orders](/tools/query-ibm-maximo-maintenance-work-orders.md)
- [action_ibm_maximo_recommend](/tools/action-ibm-maximo-recommend.md)

## Runs in

- [work_order_issuance_escalation](/workflow/work-order-issuance-escalation.md)

## Evidence expected

- source_system_record
- api_response
- generated_audit_trail

## Evals

- [Run the Predictive Asset Failure Monitor workflow for the current period. Cite the relevant source-system evidence and surface any escalations required.](/tests/predictive-asset-failure-monitor-end-to-end.md)
- [Asset 148230 (a CNC machine, criticality_ranking a_constraint) has maintenance_work_orders record WO-4021873 marked 'complete' as of yesterday for a bearing_wear failure_mode, but the last six hours of sensor_readings still show vibration_mm_s trending upward toward the alarm_high_limit. Reconcile these two records and tell me whether the asset is actually healthy.](/tests/predictive-asset-failure-monitor-conflicting-closure.md)

# Citations

- [Predictive Asset Failure Monitor Standard Operating Procedure](/documents/predictive-asset-failure-monitor-sop.md)
- [Vibration Severity Zone Classification & Response Time Matrix (ISO 10816/20816)](/documents/vibration-severity-response-matrix.md)
