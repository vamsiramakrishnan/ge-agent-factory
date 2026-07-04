---
type: Query Capability
title: Gemini diagnoses complex integration failures that automated monitoring flags...
description: "Gemini diagnoses complex integration failures that automated monitoring flags but can't explain. Reads field mapping configs, API change logs, and data schemas to identify root causes and generate specific fix instructions."
source_id: "root-cause-diagnosis"
generation_status: inferred
tags:
  - marketing
  - okf
  - brd
timestamp: "2026-07-01T00:00:00.000Z"
---

# Gemini diagnoses complex integration failures that automated monitoring flags but can't explain. Reads field mapping configs, API change logs, and data schemas to identify root causes and generate specific fix instructions.

## Tools used

- [lookup_martech_stack_health_monitor_playbook](/tools/lookup-martech-stack-health-monitor-playbook.md)

## Runs in

- [root_cause_diagnosis](/workflow/root-cause-diagnosis.md)

## Evidence expected

- document_reference

## Evals

- [Run the MarTech Stack Health Monitor workflow for the current period. Cite the relevant source-system evidence and surface any escalations required.](/tests/martech-stack-health-monitor-end-to-end.md)

# Citations

- [MarTech Stack Health Monitor Playbook](/documents/martech-stack-health-monitor-playbook.md)
