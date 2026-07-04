---
type: Query Capability
title: "LLM reads PO descriptions to understand what is actually being bought — 'offi..."
description: "LLM reads PO descriptions to understand what is actually being bought — 'office supplies' might really be lab consumables that belong in a scientific supplier catalog"
source_id: "llm-reads-po-descriptions-to-understand-what-is-actually-being-b"
generation_status: inferred
tags:
  - procurement
  - okf
  - brd
timestamp: "2026-07-01T00:00:00.000Z"
---

# LLM reads PO descriptions to understand what is actually being bought — 'office supplies' might really be lab consumables that belong in a scientific supplier catalog

## Tools used

- [query_bigquery_analytics_events](/tools/query-bigquery-analytics-events.md)
- [query_sap_s_4hana_transactions](/tools/query-sap-s-4hana-transactions.md)
- [query_coupa_requisitions](/tools/query-coupa-requisitions.md)
- [lookup_tail_spend_classifier_opportunity_finder_policy_guide](/tools/lookup-tail-spend-classifier-opportunity-finder-policy-guide.md)

## Evidence expected

- sql_result
- source_system_record
- document_reference

## Evals

- [Run the Tail Spend Classifier & Opportunity Finder workflow for the current period. Cite the relevant source-system evidence and surface any escalations required.](/tests/tail-spend-classifier-opportunity-finder-end-to-end.md)

# Citations

- [Tail Spend Classifier & Opportunity Finder Procurement Policy Guide](/documents/tail-spend-classifier-opportunity-finder-policy-guide.md)
