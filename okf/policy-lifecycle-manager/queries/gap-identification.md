---
type: Query Capability
title: "Compare current policy text against latest regulations, recent incident findi..."
description: "Compare current policy text against latest regulations, recent incident findings, and industry benchmarks. Identify sections that are outdated, contradictory, or missing required content."
source_id: "gap-identification"
generation_status: inferred
tags:
  - it
  - okf
  - brd
timestamp: "2026-07-01T00:00:00.000Z"
---

# Compare current policy text against latest regulations, recent incident findings, and industry benchmarks. Identify sections that are outdated, contradictory, or missing required content.

## Tools used

- [lookup_policy_lifecycle_manager_runbook](/tools/lookup-policy-lifecycle-manager-runbook.md)

## Runs in

- [gap_identification](/workflow/gap-identification.md)

## Evidence expected

- document_reference

## Evals

- [Run the Policy Lifecycle Manager workflow for the current period. Cite the relevant source-system evidence and surface any escalations required.](/tests/policy-lifecycle-manager-end-to-end.md)

# Citations

- [Policy Lifecycle Manager Operations Runbook](/documents/policy-lifecycle-manager-runbook.md)
