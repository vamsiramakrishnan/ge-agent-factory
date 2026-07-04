---
type: Index
title: Query Capabilities
description: "The questions and requests this agent can answer, each with the tools it uses."
timestamp: "2026-07-04T00:00:00.000Z"
---

# Query Capabilities

- [Ingest the cycle's inbound and outbound TAP/BCE files by querying usage_records and billing_accounts in Amdocs CES Billing, confirming every mediation_batch for the cycle closed and every roaming_partner-tagged record has a corresponding entry before rating is trusted.](/queries/tap-bce-file-intake-mediation-batch-validation.md)
- [Cross-rate each roaming_partner event in rated_events against the current GSMA IOT rate table by rate_plan_code, flagging events billed under a retail plan code (UNL_BASIC, UNL_PLUS_5G) that should have rated under IOT_M2M_POOLED, and any zero_rated or rerated events lacking a documented cause.](/queries/iot-rate-table-cross-rating.md)
- [Join rated_events and usage_records totals per partner against analytics_events and historical_metrics in BigQuery to compute the trailing-cycle variance, isolate duplicate_suspect records, and surface missing-file gaps where a usage_records entry has no matching rated_events.](/queries/partner-baseline-reconciliation.md)
- [Quantify the dollar exposure of each flagged rate misapplication, duplicate, or missing file using rated_amount_usd deltas, publish variance to Looker dashboards, and assemble the record-level dispute package citing the Roaming Settlement Reconciliation Engine Service Assurance Runbook and the GSMA IOT Rate & Roaming Settlement Manual.](/queries/discrepancy-quantification-dispute-evidence-assembly.md)
- [Execute the file step in Amdocs CES Billing to submit the settlement adjustment or dispute package against billing_accounts, attach the full audit trail, and escalate exceptions above the delegation thresholds to the Wholesale Settlements Analyst before the next billing cycle closes.](/queries/dispute-filing-partner-settlement-tracking.md)
