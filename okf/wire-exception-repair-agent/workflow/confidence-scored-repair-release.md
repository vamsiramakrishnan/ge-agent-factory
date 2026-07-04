---
type: Workflow Stage
title: "Confidence-scored repair & release"
description: "Apply high-confidence corrections directly to payment_instructions, or route ambiguous cases with ranked candidate fixes to a repair clerk, then call action_fis_payments_hub_escalate for anything requiring supervisor sign-off."
source_id: confidence_scored_repair_release
tags:
  - banking
  - okf
  - brd
timestamp: "2026-07-04T00:00:00.000Z"
---

# Confidence-scored repair & release

Apply high-confidence corrections directly to payment_instructions, or route ambiguous cases with ranked candidate fixes to a repair clerk, then call action_fis_payments_hub_escalate for anything requiring supervisor sign-off.

- **Mode:** sequential
- **Stage:** 4 of 5

## Tools

- [query_fis_payments_hub_payment_instructions](/tools/query-fis-payments-hub-payment-instructions.md)
- [lookup_wire_exception_repair_agent_compliance_policy](/tools/lookup-wire-exception-repair-agent-compliance-policy.md)
- [action_fis_payments_hub_escalate](/tools/action-fis-payments-hub-escalate.md)

Next: [Cutoff monitoring & queue escalation](/workflow/cutoff-monitoring-queue-escalation.md)
