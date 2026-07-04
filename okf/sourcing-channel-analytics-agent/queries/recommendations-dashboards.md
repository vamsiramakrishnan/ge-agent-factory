---
type: Query Capability
title: "Generate budget reallocation recommendations and publish real-time channel pe..."
description: "Generate budget reallocation recommendations and publish real-time channel performance dashboards to Looker for TA leadership."
source_id: "recommendations-dashboards"
generation_status: inferred
tags:
  - hr
  - okf
  - brd
timestamp: "2026-07-01T00:00:00.000Z"
---

# Generate budget reallocation recommendations and publish real-time channel performance dashboards to Looker for TA leadership.

## Tools used

- [lookup_sourcing_channel_analytics_agent_policy_handbook](/tools/lookup-sourcing-channel-analytics-agent-policy-handbook.md)
- [action_ats_recommend](/tools/action-ats-recommend.md)

## Runs in

- [recommendations_dashboards](/workflow/recommendations-dashboards.md)

## Evidence expected

- document_reference
- api_response
- generated_audit_trail

## Evals

- [Run the Sourcing Channel Analytics Agent workflow for the current period. Cite the relevant source-system evidence and surface any escalations required.](/tests/sourcing-channel-analytics-agent-end-to-end.md)

# Citations

- [Sourcing Channel Analytics Agent Policy Handbook](/documents/sourcing-channel-analytics-agent-policy-handbook.md)
