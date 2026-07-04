---
type: Query Capability
title: "Receive incident declaration from PagerDuty. Classify attack type, identify a..."
description: "Receive incident declaration from PagerDuty. Classify attack type, identify affected systems, and estimate blast radius using endpoint telemetry and SIEM correlation."
source_id: "incident-classification-scoping"
generation_status: inferred
tags:
  - it
  - okf
  - brd
timestamp: "2026-07-01T00:00:00.000Z"
---

# Receive incident declaration from PagerDuty. Classify attack type, identify affected systems, and estimate blast radius using endpoint telemetry and SIEM correlation.

## Tools used

- [query_pagerduty_incidents](/tools/query-pagerduty-incidents.md)
- [lookup_security_incident_responder_runbook](/tools/lookup-security-incident-responder-runbook.md)

## Runs in

- [incident_classification_scoping](/workflow/incident-classification-scoping.md)

## Evidence expected

- sql_result
- document_reference

## Evals

- [Run the Security Incident Responder workflow for the current period. Cite the relevant source-system evidence and surface any escalations required.](/tests/security-incident-responder-end-to-end.md)

# Citations

- [Security Incident Responder Operations Runbook](/documents/security-incident-responder-runbook.md)
