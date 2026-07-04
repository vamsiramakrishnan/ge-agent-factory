---
type: Proof Obligation
title: "Golden eval obligation — Run the IT Control Testing Agent workflow for the current period. Cite the relevant source-system evidence and surface any escalations required."
description: golden eval proof obligation
source_id: "eval-it-control-testing-agent-end-to-end"
tags:
  - it
  - okf
  - brd
timestamp: "2026-07-01T00:00:00.000Z"
source_kind: generationSpec
source_path: behaviorContract.goldenEvals.0
generation_status: generated
ge_status: generated
---

# Golden eval obligation — Run the IT Control Testing Agent workflow for the current period. Cite the relevant source-system evidence and surface any escalations required.

- **Kind:** golden eval
- **Spec source:** behaviorContract.goldenEvals.0
- **Eval:** [it-control-testing-agent-end-to-end](/tests/it-control-testing-agent-end-to-end.md)


## Mechanisms

- [query_servicenow_grc_tickets](/tools/query-servicenow-grc-tickets.md)
- [query_rsa_archer_rsa_archer_records](/tools/query-rsa-archer-rsa-archer-records.md)
- [query_onetrust_onetrust_records](/tools/query-onetrust-onetrust-records.md)
- [query_bigquery_analytics_events](/tools/query-bigquery-analytics-events.md)
- [lookup_it_control_testing_agent_runbook](/tools/lookup-it-control-testing-agent-runbook.md)
- [action_servicenow_grc_generate](/tools/action-servicenow-grc-generate.md)

## Entities that must be referenced

- tickets
- rsa_archer_records
- onetrust_records
- analytics_events

## Forbidden behaviors

- do not invent KPI numbers
- do not skip the evidence_lookup step before any recommendation
- do not execute generate without two-system evidence

# Citations

- [it-control-testing-agent-runbook](/documents/it-control-testing-agent-runbook.md)
