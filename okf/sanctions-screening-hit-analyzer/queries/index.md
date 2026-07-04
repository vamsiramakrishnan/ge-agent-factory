---
type: Index
title: Query Capabilities
description: "The questions and requests this agent can answer, each with the tools it uses."
timestamp: "2026-07-04T00:00:00.000Z"
---

# Query Capabilities

- [Ingest new screening_results rows from Fenergo CLM as OFAC SDN, EU Consolidated, UN 1267 Committee, HMT UK, PEP, and adverse-media list hits post; place the associated payment or account action under interdiction hold pending disposition.](/queries/list-hit-intake-interdiction-hold.md)
- [Compare screened_party_name and fuzzy_match_score in screening_results against legal_name, entity_type, and country_of_domicile on the linked entity_profiles and kyc_cases records in Fenergo CLM to establish or rule out a true match.](/queries/identity-match-verification.md)
- [Query NICE Actimize fraud_alerts and investigation_cases for the same account_number or subject_name to surface linked typologies (structuring, TBML, terrorist financing) before the hit is dispositioned in isolation.](/queries/cross-system-risk-correlation.md)
- [Score true-match likelihood against historical_metrics and analytics_events baselines in BigQuery, and cite the Sanctions Screening Hit Analyzer Banking Compliance Policy section that governs the proposed disposition (cleared, blocked_property, payment_rejected, pending).](/queries/severity-scoring-disposition-recommendation.md)
- [For true_match or fincen_314a_match hits, execute action_fenergo_clm_escalate to route the case to the sanctions compliance officer and keep the interdiction hold; for cleared false positives, release the payment with a standardized, auditable rationale.](/queries/escalation-payment-release-decision.md)
- [Write the disposition, citation anchors, and audit_record_id back to Fenergo CLM and refresh cached_aggregates in BigQuery so the Screening hits auto-adjudicated and average hit disposition time KPIs reflect the outcome.](/queries/audit-trail-kpi-reporting.md)
