---
type: Index
title: Query Capabilities
description: "The questions and requests this agent can answer, each with the tools it uses."
timestamp: "2026-07-04T00:00:00.000Z"
---

# Query Capabilities

- [After every reset window closes, pull item_master and merchandise_hierarchy records from Oracle Retail MFCS and ingest the store's shelf-photo evidence set for the Planogram Compliance Analyzer workflow.](/queries/reset-window-trigger-evidence-intake.md)
- [Correlate Oracle Xstore POS pos_transactions sales-rate signals against the planogram of record to surface facing, position, and missing-item deviations store by store.](/queries/sales-rate-planogram-reconciliation.md)
- [Score each store's compliance rate and reset audit coverage against BigQuery historical_metrics and analytics_events baselines to detect the 72%-to-93% gap and prioritize the Planogram Manager's exception queue.](/queries/compliance-scoring-against-historical-baseline.md)
- [Cross-check every flagged violation against the Planogram Compliance Analyzer Retail Execution Playbook and the Planogram Reset Space Standards Manual, citing the governing sections before any corrective task or escalation is issued.](/queries/playbook-gated-evidence-validation.md)
- [Execute the escalate action in Oracle Retail MFCS to open corrective tasks for store teams, with full audit trail, and escalate chronic non-compliance patterns to the Planogram Manager.](/queries/corrective-task-assignment-chronic-non-compliance-escalation.md)
