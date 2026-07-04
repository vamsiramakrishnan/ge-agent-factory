---
type: Index
title: Query Capabilities
description: "The questions and requests this agent can answer, each with the tools it uses."
timestamp: "2026-07-04T00:00:00.000Z"
---

# Query Capabilities

- [Pull the triggering record from NICE Actimize fraud_alerts by alert_id and account_number, then bind it to any open investigation_cases row (matching subject_name or account) and prior banking_3_records history so the investigator opens with one bound case file instead of six disconnected screens.](/queries/alert-intake-case-binding.md)
- [Query NICE Actimize transaction_risk_scores for velocity_rule_triggered, geolocation_anomaly, and mule_account_indicator flags on the account, then reconcile against BigQuery analytics_events and historical_metrics to reconstruct the transaction flow and counterparty pattern against the customer's expected baseline.](/queries/transaction-counterparty-reconstruction.md)
- [Score the reconstructed activity against fraud_risk_score, score_band, and amount_at_risk for structuring, CTR-adjacent clustering, and typology codes (structuring, funnel_account, elder_exploitation_referral), gating every threshold call against the AML Alert Investigation Agent Banking Compliance Policy sections.](/queries/typology-threshold-screening.md)
- [Draft the structured case narrative for the bound investigation_cases record, citing compliance policy sections via lookup_aml_alert_investigation_agent_compliance_policy, and recommend a sar_decision (sar_filed, no_sar_warranted, pending_review, continuing_activity_supplemental) with evidence attached.](/queries/narrative-drafting-disposition-recommendation.md)
- [Execute action_nice_actimize_file to close or advance the case with a generated_audit_trail, or route escalations for structuring, stale evidence, or filing-deadline risk on investigation_cases.filing_deadline_date to the BSA officer with the file attached.](/queries/filing-escalation-audit-handoff.md)
