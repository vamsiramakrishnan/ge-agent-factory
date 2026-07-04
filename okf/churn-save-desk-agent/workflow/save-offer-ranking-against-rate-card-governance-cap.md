---
type: Workflow Stage
title: "Save Offer Ranking Against Rate Card & Governance Cap"
description: "Rank plan right-sizing, device-credit, and service-fix offers by predicted acceptance, checking each against the Retention Offer Rate Card and the Churn Save Desk Agent Service Assurance Runbook via lookup_churn_save_desk_agent_assurance_runbook, and gate any offer against the $40/month discount or $200 device-credit governance cap."
source_id: save_offer_ranking_against_rate_card_governance_cap
tags:
  - telco
  - okf
  - brd
timestamp: "2026-07-04T00:00:00.000Z"
---

# Save Offer Ranking Against Rate Card & Governance Cap

Rank plan right-sizing, device-credit, and service-fix offers by predicted acceptance, checking each against the Retention Offer Rate Card and the Churn Save Desk Agent Service Assurance Runbook via lookup_churn_save_desk_agent_assurance_runbook, and gate any offer against the $40/month discount or $200 device-credit governance cap.

- **Mode:** sequential
- **Stage:** 3 of 5

## Tools

- [lookup_churn_save_desk_agent_assurance_runbook](/tools/lookup-churn-save-desk-agent-assurance-runbook.md)

Next: [Offer Approval & Audit Trail](/workflow/offer-approval-audit-trail.md)
