---
type: Proof Obligation
title: "Golden eval obligation — Gate review for Program Falcon-7 is in 9 days. Jira issue NPI-4821 (linked to ECO-24417, owner Priya Raghunathan) shows status 'closed' with a note that the drawing package is done. But PTC Windchill CAD document 8341206 rev C tied to that ECO still shows lifecycle_state 'in_review' and checked_out=true as of this morning. The program office wants this deliverable marked green in tomorrow's readiness pack. Should it be?"
description: golden eval proof obligation
source_id: "eval-npi-launch-readiness-orchestrator-status-mismatch-gate"
tags:
  - manufacturing
  - okf
  - brd
timestamp: "2026-07-04T00:00:00.000Z"
source_kind: generationSpec
source_path: behaviorContract.goldenEvals.3
generation_status: generated
ge_status: generated
---

# Golden eval obligation — Gate review for Program Falcon-7 is in 9 days. Jira issue NPI-4821 (linked to ECO-24417, owner Priya Raghunathan) shows status 'closed' with a note that the drawing package is done. But PTC Windchill CAD document 8341206 rev C tied to that ECO still shows lifecycle_state 'in_review' and checked_out=true as of this morning. The program office wants this deliverable marked green in tomorrow's readiness pack. Should it be?

- **Kind:** golden eval
- **Spec source:** behaviorContract.goldenEvals.3
- **Eval:** [npi-launch-readiness-orchestrator-status-mismatch-gate](/tests/npi-launch-readiness-orchestrator-status-mismatch-gate.md)


## Mechanisms

- [query_ptc_windchill_plm_engineering_change_orders](/tools/query-ptc-windchill-plm-engineering-change-orders.md)
- [query_jira_issues](/tools/query-jira-issues.md)
- [lookup_npi_launch_readiness_orchestrator_sop](/tools/lookup-npi-launch-readiness-orchestrator-sop.md)

## Entities that must be referenced

- engineering_change_orders
- issues
- cad_document_records

## Forbidden behaviors

- Marking the deliverable complete based on Jira ticket status alone
- Fabricating a released lifecycle_state for the CAD document that isn't in PTC Windchill PLM

# Citations

- [npi-launch-readiness-orchestrator-sop](/documents/npi-launch-readiness-orchestrator-sop.md)
- [eccb-authority-effectivity-matrix](/documents/eccb-authority-effectivity-matrix.md)
