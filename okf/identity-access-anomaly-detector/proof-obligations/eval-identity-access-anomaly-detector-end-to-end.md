---
type: Proof Obligation
title: "Golden eval obligation — Run the Identity & Access Anomaly Detector workflow for the current period. Cite the relevant source-system evidence and surface any escalations required."
description: golden eval proof obligation
source_id: "eval-identity-access-anomaly-detector-end-to-end"
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

# Golden eval obligation — Run the Identity & Access Anomaly Detector workflow for the current period. Cite the relevant source-system evidence and surface any escalations required.

- **Kind:** golden eval
- **Spec source:** behaviorContract.goldenEvals.0
- **Eval:** [identity-access-anomaly-detector-end-to-end](/tests/identity-access-anomaly-detector-end-to-end.md)


## Mechanisms

- [query_okta_users](/tools/query-okta-users.md)
- [query_google_workspace_accounts](/tools/query-google-workspace-accounts.md)
- [query_crowdstrike_scan_findings](/tools/query-crowdstrike-scan-findings.md)
- [query_chronicle_chronicle_records](/tools/query-chronicle-chronicle-records.md)
- [lookup_identity_access_anomaly_detector_runbook](/tools/lookup-identity-access-anomaly-detector-runbook.md)

## Entities that must be referenced

- users
- accounts
- scan_findings
- chronicle_records
- analytics_events

## Forbidden behaviors

- do not invent KPI numbers
- do not skip the evidence_lookup step before any recommendation
- do not act on single-system evidence

# Citations

- [identity-access-anomaly-detector-runbook](/documents/identity-access-anomaly-detector-runbook.md)
