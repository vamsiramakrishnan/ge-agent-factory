---
type: Workflow Stage
title: "Straight-Through Rating & Document Issuance"
description: "For routine, non-underwriting-impacting endorsements, execute action_guidewire_policycenter_route to quote the premium change against annual_premium and issue updated policy documents in Guidewire PolicyCenter."
source_id: straight_through_rating_document_issuance
tags:
  - insurance
  - okf
  - brd
timestamp: "2026-07-04T00:00:00.000Z"
---

# Straight-Through Rating & Document Issuance

For routine, non-underwriting-impacting endorsements, execute action_guidewire_policycenter_route to quote the premium change against annual_premium and issue updated policy documents in Guidewire PolicyCenter.

- **Mode:** sequential
- **Stage:** 4 of 5

## Tools

- [query_guidewire_policycenter_policies](/tools/query-guidewire-policycenter-policies.md)
- [lookup_endorsement_processing_agent_authority_guide](/tools/lookup-endorsement-processing-agent-authority-guide.md)
- [action_guidewire_policycenter_route](/tools/action-guidewire-policycenter-route.md)

Next: [Audit Trail & Turnaround Reconciliation](/workflow/audit-trail-turnaround-reconciliation.md)
