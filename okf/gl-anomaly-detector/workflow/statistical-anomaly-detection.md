---
type: Workflow Stage
title: Statistical Anomaly Detection
description: "Apply Benford's Law analysis on transaction distributions, detect unusual posting amounts and timing, identify duplicate entries, and flag abnormal account combinations."
source_id: statistical_anomaly_detection
tags:
  - finance
  - okf
  - brd
timestamp: "2026-07-01T00:00:00.000Z"
---

# Statistical Anomaly Detection

Apply Benford's Law analysis on transaction distributions, detect unusual posting amounts and timing, identify duplicate entries, and flag abnormal account combinations.

- **Mode:** sequential
- **Stage:** 2 of 3

## Tools

- [query_sap_s_4hana_fi_gl_entries](/tools/query-sap-s-4hana-fi-gl-entries.md)
- [lookup_gl_anomaly_detector_controls_playbook](/tools/lookup-gl-anomaly-detector-controls-playbook.md)
- [action_sap_s_4hana_fi_post](/tools/action-sap-s-4hana-fi-post.md)

Next: [Context Investigation](/workflow/context-investigation.md)
