---
type: Workflow Stage
title: "Escalation & Evidence Package"
description: "Execute action_siemens_opcenter_mes_escalate for repeat-offender or constraint-asset events in Siemens Opcenter MES, attaching the sensor_readings and machine_events evidence package and notifying the Plant Manager with a full audit trail."
source_id: escalation_evidence_package
tags:
  - manufacturing
  - okf
  - brd
timestamp: "2026-07-04T00:00:00.000Z"
---

# Escalation & Evidence Package

Execute action_siemens_opcenter_mes_escalate for repeat-offender or constraint-asset events in Siemens Opcenter MES, attaching the sensor_readings and machine_events evidence package and notifying the Plant Manager with a full audit trail.

- **Mode:** sequential
- **Stage:** 5 of 5

## Tools

- [query_siemens_opcenter_mes_production_orders](/tools/query-siemens-opcenter-mes-production-orders.md)
- [query_osisoft_pi_system_sensor_readings](/tools/query-osisoft-pi-system-sensor-readings.md)
- [query_bigquery_analytics_events](/tools/query-bigquery-analytics-events.md)
- [action_siemens_opcenter_mes_escalate](/tools/action-siemens-opcenter-mes-escalate.md)
