---
type: Workflow Stage
title: Spec Extraction
description: Extract material master descriptions and specifications from SAP S/4HANA across all BUs and plants. Pull engineering drawings and revision history from PLM systems. Normalize into comparable format.
source_id: spec_extraction
tags:
  - procurement
  - okf
  - brd
timestamp: "2026-07-01T00:00:00.000Z"
---

# Spec Extraction

Extract material master descriptions and specifications from SAP S/4HANA across all BUs and plants. Pull engineering drawings and revision history from PLM systems. Normalize into comparable format.

- **Mode:** sequential
- **Stage:** 1 of 3

## Tools

- [query_sap_s_4hana_material_master_sap_s_4hana_material_master_records](/tools/query-sap-s-4hana-material-master-sap-s-4hana-material-master-records.md)
- [query_plm_systems_plm_systems_records](/tools/query-plm-systems-plm-systems-records.md)
- [query_engineering_drawings_engineering_drawings_records](/tools/query-engineering-drawings-engineering-drawings-records.md)
- [lookup_specification_standardization_agent_policy_guide](/tools/lookup-specification-standardization-agent-policy-guide.md)

Next: [NLP Clustering & Duplicate Detection](/workflow/nlp-clustering-duplicate-detection.md)
