---
type: Eval Scenario
title: "Run the Spend Cube Builder & Enrichment workflow for the current period. Cite..."
description: "Run the Spend Cube Builder & Enrichment workflow for the current period. Cite the relevant source-system evidence and surface any escalations required."
source_id: "spend-cube-builder-enrichment-end-to-end"
generation_status: inferred
tags:
  - procurement
  - okf
  - brd
timestamp: "2026-07-01T00:00:00.000Z"
---

# Run the Spend Cube Builder & Enrichment workflow for the current period. Cite the relevant source-system evidence and surface any escalations required.

## Validates

- [ml-classification-entity-resolution](/queries/ml-classification-entity-resolution.md)

## Mechanisms to call

- [query_sap_s_4hana_transactions](/tools/query-sap-s-4hana-transactions.md)
- [query_coupa_requisitions](/tools/query-coupa-requisitions.md)
- [query_ariba_ariba_records](/tools/query-ariba-ariba-records.md)
- [query_spendhq_spendhq_records](/tools/query-spendhq-spendhq-records.md)
- [lookup_spend_cube_builder_enrichment_policy_guide](/tools/lookup-spend-cube-builder-enrichment-policy-guide.md)
- [action_sap_s_4hana_enrich](/tools/action-sap-s-4hana-enrich.md)

## Success rubric

Action enrich executed against SAP S/4HANA, with audit-trail entry and Procurement Analytics Lead notified of outcomes.

# Citations

- [Spend Cube Builder & Enrichment Procurement Policy Guide](/documents/spend-cube-builder-enrichment-policy-guide.md)
