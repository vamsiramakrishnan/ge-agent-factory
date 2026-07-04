---
type: Query Capability
title: "Interpret campaign brief to generate ad copy, social graphics text, email hea..."
description: "Interpret campaign brief to generate ad copy, social graphics text, email headers, and display ad variations. Reason about messaging angles for target audience and funnel stage. Generate alt-text and accessibility descriptions."
source_id: "copy-variation-generation"
generation_status: inferred
tags:
  - marketing
  - okf
  - brd
timestamp: "2026-07-01T00:00:00.000Z"
---

# Interpret campaign brief to generate ad copy, social graphics text, email headers, and display ad variations. Reason about messaging angles for target audience and funnel stage. Generate alt-text and accessibility descriptions.

## Tools used

- [action_figma_generate](/tools/action-figma-generate.md)

## Runs in

- [copy_variation_generation](/workflow/copy-variation-generation.md)

## Evidence expected

- api_response
- generated_audit_trail

## Evals

- [Run the Creative Asset Generator workflow for the current period. Cite the relevant source-system evidence and surface any escalations required.](/tests/creative-asset-generator-end-to-end.md)

# Citations

- [Creative Asset Generator Playbook](/documents/creative-asset-generator-playbook.md)
