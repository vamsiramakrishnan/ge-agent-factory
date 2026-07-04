---
type: Eval Scenario
title: Run the Total Loss Settlement Orchestrator workflow for the current period. C...
description: "Run the Total Loss Settlement Orchestrator workflow for the current period. Cite the relevant source-system evidence and surface any escalations required."
source_id: "total-loss-settlement-orchestrator-end-to-end"
generation_status: inferred
tags:
  - insurance
  - okf
  - brd
timestamp: "2026-07-04T00:00:00.000Z"
---

# Run the Total Loss Settlement Orchestrator workflow for the current period. Cite the relevant source-system evidence and surface any escalations required.

## Validates

- [fnol-total-loss-trigger-intake](/queries/fnol-total-loss-trigger-intake.md)

## Mechanisms to call

- [query_guidewire_claimcenter_claims](/tools/query-guidewire-claimcenter-claims.md)
- [query_docusign_envelopes](/tools/query-docusign-envelopes.md)
- [query_bigquery_analytics_events](/tools/query-bigquery-analytics-events.md)
- [lookup_total_loss_settlement_orchestrator_authority_guide](/tools/lookup-total-loss-settlement-orchestrator-authority-guide.md)
- [action_guidewire_claimcenter_file](/tools/action-guidewire-claimcenter-file.md)

## Success rubric

Action file executed against Guidewire ClaimCenter, with audit-trail entry and Auto Claims Specialist notified of outcomes.

# Citations

- [Total Loss Settlement Orchestrator Authority & Referral Guide](/documents/total-loss-settlement-orchestrator-authority-guide.md)
