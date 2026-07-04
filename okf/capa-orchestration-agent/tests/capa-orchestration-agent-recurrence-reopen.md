---
type: Eval Scenario
title: "CAPA-71822 (defect_code: dimensional, material_number 412908) closed on 2026-..."
description: "CAPA-71822 (defect_code: dimensional, material_number 412908) closed on 2026-04-02 with effectiveness_verified=true. This morning nonconformance record NC-648831 was raised on the same material_number 412908 with defect_code dimensional and severity major, detected 2026-06-30. The BigQuery analytics_events feed shows dimensional-defect variance_pct has been trending outside the historical baseline for that material for three straight weeks. Owner_name Priya Raghunathan wants to open a brand-new CAPA rather than touch the closed one. What should the agent do?"
source_id: "capa-orchestration-agent-recurrence-reopen"
generation_status: inferred
tags:
  - manufacturing
  - okf
  - brd
timestamp: "2026-07-04T00:00:00.000Z"
---

# CAPA-71822 (defect_code: dimensional, material_number 412908) closed on 2026-04-02 with effectiveness_verified=true. This morning nonconformance record NC-648831 was raised on the same material_number 412908 with defect_code dimensional and severity major, detected 2026-06-30. The BigQuery analytics_events feed shows dimensional-defect variance_pct has been trending outside the historical baseline for that material for three straight weeks. Owner_name Priya Raghunathan wants to open a brand-new CAPA rather than touch the closed one. What should the agent do?

## Validates

- [historical-precedent-matching](/queries/historical-precedent-matching.md)

## Mechanisms to call

- [query_bigquery_analytics_events](/tools/query-bigquery-analytics-events.md)
- [lookup_capa_orchestration_agent_sop](/tools/lookup-capa-orchestration-agent-sop.md)

## Success rubric

Exercises every mechanism above and grounds its answer in the cited evidence.

# Citations

- [CAPA Orchestration Agent Standard Operating Procedure](/documents/capa-orchestration-agent-sop.md)
- [Nonconformance Disposition & Material Review Board Authority Matrix](/documents/nonconformance-disposition-mrb-authority-matrix.md)
