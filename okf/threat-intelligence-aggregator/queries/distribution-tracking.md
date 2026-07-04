---
type: Query Capability
title: Threat advisory distributed to relevant teams based on affected assets. Remed...
description: Threat advisory distributed to relevant teams based on affected assets. Remediation actions tracked through to completion.
source_id: "distribution-tracking"
generation_status: inferred
tags:
  - it
  - okf
  - brd
timestamp: "2026-07-01T00:00:00.000Z"
---

# Threat advisory distributed to relevant teams based on affected assets. Remediation actions tracked through to completion.

## Tools used

- [lookup_threat_intelligence_aggregator_runbook](/tools/lookup-threat-intelligence-aggregator-runbook.md)

## Runs in

- [distribution_tracking](/workflow/distribution-tracking.md)

## Evidence expected

- document_reference

## Evals

- [Run the Threat Intelligence Aggregator workflow for the current period. Cite the relevant source-system evidence and surface any escalations required.](/tests/threat-intelligence-aggregator-end-to-end.md)

# Citations

- [Threat Intelligence Aggregator Operations Runbook](/documents/threat-intelligence-aggregator-runbook.md)
