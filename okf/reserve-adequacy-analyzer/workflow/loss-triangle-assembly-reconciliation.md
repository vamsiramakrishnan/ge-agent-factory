---
type: Workflow Stage
title: "Loss Triangle Assembly & Reconciliation"
description: "Pull claims, claim_exposures, and reserve_lines from Guidewire ClaimCenter (query_guidewire_claimcenter_claims) and reconcile transaction-level detail into segment-level loss triangles staged in BigQuery."
source_id: loss_triangle_assembly_reconciliation
tags:
  - insurance
  - okf
  - brd
timestamp: "2026-07-04T00:00:00.000Z"
---

# Loss Triangle Assembly & Reconciliation

Pull claims, claim_exposures, and reserve_lines from Guidewire ClaimCenter (query_guidewire_claimcenter_claims) and reconcile transaction-level detail into segment-level loss triangles staged in BigQuery.

- **Mode:** sequential
- **Stage:** 1 of 6

## Tools

- [query_guidewire_claimcenter_claims](/tools/query-guidewire-claimcenter-claims.md)
- [query_bigquery_analytics_events](/tools/query-bigquery-analytics-events.md)
- [lookup_reserve_adequacy_analyzer_authority_guide](/tools/lookup-reserve-adequacy-analyzer-authority-guide.md)
- [action_guidewire_claimcenter_draft](/tools/action-guidewire-claimcenter-draft.md)

Next: [Development Method Diagnostics](/workflow/development-method-diagnostics.md)
