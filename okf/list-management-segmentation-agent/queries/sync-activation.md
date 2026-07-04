---
type: Query Capability
title: "Sync finalized list to campaign platforms (MAP, ad platforms). Maintain dynam..."
description: "Sync finalized list to campaign platforms (MAP, ad platforms). Maintain dynamic segments for ongoing campaigns. Track list performance post-deployment."
source_id: "sync-activation"
generation_status: inferred
tags:
  - marketing
  - okf
  - brd
timestamp: "2026-07-01T00:00:00.000Z"
---

# Sync finalized list to campaign platforms (MAP, ad platforms). Maintain dynamic segments for ongoing campaigns. Track list performance post-deployment.

## Tools used

- [query_marketo_campaigns](/tools/query-marketo-campaigns.md)
- [lookup_list_management_segmentation_agent_playbook](/tools/lookup-list-management-segmentation-agent-playbook.md)

## Runs in

- [sync_activation](/workflow/sync-activation.md)

## Evidence expected

- source_system_record
- document_reference

## Evals

- [Run the List Management & Segmentation Agent workflow for the current period. Cite the relevant source-system evidence and surface any escalations required.](/tests/list-management-segmentation-agent-end-to-end.md)

# Citations

- [List Management & Segmentation Agent Playbook](/documents/list-management-segmentation-agent-playbook.md)
