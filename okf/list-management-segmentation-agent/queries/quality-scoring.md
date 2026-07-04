---
type: Query Capability
title: "Score list quality: deliverability estimates, segment overlap with concurrent..."
description: "Score list quality: deliverability estimates, segment overlap with concurrent campaigns, data decay rate, and engagement recency distribution."
source_id: "quality-scoring"
generation_status: inferred
tags:
  - marketing
  - okf
  - brd
timestamp: "2026-07-01T00:00:00.000Z"
---

# Score list quality: deliverability estimates, segment overlap with concurrent campaigns, data decay rate, and engagement recency distribution.

## Tools used

- [query_marketo_campaigns](/tools/query-marketo-campaigns.md)
- [lookup_list_management_segmentation_agent_playbook](/tools/lookup-list-management-segmentation-agent-playbook.md)

## Runs in

- [quality_scoring](/workflow/quality-scoring.md)

## Evidence expected

- source_system_record
- document_reference

## Evals

- [Run the List Management & Segmentation Agent workflow for the current period. Cite the relevant source-system evidence and surface any escalations required.](/tests/list-management-segmentation-agent-end-to-end.md)

# Citations

- [List Management & Segmentation Agent Playbook](/documents/list-management-segmentation-agent-playbook.md)
