---
type: Proof Obligation
title: "Golden eval obligation — Run the Strategic Initiative Q&A workflow for the current period. Cite the relevant source-system evidence and surface any escalations required."
description: golden eval proof obligation
source_id: "eval-strategic-initiative-q-a-end-to-end"
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

# Golden eval obligation — Run the Strategic Initiative Q&A workflow for the current period. Cite the relevant source-system evidence and surface any escalations required.

- **Kind:** golden eval
- **Spec source:** behaviorContract.goldenEvals.0
- **Eval:** [strategic-initiative-q-a-end-to-end](/tests/strategic-initiative-q-a-end-to-end.md)


## Mechanisms

- [query_confluence_pages](/tools/query-confluence-pages.md)
- [query_jira_issues](/tools/query-jira-issues.md)
- [query_bigquery_analytics_events](/tools/query-bigquery-analytics-events.md)
- [lookup_strategic_initiative_q_a_runbook](/tools/lookup-strategic-initiative-q-a-runbook.md)

## Entities that must be referenced

- pages
- issues
- analytics_events

## Forbidden behaviors

- do not invent KPI numbers
- do not skip the evidence_lookup step before any recommendation
- do not act on single-system evidence

# Citations

- [strategic-initiative-q-a-runbook](/documents/strategic-initiative-q-a-runbook.md)
