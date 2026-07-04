---
type: Workflow Stage
title: Context Investigation
description: "Gemini investigates flagged anomalies by reading transaction memos, approval documentation, and posting context. Determines whether anomaly is legitimate or requires escalation."
source_id: context_investigation
tags:
  - finance
  - okf
  - brd
timestamp: "2026-07-01T00:00:00.000Z"
---

# Context Investigation

Gemini investigates flagged anomalies by reading transaction memos, approval documentation, and posting context. Determines whether anomaly is legitimate or requires escalation.

- **Mode:** sequential
- **Stage:** 3 of 3

## Tools

- [lookup_gl_anomaly_detector_controls_playbook](/tools/lookup-gl-anomaly-detector-controls-playbook.md)
- [action_sap_s_4hana_fi_post](/tools/action-sap-s-4hana-fi-post.md)
