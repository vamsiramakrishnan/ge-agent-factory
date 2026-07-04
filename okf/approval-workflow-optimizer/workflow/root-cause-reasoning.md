---
type: Workflow Stage
title: Root Cause Reasoning
description: "LLM reasons about the why behind patterns: 'Manager X approves 98% of requests in under 10 seconds — this is either rubber-stamping (threshold should be raised) or delegated to an EA (the EA should have direct approval authority).' Generates policy change recommendations with projected impact: 'Raising auto-approval from $1K to $5K eliminates 2,400 events/month — 200:1 efficiency-to-risk ratio.'"
source_id: root_cause_reasoning
tags:
  - procurement
  - okf
  - brd
timestamp: "2026-07-01T00:00:00.000Z"
---

# Root Cause Reasoning

LLM reasons about the why behind patterns: 'Manager X approves 98% of requests in under 10 seconds — this is either rubber-stamping (threshold should be raised) or delegated to an EA (the EA should have direct approval authority).' Generates policy change recommendations with projected impact: 'Raising auto-approval from $1K to $5K eliminates 2,400 events/month — 200:1 efficiency-to-risk ratio.'

- **Mode:** sequential
- **Stage:** 3 of 4

## Tools

- [query_bigquery_analytics_events](/tools/query-bigquery-analytics-events.md)
- [lookup_approval_workflow_optimizer_policy_guide](/tools/lookup-approval-workflow-optimizer-policy-guide.md)
- [action_coupa_ariba_workflow_approve](/tools/action-coupa-ariba-workflow-approve.md)

Next: [Recommendation Delivery](/workflow/recommendation-delivery.md)
