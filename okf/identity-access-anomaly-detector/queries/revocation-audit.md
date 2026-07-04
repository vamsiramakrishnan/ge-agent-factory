---
type: Query Capability
title: Confirmed unauthorized access triggers immediate account suspension in Okta. ...
description: Confirmed unauthorized access triggers immediate account suspension in Okta. Full audit trail of accessed resources generated for compliance.
source_id: "revocation-audit"
generation_status: inferred
tags:
  - it
  - okf
  - brd
timestamp: "2026-07-01T00:00:00.000Z"
---

# Confirmed unauthorized access triggers immediate account suspension in Okta. Full audit trail of accessed resources generated for compliance.

## Tools used

- [query_okta_users](/tools/query-okta-users.md)
- [lookup_identity_access_anomaly_detector_runbook](/tools/lookup-identity-access-anomaly-detector-runbook.md)

## Runs in

- [revocation_audit](/workflow/revocation-audit.md)

## Evidence expected

- source_system_record
- document_reference

## Evals

- [Run the Identity & Access Anomaly Detector workflow for the current period. Cite the relevant source-system evidence and surface any escalations required.](/tests/identity-access-anomaly-detector-end-to-end.md)

# Citations

- [Identity & Access Anomaly Detector Operations Runbook](/documents/identity-access-anomaly-detector-runbook.md)
