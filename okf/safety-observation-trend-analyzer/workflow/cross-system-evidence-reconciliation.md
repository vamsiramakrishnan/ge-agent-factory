---
type: Workflow Stage
title: "Cross-System Evidence Reconciliation"
description: "Reconcile safety_incidents clusters against permit_records (LOTO, hot work, confined space entry) and emissions_readings exceedances so permit or atmospheric-monitoring gaps aren't mistaken for pure behavioral trends."
source_id: cross_system_evidence_reconciliation
tags:
  - manufacturing
  - okf
  - brd
timestamp: "2026-07-04T00:00:00.000Z"
---

# Cross-System Evidence Reconciliation

Reconcile safety_incidents clusters against permit_records (LOTO, hot work, confined space entry) and emissions_readings exceedances so permit or atmospheric-monitoring gaps aren't mistaken for pure behavioral trends.

- **Mode:** sequential
- **Stage:** 3 of 6

## Tools

- [query_sphera_ehs_safety_incidents](/tools/query-sphera-ehs-safety-incidents.md)
- [lookup_safety_observation_trend_analyzer_sop](/tools/lookup-safety-observation-trend-analyzer-sop.md)

Next: [Policy & Playbook Citation Gate](/workflow/policy-playbook-citation-gate.md)
