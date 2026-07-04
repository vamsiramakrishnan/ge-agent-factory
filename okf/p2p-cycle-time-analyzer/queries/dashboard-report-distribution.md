---
type: Query Capability
title: "Publish cycle time metrics, bottleneck visualizations, and recommendation nar..."
description: "Publish cycle time metrics, bottleneck visualizations, and recommendation narratives to Looker dashboard. Distribute weekly reports to P2P Ops Manager."
source_id: "dashboard-report-distribution"
generation_status: inferred
tags:
  - procurement
  - okf
  - brd
timestamp: "2026-07-01T00:00:00.000Z"
---

# Publish cycle time metrics, bottleneck visualizations, and recommendation narratives to Looker dashboard. Distribute weekly reports to P2P Ops Manager.

## Tools used

- [lookup_p2p_cycle_time_analyzer_policy_guide](/tools/lookup-p2p-cycle-time-analyzer-policy-guide.md)
- [action_sap_s_4hana_recommend](/tools/action-sap-s-4hana-recommend.md)

## Runs in

- [dashboard_report_distribution](/workflow/dashboard-report-distribution.md)

## Evidence expected

- document_reference
- api_response
- generated_audit_trail

## Evals

- [Run the P2P Cycle Time Analyzer workflow for the current period. Cite the relevant source-system evidence and surface any escalations required.](/tests/p2p-cycle-time-analyzer-end-to-end.md)

# Citations

- [P2P Cycle Time Analyzer Procurement Policy Guide](/documents/p2p-cycle-time-analyzer-policy-guide.md)
