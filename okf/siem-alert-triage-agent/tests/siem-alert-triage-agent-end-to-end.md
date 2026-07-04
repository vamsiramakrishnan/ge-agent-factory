---
type: Eval Scenario
title: Run the SIEM Alert Triage Agent workflow for the current period. Cite the rel...
description: "Run the SIEM Alert Triage Agent workflow for the current period. Cite the relevant source-system evidence and surface any escalations required."
source_id: "siem-alert-triage-agent-end-to-end"
generation_status: inferred
tags:
  - it
  - okf
  - brd
timestamp: "2026-07-01T00:00:00.000Z"
---

# Run the SIEM Alert Triage Agent workflow for the current period. Cite the relevant source-system evidence and surface any escalations required.

## Validates

- [alert-ingestion-normalization](/queries/alert-ingestion-normalization.md)

## Mechanisms to call

- [query_chronicle_siem_chronicle_siem_records](/tools/query-chronicle-siem-chronicle-siem-records.md)
- [query_crowdstrike_scan_findings](/tools/query-crowdstrike-scan-findings.md)
- [query_splunk_log_events](/tools/query-splunk-log-events.md)
- [query_okta_users](/tools/query-okta-users.md)
- [lookup_siem_alert_triage_agent_runbook](/tools/lookup-siem-alert-triage-agent-runbook.md)

## Success rubric

Security Analyst receives a fully-cited recommendation; no external state change without explicit approval.

# Citations

- [SIEM Alert Triage Agent Operations Runbook](/documents/siem-alert-triage-agent-runbook.md)
