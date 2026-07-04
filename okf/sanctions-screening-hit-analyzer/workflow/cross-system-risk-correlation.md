---
type: Workflow Stage
title: "Cross-System Risk Correlation"
description: "Query NICE Actimize fraud_alerts and investigation_cases for the same account_number or subject_name to surface linked typologies (structuring, TBML, terrorist financing) before the hit is dispositioned in isolation."
source_id: cross_system_risk_correlation
tags:
  - banking
  - okf
  - brd
timestamp: "2026-07-04T00:00:00.000Z"
---

# Cross-System Risk Correlation

Query NICE Actimize fraud_alerts and investigation_cases for the same account_number or subject_name to surface linked typologies (structuring, TBML, terrorist financing) before the hit is dispositioned in isolation.

- **Mode:** sequential
- **Stage:** 3 of 6

## Tools

- [query_fenergo_clm_kyc_cases](/tools/query-fenergo-clm-kyc-cases.md)
- [query_nice_actimize_fraud_alerts](/tools/query-nice-actimize-fraud-alerts.md)

Next: [Severity Scoring & Disposition Recommendation](/workflow/severity-scoring-disposition-recommendation.md)
