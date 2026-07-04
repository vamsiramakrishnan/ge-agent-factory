---
type: Query Capability
title: Pull internal KPI data from BigQuery and retrieve benchmark datasets from Hac...
description: "Pull internal KPI data from BigQuery and retrieve benchmark datasets from Hackett, CAPS, Gartner, and Ardent Partners. Align metrics across different benchmark methodologies for comparable analysis."
source_id: "benchmark-data-retrieval"
generation_status: inferred
tags:
  - procurement
  - okf
  - brd
timestamp: "2026-07-01T00:00:00.000Z"
---

# Pull internal KPI data from BigQuery and retrieve benchmark datasets from Hackett, CAPS, Gartner, and Ardent Partners. Align metrics across different benchmark methodologies for comparable analysis.

## Tools used

- [query_hackett_hackett_records](/tools/query-hackett-hackett-records.md)
- [query_caps_caps_records](/tools/query-caps-caps-records.md)
- [query_gartner_gartner_records](/tools/query-gartner-gartner-records.md)
- [query_ardent_partners_ardent_partners_records](/tools/query-ardent-partners-ardent-partners-records.md)
- [lookup_benchmark_intelligence_agent_policy_guide](/tools/lookup-benchmark-intelligence-agent-policy-guide.md)
- [action_hackett_generate](/tools/action-hackett-generate.md)

## Runs in

- [benchmark_data_retrieval](/workflow/benchmark-data-retrieval.md)

## Evidence expected

- source_system_record
- document_reference
- api_response
- generated_audit_trail

## Evals

- [Run the Benchmark Intelligence Agent workflow for the current period. Cite the relevant source-system evidence and surface any escalations required.](/tests/benchmark-intelligence-agent-end-to-end.md)

# Citations

- [Benchmark Intelligence Agent Procurement Policy Guide](/documents/benchmark-intelligence-agent-policy-guide.md)
