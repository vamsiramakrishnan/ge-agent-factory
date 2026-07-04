---
type: Query Capability
title: Price trend analysis across contract periods. Concession pattern tracking fro...
description: Price trend analysis across contract periods. Concession pattern tracking from historical negotiations. ZOPA estimation based on market rates and supplier cost structure indicators.
source_id: "price-concession-analysis"
generation_status: inferred
tags:
  - procurement
  - okf
  - brd
timestamp: "2026-07-01T00:00:00.000Z"
---

# Price trend analysis across contract periods. Concession pattern tracking from historical negotiations. ZOPA estimation based on market rates and supplier cost structure indicators.

## Tools used

- [query_market_intel_market_intel_records](/tools/query-market-intel-market-intel-records.md)
- [lookup_negotiation_prep_agent_policy_guide](/tools/lookup-negotiation-prep-agent-policy-guide.md)

## Runs in

- [price_concession_analysis](/workflow/price-concession-analysis.md)

## Evidence expected

- source_system_record
- document_reference

## Evals

- [Run the Negotiation Prep Agent workflow for the current period. Cite the relevant source-system evidence and surface any escalations required.](/tests/negotiation-prep-agent-end-to-end.md)

# Citations

- [Negotiation Prep Agent Procurement Policy Guide](/documents/negotiation-prep-agent-policy-guide.md)
