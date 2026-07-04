---
type: Workflow Stage
title: "Trend & Loss Development Selection"
description: "Retrieve Verisk ISO ERC loss_cost_benchmarks and circular_updates to select advisory trend and development factors, reconciling them against the prior filing's selections recorded in insurance_3_records."
source_id: trend_loss_development_selection
tags:
  - insurance
  - okf
  - brd
timestamp: "2026-07-04T00:00:00.000Z"
---

# Trend & Loss Development Selection

Retrieve Verisk ISO ERC loss_cost_benchmarks and circular_updates to select advisory trend and development factors, reconciling them against the prior filing's selections recorded in insurance_3_records.

- **Mode:** sequential
- **Stage:** 2 of 5

## Tools

- [query_verisk_iso_erc_loss_cost_benchmarks](/tools/query-verisk-iso-erc-loss-cost-benchmarks.md)
- [query_insurance_3_insurance_3_records](/tools/query-insurance-3-insurance-3-records.md)
- [lookup_rate_indication_preparation_engine_authority_guide](/tools/lookup-rate-indication-preparation-engine-authority-guide.md)
- [action_insurance_3_generate](/tools/action-insurance-3-generate.md)

Next: [Territory & Relativity Review](/workflow/territory-relativity-review.md)
