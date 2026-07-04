---
type: Workflow Stage
title: "Alert Ingestion & Normalization"
description: "Receive SIEM alerts from Chronicle and Splunk. Normalize alert schema, extract key entities (user, IP, asset, action), and deduplicate correlated alerts."
source_id: alert_ingestion_normalization
tags:
  - it
  - okf
  - brd
timestamp: "2026-07-01T00:00:00.000Z"
---

# Alert Ingestion & Normalization

Receive SIEM alerts from Chronicle and Splunk. Normalize alert schema, extract key entities (user, IP, asset, action), and deduplicate correlated alerts.

- **Mode:** sequential
- **Stage:** 1 of 4

## Tools

- [query_chronicle_siem_chronicle_siem_records](/tools/query-chronicle-siem-chronicle-siem-records.md)
- [query_splunk_log_events](/tools/query-splunk-log-events.md)
- [lookup_siem_alert_triage_agent_runbook](/tools/lookup-siem-alert-triage-agent-runbook.md)

Next: [Context Enrichment](/workflow/context-enrichment.md)
