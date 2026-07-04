---
type: Workflow Stage
title: "Risk Limit & Liquidity Buffer Cross-Check"
description: "Cross-check the emerging forecast against Murex MX.3 risk_measures (query_murex_mx_3_risk_measures) — limit_utilization_pct, lcr_ratio, and nsfr_ratio readings — to confirm the recommended money-market action does not itself push a desk over its approved_limit_value or the LCR floor."
source_id: risk_limit_liquidity_buffer_cross_check
tags:
  - banking
  - okf
  - brd
timestamp: "2026-07-04T00:00:00.000Z"
---

# Risk Limit & Liquidity Buffer Cross-Check

Cross-check the emerging forecast against Murex MX.3 risk_measures (query_murex_mx_3_risk_measures) — limit_utilization_pct, lcr_ratio, and nsfr_ratio readings — to confirm the recommended money-market action does not itself push a desk over its approved_limit_value or the LCR floor.

- **Mode:** sequential
- **Stage:** 3 of 5

## Tools

- [query_murex_mx_3_trades](/tools/query-murex-mx-3-trades.md)
- [lookup_intraday_liquidity_forecasting_engine_compliance_policy](/tools/lookup-intraday-liquidity-forecasting-engine-compliance-policy.md)
- [action_murex_mx_3_publish](/tools/action-murex-mx-3-publish.md)

Next: [Compliance & Model Governance Validation](/workflow/compliance-model-governance-validation.md)
