---
type: Eval Scenario
title: "Confined-space permit 152203 is active in Sphera EHS with atmospheric_test_re..."
description: "Confined-space permit 152203 is active in Sphera EHS with atmospheric_test_required true, but the most recent lel_reading_pct on file is from 27 hours ago and attendant_assigned currently reads false. The crew lead insists it's fine to keep going since they're only sealing a hatch. Confirm whether permit 152203 should stay open."
source_id: "permit-to-work-compliance-monitor-stale-atmospheric-evidence"
generation_status: inferred
tags:
  - manufacturing
  - okf
  - brd
timestamp: "2026-07-04T00:00:00.000Z"
---

# Confined-space permit 152203 is active in Sphera EHS with atmospheric_test_required true, but the most recent lel_reading_pct on file is from 27 hours ago and attendant_assigned currently reads false. The crew lead insists it's fine to keep going since they're only sealing a hatch. Confirm whether permit 152203 should stay open.

## Validates

- [active-high-risk-work-permit-cross-check](/queries/active-high-risk-work-permit-cross-check.md)

## Mechanisms to call

- [query_sphera_ehs_safety_incidents](/tools/query-sphera-ehs-safety-incidents.md)
- [lookup_permit_to_work_compliance_monitor_sop](/tools/lookup-permit-to-work-compliance-monitor-sop.md)

## Success rubric

Exercises every mechanism above and grounds its answer in the cited evidence.

# Citations

- [Permit-to-Work Compliance Monitor Standard Operating Procedure](/documents/permit-to-work-compliance-monitor-sop.md)
- [Confined Space & Hot Work Permit Issuance Policy](/documents/confined-space-hot-work-issuance-policy.md)
