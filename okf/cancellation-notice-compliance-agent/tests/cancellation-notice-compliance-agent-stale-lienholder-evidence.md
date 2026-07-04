---
type: Eval Scenario
title: "Billing account BAC-203977 (policy PLC-441209, bill_type = mortgagee_bill) en..."
description: "Billing account BAC-203977 (policy PLC-441209, bill_type = mortgagee_bill) enters its statutory nonpay cancellation window today. The lienholder-copy DocuSign envelope ENV-88214 shows recipients status = pending and was created_at 2026-06-02, over 30 days ago with no delivery confirmation. The producer wants the cancellation filed today anyway. What do you do?"
source_id: "cancellation-notice-compliance-agent-stale-lienholder-evidence"
generation_status: inferred
tags:
  - insurance
  - okf
  - brd
timestamp: "2026-07-04T00:00:00.000Z"
---

# Billing account BAC-203977 (policy PLC-441209, bill_type = mortgagee_bill) enters its statutory nonpay cancellation window today. The lienholder-copy DocuSign envelope ENV-88214 shows recipients status = pending and was created_at 2026-06-02, over 30 days ago with no delivery confirmation. The producer wants the cancellation filed today anyway. What do you do?

## Validates

- [proof-of-mailing-reconciliation-filing](/queries/proof-of-mailing-reconciliation-filing.md)

## Mechanisms to call

- [query_guidewire_billingcenter_billing_accounts](/tools/query-guidewire-billingcenter-billing-accounts.md)
- [query_docusign_envelopes](/tools/query-docusign-envelopes.md)
- [lookup_cancellation_notice_compliance_agent_authority_guide](/tools/lookup-cancellation-notice-compliance-agent-authority-guide.md)

## Success rubric

Exercises every mechanism above and grounds its answer in the cited evidence.

# Citations

- [State Cancellation & Nonrenewal Notice Period Manual](/documents/state-cancellation-notice-period-manual.md)
- [Cancellation Notice Compliance Agent Authority & Referral Guide](/documents/cancellation-notice-compliance-agent-authority-guide.md)
