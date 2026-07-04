---
type: Workflow Stage
title: Narrative Drafting via Vertex AI
description: "Generate the industry outlook, repayment analysis, and risk mitigant narrative sections in Vertex AI, grounding every claim in analytics_events and historical_metrics baselines pulled from BigQuery via query_bigquery_analytics_events."
source_id: narrative_drafting_via_vertex_ai
tags:
  - banking
  - okf
  - brd
timestamp: "2026-07-04T00:00:00.000Z"
---

# Narrative Drafting via Vertex AI

Generate the industry outlook, repayment analysis, and risk mitigant narrative sections in Vertex AI, grounding every claim in analytics_events and historical_metrics baselines pulled from BigQuery via query_bigquery_analytics_events.

- **Mode:** sequential
- **Stage:** 4 of 6

## Tools

- [query_bigquery_analytics_events](/tools/query-bigquery-analytics-events.md)
- [lookup_commercial_credit_memo_drafting_agent_compliance_policy](/tools/lookup-commercial-credit-memo-drafting-agent-compliance-policy.md)
- [action_ncino_loan_origination_generate](/tools/action-ncino-loan-origination-generate.md)

Next: [Exception Escalation & Committee Routing](/workflow/exception-escalation-committee-routing.md)
