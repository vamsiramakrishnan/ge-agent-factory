---
type: Query Capability
title: "Enriched, classified, and entity-resolved spend data loaded into BigQuery dim..."
description: "Enriched, classified, and entity-resolved spend data loaded into BigQuery dimensional model for downstream analytics and dashboarding."
source_id: "spend-cube-load"
generation_status: inferred
tags:
  - procurement
  - okf
  - brd
timestamp: "2026-07-01T00:00:00.000Z"
---

# Enriched, classified, and entity-resolved spend data loaded into BigQuery dimensional model for downstream analytics and dashboarding.

## Tools used

- [lookup_spend_classification_enrichment_policy_guide](/tools/lookup-spend-classification-enrichment-policy-guide.md)
- [action_sap_s_4hana_fi_mm_enrich](/tools/action-sap-s-4hana-fi-mm-enrich.md)

## Runs in

- [spend_cube_load](/workflow/spend-cube-load.md)

## Evidence expected

- document_reference
- api_response
- generated_audit_trail

## Evals

- [Run the Spend Classification & Enrichment workflow for the current period. Cite the relevant source-system evidence and surface any escalations required.](/tests/spend-classification-enrichment-end-to-end.md)

# Citations

- [Spend Classification & Enrichment Procurement Policy Guide](/documents/spend-classification-enrichment-policy-guide.md)
