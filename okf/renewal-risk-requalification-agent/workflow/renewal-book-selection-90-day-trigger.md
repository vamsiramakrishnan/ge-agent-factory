---
type: Workflow Stage
title: "Renewal Book Selection & 90-Day Trigger"
description: "Query policies nearing expiration_date (policy_status in_force) from Guidewire PolicyCenter via query_guidewire_policycenter_policies, and cross-reference open policy_quotes and underwriting_submissions for the same named_insured so an account with new business already in flight isn't requalified out of sequence."
source_id: renewal_book_selection_90_day_trigger
tags:
  - insurance
  - okf
  - brd
timestamp: "2026-07-04T00:00:00.000Z"
---

# Renewal Book Selection & 90-Day Trigger

Query policies nearing expiration_date (policy_status in_force) from Guidewire PolicyCenter via query_guidewire_policycenter_policies, and cross-reference open policy_quotes and underwriting_submissions for the same named_insured so an account with new business already in flight isn't requalified out of sequence.

- **Mode:** sequential
- **Stage:** 1 of 5

## Tools

- [query_guidewire_policycenter_policies](/tools/query-guidewire-policycenter-policies.md)
- [lookup_renewal_risk_requalification_agent_authority_guide](/tools/lookup-renewal-risk-requalification-agent-authority-guide.md)
- [action_guidewire_policycenter_route](/tools/action-guidewire-policycenter-route.md)

Next: [Exposure & Loss Signal Refresh](/workflow/exposure-loss-signal-refresh.md)
