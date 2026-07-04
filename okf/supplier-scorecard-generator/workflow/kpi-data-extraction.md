---
type: Workflow Stage
title: KPI Data Extraction
description: "Pull quality PPM from SAP QM, OTIF from MM, and pricing from FI. Aggregate procurement data from Coupa. Consolidate into BigQuery for unified KPI computation."
source_id: kpi_data_extraction
tags:
  - procurement
  - okf
  - brd
timestamp: "2026-07-01T00:00:00.000Z"
---

# KPI Data Extraction

Pull quality PPM from SAP QM, OTIF from MM, and pricing from FI. Aggregate procurement data from Coupa. Consolidate into BigQuery for unified KPI computation.

- **Mode:** sequential
- **Stage:** 1 of 4

## Tools

- [query_sap_s_4hana_qm_mm_sap_s_4hana_qm_mm_records](/tools/query-sap-s-4hana-qm-mm-sap-s-4hana-qm-mm-records.md)
- [query_coupa_requisitions](/tools/query-coupa-requisitions.md)
- [query_bigquery_analytics_events](/tools/query-bigquery-analytics-events.md)
- [lookup_supplier_scorecard_generator_policy_guide](/tools/lookup-supplier-scorecard-generator-policy-guide.md)
- [action_sap_s_4hana_qm_mm_generate](/tools/action-sap-s-4hana-qm-mm-generate.md)

Next: [Scoring & Benchmarking](/workflow/scoring-benchmarking.md)
