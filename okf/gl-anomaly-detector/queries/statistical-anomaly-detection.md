---
type: Query Capability
title: "Apply Benford's Law analysis on transaction distributions, detect unusual pos..."
description: "Apply Benford's Law analysis on transaction distributions, detect unusual posting amounts and timing, identify duplicate entries, and flag abnormal account combinations."
source_id: "statistical-anomaly-detection"
generation_status: inferred
tags:
  - finance
  - okf
  - brd
timestamp: "2026-07-01T00:00:00.000Z"
---

# Apply Benford's Law analysis on transaction distributions, detect unusual posting amounts and timing, identify duplicate entries, and flag abnormal account combinations.

## Tools used

- [query_sap_s_4hana_fi_gl_entries](/tools/query-sap-s-4hana-fi-gl-entries.md)
- [lookup_gl_anomaly_detector_controls_playbook](/tools/lookup-gl-anomaly-detector-controls-playbook.md)
- [action_sap_s_4hana_fi_post](/tools/action-sap-s-4hana-fi-post.md)

## Runs in

- [statistical_anomaly_detection](/workflow/statistical-anomaly-detection.md)

## Evidence expected

- source_system_record
- document_reference
- api_response
- generated_audit_trail

## Evals

- [Run the GL Anomaly Detector workflow for the current period. Cite the relevant source-system evidence and surface any escalations required.](/tests/gl-anomaly-detector-end-to-end.md)

# Citations

- [GL Anomaly Detector Controls Playbook](/documents/gl-anomaly-detector-controls-playbook.md)
