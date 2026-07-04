---
type: Query Capability
title: Score each clause against legal playbook thresholds. Classify deviation sever...
description: Score each clause against legal playbook thresholds. Classify deviation severity using historical negotiation outcome data and standard position comparison.
source_id: "deviation-scoring"
generation_status: inferred
tags:
  - procurement
  - okf
  - brd
timestamp: "2026-07-01T00:00:00.000Z"
---

# Score each clause against legal playbook thresholds. Classify deviation severity using historical negotiation outcome data and standard position comparison.

## Tools used

- [query_legal_playbook_legal_playbook_records](/tools/query-legal-playbook-legal-playbook-records.md)
- [lookup_clause_risk_analyzer_policy_guide](/tools/lookup-clause-risk-analyzer-policy-guide.md)

## Runs in

- [deviation_scoring](/workflow/deviation-scoring.md)

## Evidence expected

- source_system_record
- document_reference

## Evals

- [Run the Clause Risk Analyzer workflow for the current period. Cite the relevant source-system evidence and surface any escalations required.](/tests/clause-risk-analyzer-end-to-end.md)

# Citations

- [Clause Risk Analyzer Procurement Policy Guide](/documents/clause-risk-analyzer-policy-guide.md)
