---
type: Workflow Stage
title: Benchmark Data Retrieval
description: "Pull internal KPI data from BigQuery and retrieve benchmark datasets from Hackett, CAPS, Gartner, and Ardent Partners. Align metrics across different benchmark methodologies for comparable analysis."
source_id: benchmark_data_retrieval
tags:
  - procurement
  - okf
  - brd
timestamp: "2026-07-01T00:00:00.000Z"
---

# Benchmark Data Retrieval

Pull internal KPI data from BigQuery and retrieve benchmark datasets from Hackett, CAPS, Gartner, and Ardent Partners. Align metrics across different benchmark methodologies for comparable analysis.

- **Mode:** sequential
- **Stage:** 1 of 3

## Tools

- [query_hackett_hackett_records](/tools/query-hackett-hackett-records.md)
- [query_caps_caps_records](/tools/query-caps-caps-records.md)
- [query_gartner_gartner_records](/tools/query-gartner-gartner-records.md)
- [query_ardent_partners_ardent_partners_records](/tools/query-ardent-partners-ardent-partners-records.md)
- [lookup_benchmark_intelligence_agent_policy_guide](/tools/lookup-benchmark-intelligence-agent-policy-guide.md)
- [action_hackett_generate](/tools/action-hackett-generate.md)

Next: [Peer Comparison & Gap Scoring](/workflow/peer-comparison-gap-scoring.md)
