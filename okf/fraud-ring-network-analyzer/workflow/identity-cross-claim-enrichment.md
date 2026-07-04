---
type: Workflow Stage
title: "Identity & Cross-Claim Enrichment"
description: "Cross-reference LexisNexis Risk Solutions risk_reports, mvr_records, and prefill_datasets to resolve aliased participants and confirm whether flagged claimants, drivers, and providers are truly the same real-world entity."
source_id: identity_cross_claim_enrichment
tags:
  - insurance
  - okf
  - brd
timestamp: "2026-07-04T00:00:00.000Z"
---

# Identity & Cross-Claim Enrichment

Cross-reference LexisNexis Risk Solutions risk_reports, mvr_records, and prefill_datasets to resolve aliased participants and confirm whether flagged claimants, drivers, and providers are truly the same real-world entity.

- **Mode:** sequential
- **Stage:** 2 of 5

## Tools

- [query_lexisnexis_risk_solutions_risk_reports](/tools/query-lexisnexis-risk-solutions-risk-reports.md)
- [lookup_fraud_ring_network_analyzer_authority_guide](/tools/lookup-fraud-ring-network-analyzer-authority-guide.md)

Next: [Ring Clustering & Severity Scoring](/workflow/ring-clustering-severity-scoring.md)
