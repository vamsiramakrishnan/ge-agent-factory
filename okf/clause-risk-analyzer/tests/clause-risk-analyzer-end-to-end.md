---
type: Eval Scenario
title: Run the Clause Risk Analyzer workflow for the current period. Cite the releva...
description: "Run the Clause Risk Analyzer workflow for the current period. Cite the relevant source-system evidence and surface any escalations required."
source_id: "clause-risk-analyzer-end-to-end"
generation_status: inferred
tags:
  - procurement
  - okf
  - brd
timestamp: "2026-07-01T00:00:00.000Z"
---

# Run the Clause Risk Analyzer workflow for the current period. Cite the relevant source-system evidence and surface any escalations required.

## Validates

- [document-ingestion-parsing](/queries/document-ingestion-parsing.md)

## Mechanisms to call

- [query_icertis_contracts](/tools/query-icertis-contracts.md)
- [query_docusign_clm_contracts](/tools/query-docusign-clm-contracts.md)
- [query_legal_playbook_legal_playbook_records](/tools/query-legal-playbook-legal-playbook-records.md)
- [lookup_clause_risk_analyzer_policy_guide](/tools/lookup-clause-risk-analyzer-policy-guide.md)
- [action_icertis_recommend](/tools/action-icertis-recommend.md)

## Success rubric

Action recommend executed against Icertis, with audit-trail entry and Legal Procurement Counsel notified of outcomes.

# Citations

- [Clause Risk Analyzer Procurement Policy Guide](/documents/clause-risk-analyzer-policy-guide.md)
