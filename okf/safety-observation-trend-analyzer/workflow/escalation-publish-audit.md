---
type: Workflow Stage
title: "Escalation & Publish Audit"
description: "Route LEL, Title V exceedance, cross-area recurrence, or severity-gate conditions to the Plant Safety Coordinator, then execute action_sphera_ehs_publish with a full audit trail."
source_id: escalation_publish_audit
tags:
  - manufacturing
  - okf
  - brd
timestamp: "2026-07-04T00:00:00.000Z"
---

# Escalation & Publish Audit

Route LEL, Title V exceedance, cross-area recurrence, or severity-gate conditions to the Plant Safety Coordinator, then execute action_sphera_ehs_publish with a full audit trail.

- **Mode:** sequential
- **Stage:** 6 of 6

## Tools

- [query_sphera_ehs_safety_incidents](/tools/query-sphera-ehs-safety-incidents.md)
- [lookup_safety_observation_trend_analyzer_sop](/tools/lookup-safety-observation-trend-analyzer-sop.md)
- [action_sphera_ehs_publish](/tools/action-sphera-ehs-publish.md)
