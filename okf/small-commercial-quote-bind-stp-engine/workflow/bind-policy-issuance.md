---
type: Workflow Stage
title: "Bind & Policy Issuance"
description: "Execute action_guidewire_policycenter_publish to convert a cleared policy_quotes record into a bound policies record in Guidewire PolicyCenter, writing a generated_audit_trail entry for the underwriting file."
source_id: bind_policy_issuance
tags:
  - insurance
  - okf
  - brd
timestamp: "2026-07-04T00:00:00.000Z"
---

# Bind & Policy Issuance

Execute action_guidewire_policycenter_publish to convert a cleared policy_quotes record into a bound policies record in Guidewire PolicyCenter, writing a generated_audit_trail entry for the underwriting file.

- **Mode:** sequential
- **Stage:** 5 of 6

## Tools

- [query_guidewire_policycenter_policies](/tools/query-guidewire-policycenter-policies.md)
- [lookup_small_commercial_quote_bind_stp_engine_authority_guide](/tools/lookup-small-commercial-quote-bind-stp-engine-authority-guide.md)
- [action_guidewire_policycenter_publish](/tools/action-guidewire-policycenter-publish.md)

Next: [STP Performance & Threshold Tuning](/workflow/stp-performance-threshold-tuning.md)
