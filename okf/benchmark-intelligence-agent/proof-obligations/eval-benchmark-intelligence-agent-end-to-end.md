---
type: Proof Obligation
title: "Golden eval obligation — Run the Benchmark Intelligence Agent workflow for the current period. Cite the relevant source-system evidence and surface any escalations required."
description: golden eval proof obligation
source_id: "eval-benchmark-intelligence-agent-end-to-end"
tags:
  - procurement
  - okf
  - brd
timestamp: "2026-07-01T00:00:00.000Z"
source_kind: generationSpec
source_path: behaviorContract.goldenEvals.0
generation_status: generated
ge_status: generated
---

# Golden eval obligation — Run the Benchmark Intelligence Agent workflow for the current period. Cite the relevant source-system evidence and surface any escalations required.

- **Kind:** golden eval
- **Spec source:** behaviorContract.goldenEvals.0
- **Eval:** [benchmark-intelligence-agent-end-to-end](/tests/benchmark-intelligence-agent-end-to-end.md)


## Mechanisms

- [query_hackett_hackett_records](/tools/query-hackett-hackett-records.md)
- [query_caps_caps_records](/tools/query-caps-caps-records.md)
- [query_gartner_gartner_records](/tools/query-gartner-gartner-records.md)
- [query_ardent_partners_ardent_partners_records](/tools/query-ardent-partners-ardent-partners-records.md)
- [lookup_benchmark_intelligence_agent_policy_guide](/tools/lookup-benchmark-intelligence-agent-policy-guide.md)
- [action_hackett_generate](/tools/action-hackett-generate.md)

## Entities that must be referenced

- hackett_records
- caps_records
- gartner_records
- ardent_partners_records
- analytics_events

## Forbidden behaviors

- do not invent KPI numbers
- do not skip the evidence_lookup step before any recommendation
- do not execute generate without two-system evidence

# Citations

- [benchmark-intelligence-agent-policy-guide](/documents/benchmark-intelligence-agent-policy-guide.md)
