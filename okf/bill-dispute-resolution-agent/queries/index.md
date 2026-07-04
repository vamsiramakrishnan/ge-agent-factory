---
type: Index
title: Query Capabilities
description: "The questions and requests this agent can answer, each with the tools it uses."
timestamp: "2026-07-04T00:00:00.000Z"
---

# Query Capabilities

- [Pull the contested-charge ticket from Zendesk tickets/macros, resolve it to a billing_accounts.account_number and the specific rated_events line the customer is disputing.](/queries/dispute-intake-charge-identification.md)
- [Query Amdocs CES Billing billing_accounts and rated_events to compare the disputed rate_plan_code and rated_amount_usd against the account's contracted terms.](/queries/contract-rate-plan-verification.md)
- [Cross-check usage_records against rated_events on subscriber_key and mediation_batch, checking guiding_status and duplicate_suspect to confirm the charge reflects settled, non-suspense usage.](/queries/usage-mediation-reconciliation.md)
- [Compare current-cycle BigQuery analytics_events variance_pct against historical_metrics baselines to determine whether the dispute is a one-off error or a recurring rate/proration defect.](/queries/root-cause-baseline-comparison.md)
- [Cite the Bill Dispute Resolution Agent Service Assurance Runbook and the credit adjustment delegation-of-authority policy before drafting the customer resolution letter with line-item evidence.](/queries/adjudication-evidence-backed-resolution-drafting.md)
- [Execute action_amdocs_ces_billing_send to post the credit or denial to Amdocs CES Billing with a full audit trail, or escalate to the Billing Operations Manager when delegation or evidence gates are not met.](/queries/disposition-credit-issuance-audit.md)
