---
type: Index
title: Query Capabilities
description: "The questions and requests this agent can answer, each with the tools it uses."
timestamp: "2026-07-04T00:00:00.000Z"
---

# Query Capabilities

- [Extract covenant_type, threshold_value, and test_frequency from executed loan agreements in nCino Loan Origination's covenant_records and loan_applications, building a per-facility testing calendar keyed to next_test_date.](/queries/covenant-calendar-extraction.md)
- [Ingest incoming borrower financials against credit_memos and loan_applications DSCR/LTV data, computing leverage, coverage, and liquidity ratios and posting the result to covenant_records.most_recent_test_value via query_ncino_loan_origination_loan_applications.](/queries/financials-intake-ratio-computation.md)
- [Compare current-period ratios against historical_metrics and analytics_events in BigQuery to score compliance_status (in_compliance/waived/breached/cured) and rank near-breach facilities for the Credit Risk Officer's queue.](/queries/baseline-comparison-breach-scoring.md)
- [Cite the Loan Covenant Monitoring Agent Banking Compliance Policy and the Financial Covenant Testing & Waiver Administration Runbook via lookup_loan_covenant_monitoring_agent_compliance_policy before any breach, cure, or waiver determination is finalized.](/queries/policy-runbook-evidence-gating.md)
- [Draft the waiver memo and trend narrative for breached or near-breach covenant_records, then execute action_ncino_loan_origination_escalate in nCino Loan Origination with a full audit trail routed to the Credit Risk Officer or special assets group.](/queries/escalation-waiver-memo-drafting.md)
