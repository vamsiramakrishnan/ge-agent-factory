---
type: Query Capability
title: "Confirm asset return, process final pay, generate compliance notices (COBRA, ..."
description: "Confirm asset return, process final pay, generate compliance notices (COBRA, etc.). Send status updates via Slack and close offboarding case."
source_id: "closeout-compliance"
generation_status: inferred
tags:
  - hr
  - okf
  - brd
timestamp: "2026-07-01T00:00:00.000Z"
---

# Confirm asset return, process final pay, generate compliance notices (COBRA, etc.). Send status updates via Slack and close offboarding case.

## Tools used

- [lookup_offboarding_orchestration_policy_handbook](/tools/lookup-offboarding-orchestration-policy-handbook.md)

## Runs in

- [closeout_compliance](/workflow/closeout-compliance.md)

## Evidence expected

- document_reference

## Evals

- [Run the Offboarding Orchestration workflow for the current period. Cite the relevant source-system evidence and surface any escalations required.](/tests/offboarding-orchestration-end-to-end.md)

# Citations

- [Offboarding Orchestration Policy Handbook](/documents/offboarding-orchestration-policy-handbook.md)
