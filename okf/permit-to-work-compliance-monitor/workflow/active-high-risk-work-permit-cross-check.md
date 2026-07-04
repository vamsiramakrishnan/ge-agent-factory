---
type: Workflow Stage
title: "Active High-Risk Work & Permit Cross-Check"
description: "Pull every permit_records entry with permit_status issued or active from Sphera EHS and correlate permit_type against open safety_incidents and in-progress ServiceNow tickets to confirm each high-risk job in the field has a matching, non-expired permit."
source_id: active_high_risk_work_permit_cross_check
tags:
  - manufacturing
  - okf
  - brd
timestamp: "2026-07-04T00:00:00.000Z"
---

# Active High-Risk Work & Permit Cross-Check

Pull every permit_records entry with permit_status issued or active from Sphera EHS and correlate permit_type against open safety_incidents and in-progress ServiceNow tickets to confirm each high-risk job in the field has a matching, non-expired permit.

- **Mode:** sequential
- **Stage:** 1 of 5

## Tools

- [query_sphera_ehs_safety_incidents](/tools/query-sphera-ehs-safety-incidents.md)
- [query_servicenow_tickets](/tools/query-servicenow-tickets.md)
- [lookup_permit_to_work_compliance_monitor_sop](/tools/lookup-permit-to-work-compliance-monitor-sop.md)
- [action_sphera_ehs_generate](/tools/action-sphera-ehs-generate.md)

Next: [Isolation & Atmospheric Prerequisite Verification](/workflow/isolation-atmospheric-prerequisite-verification.md)
