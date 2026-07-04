---
type: Workflow Stage
title: Anomaly Detection
description: "Detect deliverability anomalies against historical baselines. Correlate drops with specific sends (batch size, segment, content type) to narrow root cause candidates."
source_id: anomaly_detection
tags:
  - marketing
  - okf
  - brd
timestamp: "2026-07-01T00:00:00.000Z"
---

# Anomaly Detection

Detect deliverability anomalies against historical baselines. Correlate drops with specific sends (batch size, segment, content type) to narrow root cause candidates.

- **Mode:** sequential
- **Stage:** 2 of 3

## Tools

- [lookup_email_deliverability_manager_playbook](/tools/lookup-email-deliverability-manager-playbook.md)
- [action_hubspot_send](/tools/action-hubspot-send.md)

Next: [Root Cause Diagnosis](/workflow/root-cause-diagnosis.md)
