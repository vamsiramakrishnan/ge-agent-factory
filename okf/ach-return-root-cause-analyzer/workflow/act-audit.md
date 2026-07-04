---
type: Workflow Stage
title: "Act & Audit"
description: "Execute the publish step in FIS Payments Hub with a full audit trail, and escalate exceptions to the ACH Operations Analyst."
source_id: act_audit
tags:
  - banking
  - okf
  - brd
timestamp: "2026-07-04T00:00:00.000Z"
---

# Act & Audit

Execute the publish step in FIS Payments Hub with a full audit trail, and escalate exceptions to the ACH Operations Analyst.

- **Mode:** sequential
- **Stage:** 4 of 4

## Tools

- [query_fis_payments_hub_payment_instructions](/tools/query-fis-payments-hub-payment-instructions.md)
- [action_fis_payments_hub_publish](/tools/action-fis-payments-hub-publish.md)
