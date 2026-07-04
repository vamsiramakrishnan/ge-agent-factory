---
type: Query Capability
title: "Gemini investigates flagged anomalies by reading transaction memos, approval ..."
description: "Gemini investigates flagged anomalies by reading transaction memos, approval documentation, and posting context. Determines whether anomaly is legitimate or requires escalation."
source_id: "context-investigation"
generation_status: inferred
tags:
  - finance
  - okf
  - brd
timestamp: "2026-07-01T00:00:00.000Z"
---

# Gemini investigates flagged anomalies by reading transaction memos, approval documentation, and posting context. Determines whether anomaly is legitimate or requires escalation.

## Tools used

- [lookup_gl_anomaly_detector_controls_playbook](/tools/lookup-gl-anomaly-detector-controls-playbook.md)
- [action_sap_s_4hana_fi_post](/tools/action-sap-s-4hana-fi-post.md)

## Runs in

- [context_investigation](/workflow/context-investigation.md)

## Evidence expected

- document_reference
- api_response
- generated_audit_trail

## Evals

- [Run the GL Anomaly Detector workflow for the current period. Cite the relevant source-system evidence and surface any escalations required.](/tests/gl-anomaly-detector-end-to-end.md)

# Citations

- [GL Anomaly Detector Controls Playbook](/documents/gl-anomaly-detector-controls-playbook.md)
