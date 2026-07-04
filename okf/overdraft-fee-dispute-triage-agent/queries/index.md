---
type: Index
title: Query Capabilities
description: "The questions and requests this agent can answer, each with the tools it uses."
timestamp: "2026-07-04T00:00:00.000Z"
---

# Query Capabilities

- [Pull the ServiceNow tickets record for the disputed fee and match it to the customer's core_accounts record in Temenos Transact by account_number, confirming account_status and reg_dd_disclosure_acknowledged before triage begins.](/queries/dispute-intake-account-match.md)
- [Rebuild the actual settled order of account_transactions (and any standing_orders retries) in Temenos Transact around the fee-triggering debit to establish whether the overdraft fee was caused by posting order rather than genuine insufficient funds.](/queries/posting-sequence-reconstruction.md)
- [Query BigQuery analytics_events and historical_metrics for the account's trailing waiver count and relationship-depth signals, checked against the tier thresholds in the Courtesy Overdraft Fee Waiver Authority & Approval Limits Playbook.](/queries/waiver-history-relationship-scoring.md)
- [Look up the governing sections of the Overdraft Fee Dispute Triage Agent Banking Compliance Policy and the waiver authority playbook to decide refund versus denial, citing the specific thresholds and anchors that justify the outcome.](/queries/policy-gated-refund-determination.md)
- [Execute action_temenos_transact_escalate to post the refund or escalate the pattern-abuse case in Temenos Transact, update the ServiceNow tickets status, and emit the generated_audit_trail evidence for the Retail Banking Service Manager.](/queries/disposition-refund-posting-audit.md)
