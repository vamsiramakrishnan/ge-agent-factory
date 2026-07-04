---
type: Query Capability
title: "Generate exception report with clear violations, borderline assessments, and ..."
description: "Generate exception report with clear violations, borderline assessments, and department compliance scores. Route to responsible managers for action."
source_id: "report-escalation"
generation_status: inferred
tags:
  - finance
  - okf
  - brd
timestamp: "2026-07-01T00:00:00.000Z"
---

# Generate exception report with clear violations, borderline assessments, and department compliance scores. Route to responsible managers for action.

## Tools used

- [lookup_ap_policy_compliance_monitor_controls_playbook](/tools/lookup-ap-policy-compliance-monitor-controls-playbook.md)

## Runs in

- [report_escalation](/workflow/report-escalation.md)

## Evidence expected

- document_reference

## Evals

- [Run the AP Policy Compliance Monitor workflow for the current period. Cite the relevant source-system evidence and surface any escalations required.](/tests/ap-policy-compliance-monitor-end-to-end.md)

# Citations

- [AP Policy Compliance Monitor Controls Playbook](/documents/ap-policy-compliance-monitor-controls-playbook.md)
