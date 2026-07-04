---
type: Workflow Stage
title: "Act & Audit"
description: "Execute the escalate step in FIS Payments Hub with a full audit trail, and escalate exceptions to the Payments Operations Manager."
source_id: act_audit
tags:
  - banking
  - okf
  - brd
timestamp: "2026-07-04T00:00:00.000Z"
---

# Act & Audit

Execute the escalate step in FIS Payments Hub with a full audit trail, and escalate exceptions to the Payments Operations Manager.

- **Mode:** sequential
- **Stage:** 4 of 4

## Tools

- [query_fis_payments_hub_payment_instructions](/tools/query-fis-payments-hub-payment-instructions.md)
- [lookup_wire_exception_repair_agent_compliance_policy](/tools/lookup-wire-exception-repair-agent-compliance-policy.md)
- [action_fis_payments_hub_escalate](/tools/action-fis-payments-hub-escalate.md)
