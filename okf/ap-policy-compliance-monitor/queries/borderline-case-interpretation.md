---
type: Query Capability
title: "Gemini interprets borderline cases — split purchases (same vendor, same day, ..."
description: "Gemini interprets borderline cases — split purchases (same vendor, same day, amounts below threshold), retroactive POs, and policy gray areas. Provides evidence-based assessment."
source_id: "borderline-case-interpretation"
generation_status: inferred
tags:
  - finance
  - okf
  - brd
timestamp: "2026-07-01T00:00:00.000Z"
---

# Gemini interprets borderline cases — split purchases (same vendor, same day, amounts below threshold), retroactive POs, and policy gray areas. Provides evidence-based assessment.

## Tools used

- [lookup_ap_policy_compliance_monitor_controls_playbook](/tools/lookup-ap-policy-compliance-monitor-controls-playbook.md)

## Runs in

- [borderline_case_interpretation](/workflow/borderline-case-interpretation.md)

## Evidence expected

- document_reference

## Evals

- [Run the AP Policy Compliance Monitor workflow for the current period. Cite the relevant source-system evidence and surface any escalations required.](/tests/ap-policy-compliance-monitor-end-to-end.md)

# Citations

- [AP Policy Compliance Monitor Controls Playbook](/documents/ap-policy-compliance-monitor-controls-playbook.md)
