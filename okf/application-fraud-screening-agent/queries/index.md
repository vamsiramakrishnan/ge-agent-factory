---
type: Index
title: Query Capabilities
description: "The questions and requests this agent can answer, each with the tools it uses."
timestamp: "2026-07-04T00:00:00.000Z"
---

# Query Capabilities

- [Score every incoming application at quote and bind through FRISS Fraud Detection's fraud_screening_scores model, capturing score_band, top_indicator, and iso_claimsearch_match_count before the application can advance to underwriting review.](/queries/new-business-intake-friss-screening.md)
- [Pull LexisNexis Risk Solutions prefill_datasets and mvr_records to confirm garaging address, undisclosed operators, and license_status against the applicant's stated facts, flagging any prefill_datasets match_confidence that falls below the verification threshold.](/queries/lexis-nexis-household-mvr-verification.md)
- [Correlate FRISS Fraud Detection network_link_indicators (shared address, phone, bank account) with BigQuery analytics_events and historical_metrics to detect recycled identities and agency-level rate-evasion clusters by producer.](/queries/network-link-producer-cluster-analysis.md)
- [Validate every finding against the Application Fraud Screening Agent Authority & Referral Guide and the producer rate-evasion playbook before recommending hold, decline, or referral, citing the governing section anchors.](/queries/authority-gated-evidence-review.md)
- [Execute the FRISS Fraud Detection escalate action to open a siu_referrals record with a full audit trail, and hand off cases meeting state mandatory-reporting thresholds to the SIU compliance manager.](/queries/siu-referral-escalation-audit.md)
