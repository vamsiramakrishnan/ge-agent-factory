---
type: Query Capability
title: "Auto-generate trend reports with actionable intervention recommendations for ..."
description: "Auto-generate trend reports with actionable intervention recommendations for leadership. Interactive dashboards with drill-down by region and case type."
source_id: "reporting-interventions"
generation_status: inferred
tags:
  - hr
  - okf
  - brd
timestamp: "2026-07-01T00:00:00.000Z"
---

# Auto-generate trend reports with actionable intervention recommendations for leadership. Interactive dashboards with drill-down by region and case type.

## Tools used

- [lookup_er_case_analytics_agent_policy_handbook](/tools/lookup-er-case-analytics-agent-policy-handbook.md)
- [action_servicenow_recommend](/tools/action-servicenow-recommend.md)

## Runs in

- [reporting_interventions](/workflow/reporting-interventions.md)

## Evidence expected

- document_reference
- api_response
- generated_audit_trail

## Evals

- [Run the ER Case Analytics Agent workflow for the current period. Cite the relevant source-system evidence and surface any escalations required.](/tests/er-case-analytics-agent-end-to-end.md)

# Citations

- [ER Case Analytics Agent Policy Handbook](/documents/er-case-analytics-agent-policy-handbook.md)
