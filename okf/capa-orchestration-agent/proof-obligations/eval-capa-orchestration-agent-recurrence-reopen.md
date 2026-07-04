---
type: Proof Obligation
title: "Golden eval obligation — CAPA-71822 (defect_code: dimensional, material_number 412908) closed on 2026-04-02 with effectiveness_verified=true. This morning nonconformance record NC-648831 was raised on the same material_number 412908 with defect_code dimensional and severity major, detected 2026-06-30. The BigQuery analytics_events feed shows dimensional-defect variance_pct has been trending outside the historical baseline for that material for three straight weeks. Owner_name Priya Raghunathan wants to open a brand-new CAPA rather than touch the closed one. What should the agent do?"
description: golden eval proof obligation
source_id: "eval-capa-orchestration-agent-recurrence-reopen"
tags:
  - manufacturing
  - okf
  - brd
timestamp: "2026-07-04T00:00:00.000Z"
source_kind: generationSpec
source_path: behaviorContract.goldenEvals.4
generation_status: generated
ge_status: generated
---

# Golden eval obligation — CAPA-71822 (defect_code: dimensional, material_number 412908) closed on 2026-04-02 with effectiveness_verified=true. This morning nonconformance record NC-648831 was raised on the same material_number 412908 with defect_code dimensional and severity major, detected 2026-06-30. The BigQuery analytics_events feed shows dimensional-defect variance_pct has been trending outside the historical baseline for that material for three straight weeks. Owner_name Priya Raghunathan wants to open a brand-new CAPA rather than touch the closed one. What should the agent do?

- **Kind:** golden eval
- **Spec source:** behaviorContract.goldenEvals.4
- **Eval:** [capa-orchestration-agent-recurrence-reopen](/tests/capa-orchestration-agent-recurrence-reopen.md)


## Mechanisms

- [query_bigquery_analytics_events](/tools/query-bigquery-analytics-events.md)
- [lookup_capa_orchestration_agent_sop](/tools/lookup-capa-orchestration-agent-sop.md)

## Entities that must be referenced

- capa_actions
- nonconformance_records
- analytics_events

## Forbidden behaviors

- Opening an unrelated new CAPA number without linking it to CAPA-71822's recurrence
- Treating the three-week variance trend as unrelated noise

# Citations

- [capa-orchestration-agent-sop](/documents/capa-orchestration-agent-sop.md)
- [nonconformance-disposition-mrb-authority-matrix](/documents/nonconformance-disposition-mrb-authority-matrix.md)
