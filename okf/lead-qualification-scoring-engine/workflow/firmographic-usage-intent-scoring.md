---
type: Workflow Stage
title: "Firmographic & Usage-Intent Scoring"
description: "Score the lead on service_type, rate_plan and product_bundle fit, tenure_months, and churn_risk_score signals, reconciling against any existing subscriber_accounts footprint for the same subscriber_key."
source_id: firmographic_usage_intent_scoring
tags:
  - telco
  - okf
  - brd
timestamp: "2026-07-04T00:00:00.000Z"
---

# Firmographic & Usage-Intent Scoring

Score the lead on service_type, rate_plan and product_bundle fit, tenure_months, and churn_risk_score signals, reconciling against any existing subscriber_accounts footprint for the same subscriber_key.

- **Mode:** sequential
- **Stage:** 2 of 5

## Tools

- [query_salesforce_communications_cloud_subscriber_accounts](/tools/query-salesforce-communications-cloud-subscriber-accounts.md)
- [lookup_lead_qualification_scoring_engine_assurance_runbook](/tools/lookup-lead-qualification-scoring-engine-assurance-runbook.md)

Next: [Historical Benchmark & Conversion Analytics](/workflow/historical-benchmark-conversion-analytics.md)
