---
type: Workflow Stage
title: "Evidence Pack Generation & Audit Trail"
description: "Execute action_sphera_ehs_generate to assemble the permit compliance evidence pack in Sphera EHS with a full audit trail, and log every exception to BigQuery cached_aggregates for trend review."
source_id: evidence_pack_generation_audit_trail
tags:
  - manufacturing
  - okf
  - brd
timestamp: "2026-07-04T00:00:00.000Z"
---

# Evidence Pack Generation & Audit Trail

Execute action_sphera_ehs_generate to assemble the permit compliance evidence pack in Sphera EHS with a full audit trail, and log every exception to BigQuery cached_aggregates for trend review.

- **Mode:** sequential
- **Stage:** 5 of 5

## Tools

- [query_sphera_ehs_safety_incidents](/tools/query-sphera-ehs-safety-incidents.md)
- [query_bigquery_analytics_events](/tools/query-bigquery-analytics-events.md)
- [lookup_permit_to_work_compliance_monitor_sop](/tools/lookup-permit-to-work-compliance-monitor-sop.md)
- [action_sphera_ehs_generate](/tools/action-sphera-ehs-generate.md)
