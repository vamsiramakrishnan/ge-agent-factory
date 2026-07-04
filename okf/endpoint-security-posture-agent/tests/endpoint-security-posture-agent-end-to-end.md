---
type: Eval Scenario
title: Run the Endpoint Security Posture Agent workflow for the current period. Cite...
description: "Run the Endpoint Security Posture Agent workflow for the current period. Cite the relevant source-system evidence and surface any escalations required."
source_id: "endpoint-security-posture-agent-end-to-end"
generation_status: inferred
tags:
  - it
  - okf
  - brd
timestamp: "2026-07-01T00:00:00.000Z"
---

# Run the Endpoint Security Posture Agent workflow for the current period. Cite the relevant source-system evidence and surface any escalations required.

## Validates

- [multi-source-posture-scan](/queries/multi-source-posture-scan.md)

## Mechanisms to call

- [query_crowdstrike_scan_findings](/tools/query-crowdstrike-scan-findings.md)
- [query_manageengine_manageengine_records](/tools/query-manageengine-manageengine-records.md)
- [query_okta_users](/tools/query-okta-users.md)
- [query_bigquery_analytics_events](/tools/query-bigquery-analytics-events.md)
- [lookup_endpoint_security_posture_agent_runbook](/tools/lookup-endpoint-security-posture-agent-runbook.md)
- [action_crowdstrike_post](/tools/action-crowdstrike-post.md)

## Success rubric

Action post executed against CrowdStrike, with audit-trail entry and End User Support Lead notified of outcomes.

# Citations

- [Endpoint Security Posture Agent Operations Runbook](/documents/endpoint-security-posture-agent-runbook.md)
