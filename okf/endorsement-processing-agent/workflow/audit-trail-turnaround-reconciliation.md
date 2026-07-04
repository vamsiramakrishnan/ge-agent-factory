---
type: Workflow Stage
title: "Audit Trail & Turnaround Reconciliation"
description: "Log the generated_audit_trail for every routed transaction and reconcile Endorsement turnaround time and touchless-processing rate against analytics_events and historical_metrics in BigQuery for the Policy Services Rep queue."
source_id: audit_trail_turnaround_reconciliation
tags:
  - insurance
  - okf
  - brd
timestamp: "2026-07-04T00:00:00.000Z"
---

# Audit Trail & Turnaround Reconciliation

Log the generated_audit_trail for every routed transaction and reconcile Endorsement turnaround time and touchless-processing rate against analytics_events and historical_metrics in BigQuery for the Policy Services Rep queue.

- **Mode:** sequential
- **Stage:** 5 of 5

## Tools

- [query_bigquery_analytics_events](/tools/query-bigquery-analytics-events.md)
- [lookup_endorsement_processing_agent_authority_guide](/tools/lookup-endorsement-processing-agent-authority-guide.md)
- [action_guidewire_policycenter_route](/tools/action-guidewire-policycenter-route.md)
