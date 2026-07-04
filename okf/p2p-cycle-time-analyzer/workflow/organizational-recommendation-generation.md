---
type: Workflow Stage
title: Organizational Recommendation Generation
description: "LLM interprets process mining results and generates actionable narratives: 'Requisitions in Facilities take 3x longer — root cause: approval matrix requires VP sign-off for all facilities requests regardless of value. Recommendation: raise VP threshold from $0 to $10K to eliminate 60% of VP approvals.'"
source_id: organizational_recommendation_generation
tags:
  - procurement
  - okf
  - brd
timestamp: "2026-07-01T00:00:00.000Z"
---

# Organizational Recommendation Generation

LLM interprets process mining results and generates actionable narratives: 'Requisitions in Facilities take 3x longer — root cause: approval matrix requires VP sign-off for all facilities requests regardless of value. Recommendation: raise VP threshold from $0 to $10K to eliminate 60% of VP approvals.'

- **Mode:** sequential
- **Stage:** 3 of 4

## Tools

- [query_coupa_requisitions](/tools/query-coupa-requisitions.md)
- [action_sap_s_4hana_recommend](/tools/action-sap-s-4hana-recommend.md)

Next: [Dashboard & Report Distribution](/workflow/dashboard-report-distribution.md)
