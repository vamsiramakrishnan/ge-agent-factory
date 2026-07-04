---
type: Query Capability
title: Detect deliverability anomalies against historical baselines. Correlate drops...
description: "Detect deliverability anomalies against historical baselines. Correlate drops with specific sends (batch size, segment, content type) to narrow root cause candidates."
source_id: "anomaly-detection"
generation_status: inferred
tags:
  - marketing
  - okf
  - brd
timestamp: "2026-07-01T00:00:00.000Z"
---

# Detect deliverability anomalies against historical baselines. Correlate drops with specific sends (batch size, segment, content type) to narrow root cause candidates.

## Tools used

- [lookup_email_deliverability_manager_playbook](/tools/lookup-email-deliverability-manager-playbook.md)
- [action_hubspot_send](/tools/action-hubspot-send.md)

## Runs in

- [anomaly_detection](/workflow/anomaly-detection.md)

## Evidence expected

- document_reference
- api_response
- generated_audit_trail

## Evals

- [Run the Email Deliverability Manager workflow for the current period. Cite the relevant source-system evidence and surface any escalations required.](/tests/email-deliverability-manager-end-to-end.md)

# Citations

- [Email Deliverability Manager Playbook](/documents/email-deliverability-manager-playbook.md)
