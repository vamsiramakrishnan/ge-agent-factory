---
type: Eval Scenario
title: Run the Benchmark Intelligence Agent workflow for the current period. Cite th...
description: "Run the Benchmark Intelligence Agent workflow for the current period. Cite the relevant source-system evidence and surface any escalations required."
source_id: "benchmark-intelligence-agent-end-to-end"
generation_status: inferred
tags:
  - procurement
  - okf
  - brd
timestamp: "2026-07-01T00:00:00.000Z"
---

# Run the Benchmark Intelligence Agent workflow for the current period. Cite the relevant source-system evidence and surface any escalations required.

## Validates

- [benchmark-data-retrieval](/queries/benchmark-data-retrieval.md)

## Mechanisms to call

- [query_hackett_hackett_records](/tools/query-hackett-hackett-records.md)
- [query_caps_caps_records](/tools/query-caps-caps-records.md)
- [query_gartner_gartner_records](/tools/query-gartner-gartner-records.md)
- [query_ardent_partners_ardent_partners_records](/tools/query-ardent-partners-ardent-partners-records.md)
- [lookup_benchmark_intelligence_agent_policy_guide](/tools/lookup-benchmark-intelligence-agent-policy-guide.md)
- [action_hackett_generate](/tools/action-hackett-generate.md)

## Success rubric

Action generate executed against Hackett, with audit-trail entry and Procurement Analytics Lead notified of outcomes.

# Citations

- [Benchmark Intelligence Agent Procurement Policy Guide](/documents/benchmark-intelligence-agent-policy-guide.md)
