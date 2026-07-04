---
type: Query Capability
title: "Gemini synthesizes performance data, market conditions, and contract terms in..."
description: "Gemini synthesizes performance data, market conditions, and contract terms into a renewal recommendation: renew, renegotiate, rebid, or terminate. Identifies auto-renewal traps and calculates whether cancellation windows have been missed. Estimates renegotiation leverage from declining performance or market price drops."
source_id: "renewal-brief-generation"
generation_status: inferred
tags:
  - procurement
  - okf
  - brd
timestamp: "2026-07-01T00:00:00.000Z"
---

# Gemini synthesizes performance data, market conditions, and contract terms into a renewal recommendation: renew, renegotiate, rebid, or terminate. Identifies auto-renewal traps and calculates whether cancellation windows have been missed. Estimates renegotiation leverage from declining performance or market price drops.

## Tools used

- [lookup_renewal_expiry_monitor_policy_guide](/tools/lookup-renewal-expiry-monitor-policy-guide.md)
- [action_icertis_recommend](/tools/action-icertis-recommend.md)

## Runs in

- [renewal_brief_generation](/workflow/renewal-brief-generation.md)

## Evidence expected

- document_reference
- api_response
- generated_audit_trail

## Evals

- [Run the Renewal & Expiry Monitor workflow for the current period. Cite the relevant source-system evidence and surface any escalations required.](/tests/renewal-expiry-monitor-end-to-end.md)

# Citations

- [Renewal & Expiry Monitor Procurement Policy Guide](/documents/renewal-expiry-monitor-policy-guide.md)
