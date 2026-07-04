---
type: Query Capability
title: "Receive email draft from MAP. Parse body content, audience segment, campaign ..."
description: "Receive email draft from MAP. Parse body content, audience segment, campaign context, and funnel stage to inform optimization."
source_id: "email-analysis"
generation_status: inferred
tags:
  - marketing
  - okf
  - brd
timestamp: "2026-07-01T00:00:00.000Z"
---

# Receive email draft from MAP. Parse body content, audience segment, campaign context, and funnel stage to inform optimization.

## Tools used

- [lookup_email_copy_optimizer_playbook](/tools/lookup-email-copy-optimizer-playbook.md)

## Runs in

- [email_analysis](/workflow/email-analysis.md)

## Evidence expected

- document_reference

## Evals

- [Run the Email Copy Optimizer workflow for the current period. Cite the relevant source-system evidence and surface any escalations required.](/tests/email-copy-optimizer-end-to-end.md)

# Citations

- [Email Copy Optimizer Playbook](/documents/email-copy-optimizer-playbook.md)
