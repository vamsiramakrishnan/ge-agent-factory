---
type: Query Capability
title: Compare statutory withholding rate with treaty rate. Track annual thresholds ...
description: "Compare statutory withholding rate with treaty rate. Track annual thresholds for de minimis exemptions. Calculate withholding amount. Check for prior W-8BEN/E documentation."
source_id: "rate-determination"
generation_status: inferred
tags:
  - finance
  - okf
  - brd
timestamp: "2026-07-01T00:00:00.000Z"
---

# Compare statutory withholding rate with treaty rate. Track annual thresholds for de minimis exemptions. Calculate withholding amount. Check for prior W-8BEN/E documentation.

## Tools used

- [lookup_withholding_tax_agent_controls_playbook](/tools/lookup-withholding-tax-agent-controls-playbook.md)

## Runs in

- [rate_determination](/workflow/rate-determination.md)

## Evidence expected

- document_reference

## Evals

- [Run the Withholding Tax Agent workflow for the current period. Cite the relevant source-system evidence and surface any escalations required.](/tests/withholding-tax-agent-end-to-end.md)

# Citations

- [Withholding Tax Agent Controls Playbook](/documents/withholding-tax-agent-controls-playbook.md)
