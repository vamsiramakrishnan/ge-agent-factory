---
type: Workflow Stage
title: "Act & Audit"
description: "Execute the publish step in Sphera EHS with a full audit trail, and escalate exceptions to the Plant Safety Coordinator."
source_id: act_audit
tags:
  - manufacturing
  - okf
  - brd
timestamp: "2026-07-04T00:00:00.000Z"
---

# Act & Audit

Execute the publish step in Sphera EHS with a full audit trail, and escalate exceptions to the Plant Safety Coordinator.

- **Mode:** sequential
- **Stage:** 4 of 4

## Tools

- [query_sphera_ehs_safety_incidents](/tools/query-sphera-ehs-safety-incidents.md)
- [lookup_safety_observation_trend_analyzer_sop](/tools/lookup-safety-observation-trend-analyzer-sop.md)
- [action_sphera_ehs_publish](/tools/action-sphera-ehs-publish.md)
