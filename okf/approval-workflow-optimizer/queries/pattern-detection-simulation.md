---
type: Query Capability
title: "Detect rubber-stamping via <30s approval times, identify bottleneck approvers..."
description: "Detect rubber-stamping via <30s approval times, identify bottleneck approvers via queue depth analysis, and analyze delegation gaps. Simulate threshold changes to project efficiency gains and risk exposure."
source_id: "pattern-detection-simulation"
generation_status: inferred
tags:
  - procurement
  - okf
  - brd
timestamp: "2026-07-01T00:00:00.000Z"
---

# Detect rubber-stamping via <30s approval times, identify bottleneck approvers via queue depth analysis, and analyze delegation gaps. Simulate threshold changes to project efficiency gains and risk exposure.

## Tools used

- [lookup_approval_workflow_optimizer_policy_guide](/tools/lookup-approval-workflow-optimizer-policy-guide.md)
- [action_coupa_ariba_workflow_approve](/tools/action-coupa-ariba-workflow-approve.md)

## Runs in

- [pattern_detection_simulation](/workflow/pattern-detection-simulation.md)

## Evidence expected

- document_reference
- api_response
- generated_audit_trail

## Evals

- [Run the Approval Workflow Optimizer workflow for the current period. Cite the relevant source-system evidence and surface any escalations required.](/tests/approval-workflow-optimizer-end-to-end.md)

# Citations

- [Approval Workflow Optimizer Procurement Policy Guide](/documents/approval-workflow-optimizer-policy-guide.md)
