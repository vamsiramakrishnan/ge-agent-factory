---
type: Index
title: Query Capabilities
description: "The questions and requests this agent can answer, each with the tools it uses."
timestamp: "2026-07-04T00:00:00.000Z"
---

# Query Capabilities

- [Poll Oracle Xstore POS pos_transactions, tender_records, and store_shift_summaries for the failure signatures (void spikes, offline auth flags, dead registers) that precede an associate calling the help desk.](/queries/register-health-signal-intake.md)
- [Query Zendesk tickets and macros for the same store/register_number combination so the agent enriches an existing ticket instead of opening a duplicate, and pulls satisfaction_scores context on the assignee's recent close-outs.](/queries/ticket-correlation-dedup.md)
- [Compare the current tender_type and settlement pattern against BigQuery historical_metrics, analytics_events, and cached_aggregates baselines to identify a known repeat-cause signature (tender driver fault, printer jam, network sync loss) rather than treating every incident as novel.](/queries/root-cause-pattern-match.md)
- [Score the incident P1-P4 and decide self-heal versus escalate by citing the required sections of the POS Exception Triage Agent Retail Execution Playbook and, for card-present exceptions, the EMV Fallback & Offline Authorization Risk Bulletin.](/queries/playbook-gated-severity-scoring.md)
- [Call action_oracle_xstore_pos_escalate against Oracle Xstore POS with the evidence trail attached, then notify the Store Manager of lane-down status and expected time-to-resolve.](/queries/escalation-lane-status-notification.md)
