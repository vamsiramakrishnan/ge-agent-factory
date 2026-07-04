---
type: Index
title: Query Capabilities
description: "The questions and requests this agent can answer, each with the tools it uses."
timestamp: "2026-07-04T00:00:00.000Z"
---

# Query Capabilities

- [Pull new and in_review fraud_alerts and their linked transaction_risk_scores from NICE Actimize (query_nice_actimize_fraud_alerts) and re-rank the analyst queue by fraud_risk_score, score_band, velocity_rule_triggered, and mule_account_indicator so the Fraud Operations Analyst works the highest-risk alerts first instead of FIFO.](/queries/alert-intake-queue-prioritization.md)
- [Correlate the account_number against BigQuery analytics_events and historical_metrics (query_bigquery_analytics_events) and cross-check open ServiceNow tickets (query_servicenow_tickets) for recent contact-center interactions or account-servicing activity on the same account.](/queries/context-enrichment.md)
- [Classify the alert_type (card_not_present, account_takeover, elder_financial_exploitation, business_email_compromise_wire, p2p_payment_scam, check_kiting, counterfeit_check) against amount_at_risk and reg_e_claim_filed to determine whether the pattern is a well-understood benign false_positive, needs investigation_cases opened, or trips a hard escalation gate.](/queries/typology-disposition-scoring.md)
- [Cite the governing sections of the Fraud Alert Triage Agent Banking Compliance Policy and the SAR Filing & Deadline Playbook (lookup_fraud_alert_triage_agent_compliance_policy) before any disposition, confirming at least two-system evidence and that no required record is stale beyond the 24-hour threshold.](/queries/policy-evidence-gating.md)
- [Execute action_nice_actimize_file with the disposition and generated_audit_trail, and route confirmed_fraud alerts or SAR-eligible investigation_cases to ServiceNow with a pre-built case file for the assigned investigator ahead of the filing_deadline_date.](/queries/disposition-filing-case-handoff.md)
