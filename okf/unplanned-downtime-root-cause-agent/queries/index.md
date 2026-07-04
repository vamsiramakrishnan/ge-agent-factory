---
type: Index
title: Query Capabilities
description: "The questions and requests this agent can answer, each with the tools it uses."
timestamp: "2026-07-04T00:00:00.000Z"
---

# Query Capabilities

- [Detect fault_alarm, e_stop, and warning_alarm machine_events in Siemens Opcenter MES alongside downtime_category events in OSIsoft PI System downtime_events, keyed by asset_number and production_order_id so the trigger window is anchored before any evidence pull begins.](/queries/downtime-alarm-event-capture.md)
- [Pull the surrounding sensor_readings window and resolve asset_tag_hierarchies from OSIsoft PI System via query_osisoft_pi_system_sensor_readings and query_osisoft_pi_system_asset_tag_hierarchies to anchor the event to a physical equipment_unit and confirm functional_location_active status.](/queries/historian-window-pull.md)
- [Compare the event against historical_metrics, cached_aggregates, and analytics_events in BigQuery using query_bigquery_historical_metrics, query_bigquery_cached_aggregates, and query_bigquery_analytics_events to rank candidate root-cause hypotheses and flag constraint_asset exposure.](/queries/failure-signature-correlation.md)
- [Validate the ranked hypothesis and any reason_code or oee_loss_category recommendation against the Unplanned Downtime Root-Cause Agent SOP and the Downtime Reason Code & OEE Loss Attribution Standard via lookup_unplanned_downtime_root_cause_agent_sop before anything is published.](/queries/sop-reason-code-evidence-gate.md)
- [Execute action_siemens_opcenter_mes_escalate for repeat-offender or constraint-asset events in Siemens Opcenter MES, attaching the sensor_readings and machine_events evidence package and notifying the Plant Manager with a full audit trail.](/queries/escalation-evidence-package.md)
