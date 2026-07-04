---
type: Query Capability
title: Cluster similar specifications across BUs and plants using NLP on structured ...
description: "Cluster similar specifications across BUs and plants using NLP on structured attributes — dimensions, materials, tolerances. Detect duplicates on structured fields. Score similarity confidence for borderline cases."
source_id: "nlp-clustering-duplicate-detection"
generation_status: inferred
tags:
  - procurement
  - okf
  - brd
timestamp: "2026-07-01T00:00:00.000Z"
---

# Cluster similar specifications across BUs and plants using NLP on structured attributes — dimensions, materials, tolerances. Detect duplicates on structured fields. Score similarity confidence for borderline cases.

## Tools used

- [query_sap_s_4hana_material_master_sap_s_4hana_material_master_records](/tools/query-sap-s-4hana-material-master-sap-s-4hana-material-master-records.md)
- [lookup_specification_standardization_agent_policy_guide](/tools/lookup-specification-standardization-agent-policy-guide.md)

## Runs in

- [nlp_clustering_duplicate_detection](/workflow/nlp-clustering-duplicate-detection.md)

## Evidence expected

- source_system_record
- document_reference

## Evals

- [Run the Specification Standardization Agent workflow for the current period. Cite the relevant source-system evidence and surface any escalations required.](/tests/specification-standardization-agent-end-to-end.md)

# Citations

- [Specification Standardization Agent Procurement Policy Guide](/documents/specification-standardization-agent-policy-guide.md)
