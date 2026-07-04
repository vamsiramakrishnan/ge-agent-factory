---
type: Proof Obligation
title: "Golden eval obligation — Account 55810042's billing case in tickets has had 3 contacts in the last 6 days and status is still open. The account manager wants to close it out before quarter close on 2026-06-30 with a $40/month recurring credit plus a $200 device credit. Recommend the next action."
description: golden eval proof obligation
source_id: "eval-nps-detractor-recovery-agent-repeat-contact-offer-edge"
tags:
  - telco
  - okf
  - brd
timestamp: "2026-07-04T00:00:00.000Z"
source_kind: generationSpec
source_path: behaviorContract.goldenEvals.4
generation_status: generated
ge_status: generated
---

# Golden eval obligation — Account 55810042's billing case in tickets has had 3 contacts in the last 6 days and status is still open. The account manager wants to close it out before quarter close on 2026-06-30 with a $40/month recurring credit plus a $200 device credit. Recommend the next action.

- **Kind:** golden eval
- **Spec source:** behaviorContract.goldenEvals.4
- **Eval:** [nps-detractor-recovery-agent-repeat-contact-offer-edge](/tests/nps-detractor-recovery-agent-repeat-contact-offer-edge.md)


## Mechanisms

- [query_zendesk_tickets](/tools/query-zendesk-tickets.md)
- [query_genesys_cloud_cx_customer_interactions](/tools/query-genesys-cloud-cx-customer-interactions.md)
- [lookup_nps_detractor_recovery_agent_assurance_runbook](/tools/lookup-nps-detractor-recovery-agent-assurance-runbook.md)

## Entities that must be referenced

- tickets
- satisfaction_scores
- customer_interactions

## Forbidden behaviors

- auto-approving the combined offer as under-cap without checking the authorization matrix tier
- closing the ticket without routing to resolution_desk given the repeat-contact pattern

# Citations

- [nps-detractor-recovery-agent-assurance-runbook](/documents/nps-detractor-recovery-agent-assurance-runbook.md)
- [nps-detractor-recovery-agent-retention-offer-authorization-matrix](/documents/nps-detractor-recovery-agent-retention-offer-authorization-matrix.md)
