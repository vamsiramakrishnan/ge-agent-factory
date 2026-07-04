---
type: Query Capability
title: "Interpret natural language workflow description and extract triggers, conditi..."
description: "Interpret natural language workflow description and extract triggers, conditions, actions, exclusions, and timing requirements. Identify ambiguities and ask clarifying questions."
source_id: "requirement-parsing"
generation_status: inferred
tags:
  - marketing
  - okf
  - brd
timestamp: "2026-07-01T00:00:00.000Z"
---

# Interpret natural language workflow description and extract triggers, conditions, actions, exclusions, and timing requirements. Identify ambiguities and ask clarifying questions.

## Tools used

- [lookup_campaign_ops_workflow_builder_playbook](/tools/lookup-campaign-ops-workflow-builder-playbook.md)

## Runs in

- [requirement_parsing](/workflow/requirement-parsing.md)

## Evidence expected

- document_reference

## Evals

- [Run the Campaign Ops Workflow Builder workflow for the current period. Cite the relevant source-system evidence and surface any escalations required.](/tests/campaign-ops-workflow-builder-end-to-end.md)

# Citations

- [Campaign Ops Workflow Builder Playbook](/documents/campaign-ops-workflow-builder-playbook.md)
