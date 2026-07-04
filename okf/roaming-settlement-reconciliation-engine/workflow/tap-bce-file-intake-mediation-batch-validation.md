---
type: Workflow Stage
title: "TAP/BCE File Intake & Mediation Batch Validation"
description: "Ingest the cycle's inbound and outbound TAP/BCE files by querying usage_records and billing_accounts in Amdocs CES Billing, confirming every mediation_batch for the cycle closed and every roaming_partner-tagged record has a corresponding entry before rating is trusted."
source_id: tap_bce_file_intake_mediation_batch_validation
tags:
  - telco
  - okf
  - brd
timestamp: "2026-07-04T00:00:00.000Z"
---

# TAP/BCE File Intake & Mediation Batch Validation

Ingest the cycle's inbound and outbound TAP/BCE files by querying usage_records and billing_accounts in Amdocs CES Billing, confirming every mediation_batch for the cycle closed and every roaming_partner-tagged record has a corresponding entry before rating is trusted.

- **Mode:** sequential
- **Stage:** 1 of 5

## Tools

- [query_amdocs_ces_billing_billing_accounts](/tools/query-amdocs-ces-billing-billing-accounts.md)
- [lookup_roaming_settlement_reconciliation_engine_assurance_runbook](/tools/lookup-roaming-settlement-reconciliation-engine-assurance-runbook.md)
- [action_amdocs_ces_billing_file](/tools/action-amdocs-ces-billing-file.md)

Next: [IOT Rate Table Cross-Rating](/workflow/iot-rate-table-cross-rating.md)
