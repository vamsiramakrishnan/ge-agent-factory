---
type: Workflow Stage
title: "Spec & Control-Limit Screening"
description: "Compare each quality_checks measured_value and cpk against lower_spec_limit/upper_spec_limit, and check the inspection_lots aql_level, sample_size, and skip_lot flag, to isolate any characteristic reading outside its control limit before touching usage_decision."
source_id: spec_control_limit_screening
tags:
  - manufacturing
  - okf
  - brd
timestamp: "2026-07-04T00:00:00.000Z"
---

# Spec & Control-Limit Screening

Compare each quality_checks measured_value and cpk against lower_spec_limit/upper_spec_limit, and check the inspection_lots aql_level, sample_size, and skip_lot flag, to isolate any characteristic reading outside its control limit before touching usage_decision.

- **Mode:** sequential
- **Stage:** 2 of 5

## Tools

- [query_sap_s_4hana_qm_inspection_lots](/tools/query-sap-s-4hana-qm-inspection-lots.md)

Next: [NC/CAPA Cross-Reference](/workflow/nc-capa-cross-reference.md)
