---
type: Proof Obligation
title: "Golden eval obligation — Run the Regulatory Filing Orchestrator workflow for the current period. Cite the relevant source-system evidence and surface any escalations required."
description: golden eval proof obligation
source_id: "eval-regulatory-filing-orchestrator-end-to-end"
tags:
  - finance
  - okf
  - brd
timestamp: "2026-07-01T00:00:00.000Z"
source_kind: generationSpec
source_path: behaviorContract.goldenEvals.0
generation_status: generated
ge_status: generated
---

# Golden eval obligation — Run the Regulatory Filing Orchestrator workflow for the current period. Cite the relevant source-system evidence and surface any escalations required.

- **Kind:** golden eval
- **Spec source:** behaviorContract.goldenEvals.0
- **Eval:** [regulatory-filing-orchestrator-end-to-end](/tests/regulatory-filing-orchestrator-end-to-end.md)


## Mechanisms

- [query_workiva_workiva_records](/tools/query-workiva-workiva-records.md)
- [query_sap_s_4hana_fi_gl_entries](/tools/query-sap-s-4hana-fi-gl-entries.md)
- [query_sec_edgar_sec_edgar_records](/tools/query-sec-edgar-sec-edgar-records.md)
- [query_bigquery_analytics_events](/tools/query-bigquery-analytics-events.md)
- [lookup_regulatory_filing_orchestrator_controls_playbook](/tools/lookup-regulatory-filing-orchestrator-controls-playbook.md)

## Entities that must be referenced

- workiva_records
- gl_entries
- sec_edgar_records
- analytics_events

## Forbidden behaviors

- do not invent KPI numbers
- do not skip the evidence_lookup step before any recommendation
- do not act on single-system evidence

# Citations

- [regulatory-filing-orchestrator-controls-playbook](/documents/regulatory-filing-orchestrator-controls-playbook.md)
