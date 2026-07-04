---
type: Workflow Stage
title: "Endorsement Transaction & Coverage Mapping"
description: "Match the requested change to the correct endorsement transaction against policies, policy_quotes, and underwriting_submissions in Guidewire PolicyCenter, confirming line_of_business and jurisdiction_state before proceeding."
source_id: endorsement_transaction_coverage_mapping
tags:
  - insurance
  - okf
  - brd
timestamp: "2026-07-04T00:00:00.000Z"
---

# Endorsement Transaction & Coverage Mapping

Match the requested change to the correct endorsement transaction against policies, policy_quotes, and underwriting_submissions in Guidewire PolicyCenter, confirming line_of_business and jurisdiction_state before proceeding.

- **Mode:** sequential
- **Stage:** 2 of 5

## Tools

- [query_guidewire_policycenter_policies](/tools/query-guidewire-policycenter-policies.md)
- [lookup_endorsement_processing_agent_authority_guide](/tools/lookup-endorsement-processing-agent-authority-guide.md)
- [action_guidewire_policycenter_route](/tools/action-guidewire-policycenter-route.md)

Next: [Authority & Referral Gating](/workflow/authority-referral-gating.md)
