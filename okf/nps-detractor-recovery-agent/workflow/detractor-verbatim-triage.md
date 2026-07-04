---
type: Workflow Stage
title: Detractor Verbatim Triage
description: "Pull the new satisfaction_scores response and its linked tickets from Zendesk, then match the verbatim against the account's customer_interactions record in Genesys Cloud CX to confirm the interaction that drove the score."
source_id: detractor_verbatim_triage
tags:
  - telco
  - okf
  - brd
timestamp: "2026-07-04T00:00:00.000Z"
---

# Detractor Verbatim Triage

Pull the new satisfaction_scores response and its linked tickets from Zendesk, then match the verbatim against the account's customer_interactions record in Genesys Cloud CX to confirm the interaction that drove the score.

- **Mode:** sequential
- **Stage:** 1 of 5

## Tools

- [query_genesys_cloud_cx_customer_interactions](/tools/query-genesys-cloud-cx-customer-interactions.md)
- [query_zendesk_tickets](/tools/query-zendesk-tickets.md)
- [lookup_nps_detractor_recovery_agent_assurance_runbook](/tools/lookup-nps-detractor-recovery-agent-assurance-runbook.md)
- [action_genesys_cloud_cx_escalate](/tools/action-genesys-cloud-cx-escalate.md)

Next: [Service History Correlation](/workflow/service-history-correlation.md)
