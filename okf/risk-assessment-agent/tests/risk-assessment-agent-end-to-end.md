---
type: Eval Scenario
title: Run the Risk Assessment Agent workflow for the current period. Cite the relev...
description: "Run the Risk Assessment Agent workflow for the current period. Cite the relevant source-system evidence and surface any escalations required."
source_id: "risk-assessment-agent-end-to-end"
generation_status: inferred
tags:
  - finance
  - okf
  - brd
timestamp: "2026-07-01T00:00:00.000Z"
---

# Run the Risk Assessment Agent workflow for the current period. Cite the relevant source-system evidence and surface any escalations required.

## Validates

- [gemini-synthesizes-quantitative-risk-scores-with-qualitative-sig](/queries/gemini-synthesizes-quantitative-risk-scores-with-qualitative-sig.md)

## Mechanisms to call

- [query_auditboard_auditboard_records](/tools/query-auditboard-auditboard-records.md)
- [query_bigquery_analytics_events](/tools/query-bigquery-analytics-events.md)
- [query_finance_3_finance_3_records](/tools/query-finance-3-finance-3-records.md)
- [lookup_risk_assessment_agent_controls_playbook](/tools/lookup-risk-assessment-agent-controls-playbook.md)

## Success rubric

Chief Audit Executive receives a fully-cited recommendation; no external state change without explicit approval.

# Citations

- [Risk Assessment Agent Controls Playbook](/documents/risk-assessment-agent-controls-playbook.md)
