---
type: Workflow Stage
title: "Effectivity & build-risk scoring"
description: Compare engineering_change_orders effectivity_date and effectivity_type against process_orders scheduled_start and material_stagings staging_due to flag parts with an imminent planned order still staged against a superseded bom_revisions record.
source_id: effectivity_build_risk_scoring
tags:
  - manufacturing
  - okf
  - brd
timestamp: "2026-07-04T00:00:00.000Z"
---

# Effectivity & build-risk scoring

Compare engineering_change_orders effectivity_date and effectivity_type against process_orders scheduled_start and material_stagings staging_due to flag parts with an imminent planned order still staged against a superseded bom_revisions record.

- **Mode:** sequential
- **Stage:** 4 of 6

## Tools

- [query_ptc_windchill_plm_engineering_change_orders](/tools/query-ptc-windchill-plm-engineering-change-orders.md)
- [query_sap_s_4hana_pp_process_orders](/tools/query-sap-s-4hana-pp-process-orders.md)

Next: [SOP and policy evidence gate](/workflow/sop-and-policy-evidence-gate.md)
