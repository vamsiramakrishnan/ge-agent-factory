---
type: Query Capability
title: Gemini synthesizes quantitative risk scores with qualitative signals from mul...
description: Gemini synthesizes quantitative risk scores with qualitative signals from multiple data sources
source_id: "gemini-synthesizes-quantitative-risk-scores-with-qualitative-sig"
generation_status: inferred
tags:
  - finance
  - okf
  - brd
timestamp: "2026-07-01T00:00:00.000Z"
---

# Gemini synthesizes quantitative risk scores with qualitative signals from multiple data sources

## Tools used

- [query_auditboard_auditboard_records](/tools/query-auditboard-auditboard-records.md)
- [query_bigquery_analytics_events](/tools/query-bigquery-analytics-events.md)
- [query_finance_3_finance_3_records](/tools/query-finance-3-finance-3-records.md)
- [lookup_risk_assessment_agent_controls_playbook](/tools/lookup-risk-assessment-agent-controls-playbook.md)

## Evidence expected

- source_system_record
- sql_result
- document_reference

## Evals

- [Run the Risk Assessment Agent workflow for the current period. Cite the relevant source-system evidence and surface any escalations required.](/tests/risk-assessment-agent-end-to-end.md)

# Citations

- [Risk Assessment Agent Controls Playbook](/documents/risk-assessment-agent-controls-playbook.md)
