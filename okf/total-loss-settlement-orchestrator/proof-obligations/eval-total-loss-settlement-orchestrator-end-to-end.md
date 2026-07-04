---
type: Proof Obligation
title: "Golden eval obligation — Run the Total Loss Settlement Orchestrator workflow for the current period. Cite the relevant source-system evidence and surface any escalations required."
description: golden eval proof obligation
source_id: "eval-total-loss-settlement-orchestrator-end-to-end"
tags:
  - insurance
  - okf
  - brd
timestamp: "2026-07-04T00:00:00.000Z"
source_kind: generationSpec
source_path: behaviorContract.goldenEvals.0
generation_status: generated
ge_status: generated
---

# Golden eval obligation — Run the Total Loss Settlement Orchestrator workflow for the current period. Cite the relevant source-system evidence and surface any escalations required.

- **Kind:** golden eval
- **Spec source:** behaviorContract.goldenEvals.0
- **Eval:** [total-loss-settlement-orchestrator-end-to-end](/tests/total-loss-settlement-orchestrator-end-to-end.md)


## Mechanisms

- [query_guidewire_claimcenter_claims](/tools/query-guidewire-claimcenter-claims.md)
- [query_docusign_envelopes](/tools/query-docusign-envelopes.md)
- [query_bigquery_analytics_events](/tools/query-bigquery-analytics-events.md)
- [lookup_total_loss_settlement_orchestrator_authority_guide](/tools/lookup-total-loss-settlement-orchestrator-authority-guide.md)
- [action_guidewire_claimcenter_file](/tools/action-guidewire-claimcenter-file.md)

## Entities that must be referenced

- claims
- envelopes
- analytics_events

## Forbidden behaviors

- do not invent KPI numbers
- do not skip the evidence_lookup step before any recommendation
- do not execute file without two-system evidence

# Citations

- [total-loss-settlement-orchestrator-authority-guide](/documents/total-loss-settlement-orchestrator-authority-guide.md)
