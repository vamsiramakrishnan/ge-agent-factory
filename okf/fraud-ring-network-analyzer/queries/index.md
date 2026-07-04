---
type: Index
title: Query Capabilities
description: "The questions and requests this agent can answer, each with the tools it uses."
timestamp: "2026-07-04T00:00:00.000Z"
---

# Query Capabilities

- [Query fraud_screening_scores and network_link_indicators from FRISS Fraud Detection to surface newly flagged shared bank accounts, phone numbers, addresses, and provider/tow-operator links across open claims.](/queries/nightly-link-detection-sweep.md)
- [Cross-reference LexisNexis Risk Solutions risk_reports, mvr_records, and prefill_datasets to resolve aliased participants and confirm whether flagged claimants, drivers, and providers are truly the same real-world entity.](/queries/identity-cross-claim-enrichment.md)
- [Score cluster velocity and claims_sharing_this_entity counts against BigQuery historical_metrics and cached_aggregates to distinguish an isolated coincidence from a choreographed, organized loss sequence.](/queries/ring-clustering-severity-scoring.md)
- [Cite the Fraud Ring Network Analyzer Authority & Referral Guide and the SIU Ring Consolidation Runbook before recommending which siu_referrals should be merged into a single SIU investigation.](/queries/authority-gated-case-consolidation.md)
- [Execute action_friss_fraud_detection_file to update siu_referrals status in FRISS Fraud Detection with a full audit trail, and route statutory-deadline or authority-scoped items to the SIU Manager.](/queries/referral-filing-audit-trail.md)
