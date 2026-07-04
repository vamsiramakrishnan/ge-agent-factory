---
type: Query Capability
title: "Gemini synthesizes 5 years of contract history, prior negotiation rounds, mar..."
description: "Gemini synthesizes 5 years of contract history, prior negotiation rounds, market conditions, and supplier financials into a structured playbook. Reasons about BATNA strength and drafts trade-off matrices with counter-offer scenarios."
source_id: "playbook-synthesis"
generation_status: inferred
tags:
  - procurement
  - okf
  - brd
timestamp: "2026-07-01T00:00:00.000Z"
---

# Gemini synthesizes 5 years of contract history, prior negotiation rounds, market conditions, and supplier financials into a structured playbook. Reasons about BATNA strength and drafts trade-off matrices with counter-offer scenarios.

## Tools used

- [query_market_intel_market_intel_records](/tools/query-market-intel-market-intel-records.md)
- [lookup_negotiation_prep_agent_policy_guide](/tools/lookup-negotiation-prep-agent-policy-guide.md)

## Runs in

- [playbook_synthesis](/workflow/playbook-synthesis.md)

## Evidence expected

- source_system_record
- document_reference

## Evals

- [Run the Negotiation Prep Agent workflow for the current period. Cite the relevant source-system evidence and surface any escalations required.](/tests/negotiation-prep-agent-end-to-end.md)

# Citations

- [Negotiation Prep Agent Procurement Policy Guide](/documents/negotiation-prep-agent-policy-guide.md)
