---
type: Workflow Stage
title: LLM Enrichment
description: "Gemini handles the 15-20% of transactions ML classifiers cannot confidently classify — PO descriptions like 'per quote #4521' or 'project materials — see attachment.' Reads vendor context, cost center, and purchase history to reason about correct category. Resolves entity ambiguities requiring business judgment."
source_id: llm_enrichment
tags:
  - procurement
  - okf
  - brd
timestamp: "2026-07-01T00:00:00.000Z"
---

# LLM Enrichment

Gemini handles the 15-20% of transactions ML classifiers cannot confidently classify — PO descriptions like 'per quote #4521' or 'project materials — see attachment.' Reads vendor context, cost center, and purchase history to reason about correct category. Resolves entity ambiguities requiring business judgment.

- **Mode:** sequential
- **Stage:** 2 of 2

## Tools

- [query_sap_s_4hana_transactions](/tools/query-sap-s-4hana-transactions.md)
- [lookup_spend_cube_builder_enrichment_policy_guide](/tools/lookup-spend-cube-builder-enrichment-policy-guide.md)
- [action_sap_s_4hana_enrich](/tools/action-sap-s-4hana-enrich.md)
