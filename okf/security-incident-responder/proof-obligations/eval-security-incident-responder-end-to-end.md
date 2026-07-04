---
type: Proof Obligation
title: "Golden eval obligation — Run the Security Incident Responder workflow for the current period. Cite the relevant source-system evidence and surface any escalations required."
description: golden eval proof obligation
source_id: "eval-security-incident-responder-end-to-end"
tags:
  - it
  - okf
  - brd
timestamp: "2026-07-01T00:00:00.000Z"
source_kind: generationSpec
source_path: behaviorContract.goldenEvals.0
generation_status: generated
ge_status: generated
---

# Golden eval obligation — Run the Security Incident Responder workflow for the current period. Cite the relevant source-system evidence and surface any escalations required.

- **Kind:** golden eval
- **Spec source:** behaviorContract.goldenEvals.0
- **Eval:** [security-incident-responder-end-to-end](/tests/security-incident-responder-end-to-end.md)


## Mechanisms

- [query_crowdstrike_scan_findings](/tools/query-crowdstrike-scan-findings.md)
- [query_chronicle_chronicle_records](/tools/query-chronicle-chronicle-records.md)
- [query_pagerduty_incidents](/tools/query-pagerduty-incidents.md)
- [query_splunk_log_events](/tools/query-splunk-log-events.md)
- [lookup_security_incident_responder_runbook](/tools/lookup-security-incident-responder-runbook.md)
- [action_crowdstrike_generate](/tools/action-crowdstrike-generate.md)

## Entities that must be referenced

- scan_findings
- chronicle_records
- incidents
- log_events
- messages

## Forbidden behaviors

- do not invent KPI numbers
- do not skip the evidence_lookup step before any recommendation
- do not execute generate without two-system evidence

# Citations

- [security-incident-responder-runbook](/documents/security-incident-responder-runbook.md)
