---
type: Query Capability
title: Apply determined withholding rate to payment. Generate withholding tax certif...
description: "Apply determined withholding rate to payment. Generate withholding tax certificates. Accumulate data for annual reporting (1042-S, Form 945)."
source_id: "application-reporting"
generation_status: inferred
tags:
  - finance
  - okf
  - brd
timestamp: "2026-07-01T00:00:00.000Z"
---

# Apply determined withholding rate to payment. Generate withholding tax certificates. Accumulate data for annual reporting (1042-S, Form 945).

## Tools used

- [lookup_withholding_tax_agent_controls_playbook](/tools/lookup-withholding-tax-agent-controls-playbook.md)

## Runs in

- [application_reporting](/workflow/application-reporting.md)

## Evidence expected

- document_reference

## Evals

- [Run the Withholding Tax Agent workflow for the current period. Cite the relevant source-system evidence and surface any escalations required.](/tests/withholding-tax-agent-end-to-end.md)

# Citations

- [Withholding Tax Agent Controls Playbook](/documents/withholding-tax-agent-controls-playbook.md)
