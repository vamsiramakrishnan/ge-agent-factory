---
type: Workflow Stage
title: "Incident Classification & Scoping"
description: "Receive incident declaration from PagerDuty. Classify attack type, identify affected systems, and estimate blast radius using endpoint telemetry and SIEM correlation."
source_id: incident_classification_scoping
tags:
  - it
  - okf
  - brd
timestamp: "2026-07-01T00:00:00.000Z"
---

# Incident Classification & Scoping

Receive incident declaration from PagerDuty. Classify attack type, identify affected systems, and estimate blast radius using endpoint telemetry and SIEM correlation.

- **Mode:** sequential
- **Stage:** 1 of 2

## Tools

- [query_pagerduty_incidents](/tools/query-pagerduty-incidents.md)
- [lookup_security_incident_responder_runbook](/tools/lookup-security-incident-responder-runbook.md)

Next: [Response Playbook Generation](/workflow/response-playbook-generation.md)
