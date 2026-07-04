---
type: Proof Obligation
title: "Golden eval obligation — Run the Endpoint Security Posture Agent workflow for the current period. Cite the relevant source-system evidence and surface any escalations required."
description: golden eval proof obligation
source_id: "eval-endpoint-security-posture-agent-end-to-end"
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

# Golden eval obligation — Run the Endpoint Security Posture Agent workflow for the current period. Cite the relevant source-system evidence and surface any escalations required.

- **Kind:** golden eval
- **Spec source:** behaviorContract.goldenEvals.0
- **Eval:** [endpoint-security-posture-agent-end-to-end](/tests/endpoint-security-posture-agent-end-to-end.md)


## Mechanisms

- [query_crowdstrike_scan_findings](/tools/query-crowdstrike-scan-findings.md)
- [query_manageengine_manageengine_records](/tools/query-manageengine-manageengine-records.md)
- [query_okta_users](/tools/query-okta-users.md)
- [query_bigquery_analytics_events](/tools/query-bigquery-analytics-events.md)
- [lookup_endpoint_security_posture_agent_runbook](/tools/lookup-endpoint-security-posture-agent-runbook.md)
- [action_crowdstrike_post](/tools/action-crowdstrike-post.md)

## Entities that must be referenced

- scan_findings
- manageengine_records
- users
- analytics_events

## Forbidden behaviors

- do not invent KPI numbers
- do not skip the evidence_lookup step before any recommendation
- do not execute post without two-system evidence

# Citations

- [endpoint-security-posture-agent-runbook](/documents/endpoint-security-posture-agent-runbook.md)
