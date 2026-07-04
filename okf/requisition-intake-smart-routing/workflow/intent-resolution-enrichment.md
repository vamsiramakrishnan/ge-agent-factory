---
type: Workflow Stage
title: "Intent Resolution & Enrichment"
description: "LLM interprets ambiguous free-text descriptions ('need the same thing we ordered last quarter for Chicago but in blue') and resolves to specific material, supplier, and contract. Detects compliance risks — a requisition for 'consulting services' with a named individual flagged as contingent labor."
source_id: intent_resolution_enrichment
tags:
  - procurement
  - okf
  - brd
timestamp: "2026-07-01T00:00:00.000Z"
---

# Intent Resolution & Enrichment

LLM interprets ambiguous free-text descriptions ('need the same thing we ordered last quarter for Chicago but in blue') and resolves to specific material, supplier, and contract. Detects compliance risks — a requisition for 'consulting services' with a named individual flagged as contingent labor.

- **Mode:** sequential
- **Stage:** 3 of 4

## Tools

- [lookup_requisition_intake_smart_routing_policy_guide](/tools/lookup-requisition-intake-smart-routing-policy-guide.md)

Next: [Smart Routing & Notification](/workflow/smart-routing-notification.md)
