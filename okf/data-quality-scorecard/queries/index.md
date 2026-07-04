---
type: Index
title: Query Capabilities
description: "The questions and requests this agent can answer, each with the tools it uses."
timestamp: "2026-07-01T00:00:00.000Z"
---

# Query Capabilities

- [Run data quality checks using dbt tests and custom BigQuery assertions. Check completeness (null rates), accuracy (referential integrity), consistency (cross-table agreement), and timeliness (freshness).](/queries/quality-rule-execution.md)
- [Calculate domain-level quality scores from individual check results. Detect week-over-week degradation trends and correlate with upstream system changes or data volume shifts.](/queries/score-computation-trending.md)
- [Gemini explains quality degradations with business context — 'email completeness dropped from 98% to 91% after the new registration flow made email optional.' Provides remediation recommendations.](/queries/root-cause-contextualization.md)
- [Quality scorecard published to Looker dashboard with drill-down by domain and dimension. Alert notifications sent for domains falling below threshold.](/queries/scorecard-publication.md)
