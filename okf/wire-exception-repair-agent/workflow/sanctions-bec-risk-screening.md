---
type: Workflow Stage
title: "Sanctions & BEC risk screening"
description: "Check ofac_screening_status on payment_instructions and evaluate business-email-compromise indicators against the Wire Exception Repair Agent Banking Compliance Policy before any candidate repair can be released."
source_id: sanctions_bec_risk_screening
tags:
  - banking
  - okf
  - brd
timestamp: "2026-07-04T00:00:00.000Z"
---

# Sanctions & BEC risk screening

Check ofac_screening_status on payment_instructions and evaluate business-email-compromise indicators against the Wire Exception Repair Agent Banking Compliance Policy before any candidate repair can be released.

- **Mode:** sequential
- **Stage:** 3 of 5

## Tools

- [query_fis_payments_hub_payment_instructions](/tools/query-fis-payments-hub-payment-instructions.md)
- [lookup_wire_exception_repair_agent_compliance_policy](/tools/lookup-wire-exception-repair-agent-compliance-policy.md)

Next: [Confidence-scored repair & release](/workflow/confidence-scored-repair-release.md)
