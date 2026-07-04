---
type: Eval Scenario
title: Run the Vendor Master Data Manager workflow for the current period. Cite the ...
description: "Run the Vendor Master Data Manager workflow for the current period. Cite the relevant source-system evidence and surface any escalations required."
source_id: "vendor-master-data-manager-end-to-end"
generation_status: inferred
tags:
  - finance
  - okf
  - brd
timestamp: "2026-07-01T00:00:00.000Z"
---

# Run the Vendor Master Data Manager workflow for the current period. Cite the relevant source-system evidence and surface any escalations required.

## Validates

- [data-collection-validation](/queries/data-collection-validation.md)

## Mechanisms to call

- [query_sap_s_4hana_transactions](/tools/query-sap-s-4hana-transactions.md)
- [query_coupa_requisitions](/tools/query-coupa-requisitions.md)
- [query_d_b_d_b_records](/tools/query-d-b-d-b-records.md)
- [query_irs_tin_matching_irs_tin_matching_records](/tools/query-irs-tin-matching-irs-tin-matching-records.md)
- [lookup_vendor_master_data_manager_controls_playbook](/tools/lookup-vendor-master-data-manager-controls-playbook.md)
- [action_sap_s_4hana_onboard](/tools/action-sap-s-4hana-onboard.md)

## Success rubric

Action onboard executed against SAP S/4HANA, with audit-trail entry and AP Manager notified of outcomes.

# Citations

- [Vendor Master Data Manager Controls Playbook](/documents/vendor-master-data-manager-controls-playbook.md)
