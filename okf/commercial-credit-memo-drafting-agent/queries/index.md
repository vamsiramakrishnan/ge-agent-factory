---
type: Index
title: Query Capabilities
description: "The questions and requests this agent can answer, each with the tools it uses."
timestamp: "2026-07-04T00:00:00.000Z"
---

# Query Capabilities

- [Pull the borrower's loan_applications and credit_memos records from nCino Loan Origination via query_ncino_loan_origination_loan_applications, spreading requested_amount, dscr, ltv, and global_cash_flow into the standard memo template.](/queries/deal-intake-financial-spread-assembly.md)
- [Aggregate obligor-level committed exposure and covenant_records compliance_status from nCino, cross-referencing banking_3_records via query_banking_3_banking_3_records to compute the borrower's aggregate exposure against the house limit.](/queries/global-exposure-covenant-aggregation.md)
- [Screen risk_rating, ltv, and policy_exception_count against the Commercial Credit Memo Drafting Agent Banking Compliance Policy and the Delegated Lending Authority & House Hold-Limit Matrix using lookup_commercial_credit_memo_drafting_agent_compliance_policy, flagging LTV, hold-limit, or stacked-exception overages.](/queries/policy-authority-threshold-screening.md)
- [Generate the industry outlook, repayment analysis, and risk mitigant narrative sections in Vertex AI, grounding every claim in analytics_events and historical_metrics baselines pulled from BigQuery via query_bigquery_analytics_events.](/queries/narrative-drafting-via-vertex-ai.md)
- [Route stacked LTV/DSCR exceptions, house-limit breaches, or uncured covenant_records breaches to senior_credit_officer, credit_committee_secretary, or special_assets_group per the escalation rules before any memo advances toward committee.](/queries/exception-escalation-committee-routing.md)
- [Execute action_ncino_loan_origination_generate to publish the finalized credit memo into nCino Loan Origination with a generated_audit_trail entry, notifying the Commercial Credit Analyst of the outcome.](/queries/memo-generation-audit-trail.md)
