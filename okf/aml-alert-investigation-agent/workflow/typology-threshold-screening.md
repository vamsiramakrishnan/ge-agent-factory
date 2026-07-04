---
type: Workflow Stage
title: "Typology & Threshold Screening"
description: "Score the reconstructed activity against fraud_risk_score, score_band, and amount_at_risk for structuring, CTR-adjacent clustering, and typology codes (structuring, funnel_account, elder_exploitation_referral), gating every threshold call against the AML Alert Investigation Agent Banking Compliance Policy sections."
source_id: typology_threshold_screening
tags:
  - banking
  - okf
  - brd
timestamp: "2026-07-04T00:00:00.000Z"
---

# Typology & Threshold Screening

Score the reconstructed activity against fraud_risk_score, score_band, and amount_at_risk for structuring, CTR-adjacent clustering, and typology codes (structuring, funnel_account, elder_exploitation_referral), gating every threshold call against the AML Alert Investigation Agent Banking Compliance Policy sections.

- **Mode:** sequential
- **Stage:** 3 of 5

## Tools

- [query_nice_actimize_fraud_alerts](/tools/query-nice-actimize-fraud-alerts.md)
- [query_banking_3_banking_3_records](/tools/query-banking-3-banking-3-records.md)
- [lookup_aml_alert_investigation_agent_compliance_policy](/tools/lookup-aml-alert-investigation-agent-compliance-policy.md)

Next: [Narrative Drafting & Disposition Recommendation](/workflow/narrative-drafting-disposition-recommendation.md)
