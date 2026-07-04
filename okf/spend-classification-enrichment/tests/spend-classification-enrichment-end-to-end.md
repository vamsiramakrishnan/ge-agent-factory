---
type: Eval Scenario
title: "Run the Spend Classification & Enrichment workflow for the current period. Ci..."
description: "Run the Spend Classification & Enrichment workflow for the current period. Cite the relevant source-system evidence and surface any escalations required."
source_id: "spend-classification-enrichment-end-to-end"
generation_status: inferred
tags:
  - procurement
  - okf
  - brd
timestamp: "2026-07-01T00:00:00.000Z"
---

# Run the Spend Classification & Enrichment workflow for the current period. Cite the relevant source-system evidence and surface any escalations required.

## Validates

- [data-extraction](/queries/data-extraction.md)

## Mechanisms to call

- [query_sap_s_4hana_fi_mm_gl_entries](/tools/query-sap-s-4hana-fi-mm-gl-entries.md)
- [query_coupa_requisitions](/tools/query-coupa-requisitions.md)
- [query_spendhq_spendhq_records](/tools/query-spendhq-spendhq-records.md)
- [query_sievo_sievo_records](/tools/query-sievo-sievo-records.md)
- [lookup_spend_classification_enrichment_policy_guide](/tools/lookup-spend-classification-enrichment-policy-guide.md)
- [action_sap_s_4hana_fi_mm_enrich](/tools/action-sap-s-4hana-fi-mm-enrich.md)

## Success rubric

Action enrich executed against SAP S/4HANA FI/MM, with audit-trail entry and Procurement Analytics Lead notified of outcomes.

# Citations

- [Spend Classification & Enrichment Procurement Policy Guide](/documents/spend-classification-enrichment-policy-guide.md)
