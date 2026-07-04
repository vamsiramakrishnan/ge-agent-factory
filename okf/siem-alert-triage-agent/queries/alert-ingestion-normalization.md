---
type: Query Capability
title: "Receive SIEM alerts from Chronicle and Splunk. Normalize alert schema, extrac..."
description: "Receive SIEM alerts from Chronicle and Splunk. Normalize alert schema, extract key entities (user, IP, asset, action), and deduplicate correlated alerts."
source_id: "alert-ingestion-normalization"
generation_status: inferred
tags:
  - it
  - okf
  - brd
timestamp: "2026-07-01T00:00:00.000Z"
---

# Receive SIEM alerts from Chronicle and Splunk. Normalize alert schema, extract key entities (user, IP, asset, action), and deduplicate correlated alerts.

## Tools used

- [query_chronicle_siem_chronicle_siem_records](/tools/query-chronicle-siem-chronicle-siem-records.md)
- [query_splunk_log_events](/tools/query-splunk-log-events.md)
- [lookup_siem_alert_triage_agent_runbook](/tools/lookup-siem-alert-triage-agent-runbook.md)

## Runs in

- [alert_ingestion_normalization](/workflow/alert-ingestion-normalization.md)

## Evidence expected

- source_system_record
- sql_result
- document_reference

## Evals

- [Run the SIEM Alert Triage Agent workflow for the current period. Cite the relevant source-system evidence and surface any escalations required.](/tests/siem-alert-triage-agent-end-to-end.md)

# Citations

- [SIEM Alert Triage Agent Operations Runbook](/documents/siem-alert-triage-agent-runbook.md)
