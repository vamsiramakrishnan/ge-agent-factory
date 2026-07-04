---
type: Proof Obligation
title: "Golden eval obligation — Run the Shadow IT Detector workflow for the current period. Cite the relevant source-system evidence and surface any escalations required."
description: golden eval proof obligation
source_id: "eval-shadow-it-detector-end-to-end"
tags:
  - it
  - okf
  - brd
timestamp: "2026-07-01T00:00:00.000Z"
source_kind: generationSpec
source_path: behaviorContract.goldenEvals.0
generation_status: generated
ge_status: generated
---

# Golden eval obligation — Run the Shadow IT Detector workflow for the current period. Cite the relevant source-system evidence and surface any escalations required.

- **Kind:** golden eval
- **Spec source:** behaviorContract.goldenEvals.0
- **Eval:** [shadow-it-detector-end-to-end](/tests/shadow-it-detector-end-to-end.md)


## Mechanisms

- [query_okta_users](/tools/query-okta-users.md)
- [query_google_workspace_accounts](/tools/query-google-workspace-accounts.md)
- [query_palo_alto_palo_alto_records](/tools/query-palo-alto-palo-alto-records.md)
- [query_crowdstrike_scan_findings](/tools/query-crowdstrike-scan-findings.md)
- [lookup_shadow_it_detector_runbook](/tools/lookup-shadow-it-detector-runbook.md)
- [action_okta_approve](/tools/action-okta-approve.md)

## Entities that must be referenced

- users
- accounts
- palo_alto_records
- scan_findings
- analytics_events

## Forbidden behaviors

- do not invent KPI numbers
- do not skip the evidence_lookup step before any recommendation
- do not execute approve without two-system evidence

# Citations

- [shadow-it-detector-runbook](/documents/shadow-it-detector-runbook.md)
