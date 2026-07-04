---
type: Query Capability
title: Gemini diagnoses deliverability issues by correlating multiple signals. Disti...
description: "Gemini diagnoses deliverability issues by correlating multiple signals. Distinguishes between domain reputation damage (from re-engagement sends), content-triggered spam filtering, and list hygiene issues."
source_id: "root-cause-diagnosis"
generation_status: inferred
tags:
  - marketing
  - okf
  - brd
timestamp: "2026-07-01T00:00:00.000Z"
---

# Gemini diagnoses deliverability issues by correlating multiple signals. Distinguishes between domain reputation damage (from re-engagement sends), content-triggered spam filtering, and list hygiene issues.

## Tools used

- [lookup_email_deliverability_manager_playbook](/tools/lookup-email-deliverability-manager-playbook.md)
- [action_hubspot_send](/tools/action-hubspot-send.md)

## Runs in

- [root_cause_diagnosis](/workflow/root-cause-diagnosis.md)

## Evidence expected

- document_reference
- api_response
- generated_audit_trail

## Evals

- [Run the Email Deliverability Manager workflow for the current period. Cite the relevant source-system evidence and surface any escalations required.](/tests/email-deliverability-manager-end-to-end.md)

# Citations

- [Email Deliverability Manager Playbook](/documents/email-deliverability-manager-playbook.md)
