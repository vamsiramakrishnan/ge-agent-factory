---
type: Query Capability
title: Run workflow with test contacts to validate logic paths. After Ops Lead appro...
description: "Run workflow with test contacts to validate logic paths. After Ops Lead approval, deploy to production with monitoring for the first 48 hours."
source_id: "testing-deployment"
generation_status: inferred
tags:
  - marketing
  - okf
  - brd
timestamp: "2026-07-01T00:00:00.000Z"
---

# Run workflow with test contacts to validate logic paths. After Ops Lead approval, deploy to production with monitoring for the first 48 hours.

## Tools used

- [query_hubspot_contacts](/tools/query-hubspot-contacts.md)
- [lookup_campaign_ops_workflow_builder_playbook](/tools/lookup-campaign-ops-workflow-builder-playbook.md)

## Runs in

- [testing_deployment](/workflow/testing-deployment.md)

## Evidence expected

- source_system_record
- document_reference

## Evals

- [Run the Campaign Ops Workflow Builder workflow for the current period. Cite the relevant source-system evidence and surface any escalations required.](/tests/campaign-ops-workflow-builder-end-to-end.md)

# Citations

- [Campaign Ops Workflow Builder Playbook](/documents/campaign-ops-workflow-builder-playbook.md)
