---
type: Workflow Stage
title: "Discrepancy Quantification & Dispute Evidence Assembly"
description: "Quantify the dollar exposure of each flagged rate misapplication, duplicate, or missing file using rated_amount_usd deltas, publish variance to Looker dashboards, and assemble the record-level dispute package citing the Roaming Settlement Reconciliation Engine Service Assurance Runbook and the GSMA IOT Rate & Roaming Settlement Manual."
source_id: discrepancy_quantification_dispute_evidence_assembly
tags:
  - telco
  - okf
  - brd
timestamp: "2026-07-04T00:00:00.000Z"
---

# Discrepancy Quantification & Dispute Evidence Assembly

Quantify the dollar exposure of each flagged rate misapplication, duplicate, or missing file using rated_amount_usd deltas, publish variance to Looker dashboards, and assemble the record-level dispute package citing the Roaming Settlement Reconciliation Engine Service Assurance Runbook and the GSMA IOT Rate & Roaming Settlement Manual.

- **Mode:** sequential
- **Stage:** 4 of 5

## Tools

- [query_looker_dashboards](/tools/query-looker-dashboards.md)
- [lookup_roaming_settlement_reconciliation_engine_assurance_runbook](/tools/lookup-roaming-settlement-reconciliation-engine-assurance-runbook.md)
- [action_amdocs_ces_billing_file](/tools/action-amdocs-ces-billing-file.md)

Next: [Dispute Filing & Partner Settlement Tracking](/workflow/dispute-filing-partner-settlement-tracking.md)
