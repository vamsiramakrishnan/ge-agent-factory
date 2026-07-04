---
type: Eval Scenario
title: Run the Security Incident Responder workflow for the current period. Cite the...
description: "Run the Security Incident Responder workflow for the current period. Cite the relevant source-system evidence and surface any escalations required."
source_id: "security-incident-responder-end-to-end"
generation_status: inferred
tags:
  - it
  - okf
  - brd
timestamp: "2026-07-01T00:00:00.000Z"
---

# Run the Security Incident Responder workflow for the current period. Cite the relevant source-system evidence and surface any escalations required.

## Validates

- [incident-classification-scoping](/queries/incident-classification-scoping.md)

## Mechanisms to call

- [query_crowdstrike_scan_findings](/tools/query-crowdstrike-scan-findings.md)
- [query_chronicle_chronicle_records](/tools/query-chronicle-chronicle-records.md)
- [query_pagerduty_incidents](/tools/query-pagerduty-incidents.md)
- [query_splunk_log_events](/tools/query-splunk-log-events.md)
- [lookup_security_incident_responder_runbook](/tools/lookup-security-incident-responder-runbook.md)
- [action_crowdstrike_generate](/tools/action-crowdstrike-generate.md)

## Success rubric

Action generate executed against CrowdStrike, with audit-trail entry and CISO / Security Analyst notified of outcomes.

# Citations

- [Security Incident Responder Operations Runbook](/documents/security-incident-responder-runbook.md)
