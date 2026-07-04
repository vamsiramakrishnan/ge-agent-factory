---
type: Query Capability
title: "Gemini synthesizes a reference architecture from patterns, constraints, and b..."
description: "Gemini synthesizes a reference architecture from patterns, constraints, and benchmarks. Selects components from the approved tech stack, estimates costs at multiple scale points, and identifies operational requirements."
source_id: "architecture-synthesis"
generation_status: inferred
tags:
  - it
  - okf
  - brd
timestamp: "2026-07-01T00:00:00.000Z"
---

# Gemini synthesizes a reference architecture from patterns, constraints, and benchmarks. Selects components from the approved tech stack, estimates costs at multiple scale points, and identifies operational requirements.

## Tools used

- [lookup_reference_architecture_generator_runbook](/tools/lookup-reference-architecture-generator-runbook.md)

## Runs in

- [architecture_synthesis](/workflow/architecture-synthesis.md)

## Evidence expected

- document_reference

## Evals

- [Run the Reference Architecture Generator workflow for the current period. Cite the relevant source-system evidence and surface any escalations required.](/tests/reference-architecture-generator-end-to-end.md)

# Citations

- [Reference Architecture Generator Operations Runbook](/documents/reference-architecture-generator-runbook.md)
