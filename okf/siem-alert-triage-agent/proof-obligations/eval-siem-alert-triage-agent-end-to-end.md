---
type: Proof Obligation
title: "Golden eval obligation — Run the SIEM Alert Triage Agent workflow for the current period. Cite the relevant source-system evidence and surface any escalations required."
description: golden eval proof obligation
source_id: "eval-siem-alert-triage-agent-end-to-end"
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

# Golden eval obligation — Run the SIEM Alert Triage Agent workflow for the current period. Cite the relevant source-system evidence and surface any escalations required.

- **Kind:** golden eval
- **Spec source:** behaviorContract.goldenEvals.0
- **Eval:** [siem-alert-triage-agent-end-to-end](/tests/siem-alert-triage-agent-end-to-end.md)


## Mechanisms

- [query_chronicle_siem_chronicle_siem_records](/tools/query-chronicle-siem-chronicle-siem-records.md)
- [query_crowdstrike_scan_findings](/tools/query-crowdstrike-scan-findings.md)
- [query_splunk_log_events](/tools/query-splunk-log-events.md)
- [query_okta_users](/tools/query-okta-users.md)
- [lookup_siem_alert_triage_agent_runbook](/tools/lookup-siem-alert-triage-agent-runbook.md)

## Entities that must be referenced

- chronicle_siem_records
- scan_findings
- log_events
- users

## Forbidden behaviors

- do not invent KPI numbers
- do not skip the evidence_lookup step before any recommendation
- do not act on single-system evidence

# Citations

- [siem-alert-triage-agent-runbook](/documents/siem-alert-triage-agent-runbook.md)
