---
type: Index
title: Query Capabilities
description: "The questions and requests this agent can answer, each with the tools it uses."
timestamp: "2026-07-04T00:00:00.000Z"
---

# Query Capabilities

- [Pull every permit_records entry with permit_status issued or active from Sphera EHS and correlate permit_type against open safety_incidents and in-progress ServiceNow tickets to confirm each high-risk job in the field has a matching, non-expired permit.](/queries/active-high-risk-work-permit-cross-check.md)
- [Verify atmospheric_test_required, lel_reading_pct, and attendant_assigned on every confined_space_entry and hot_work permit_records row, and confirm loto isolation prerequisites before treating a permit as clear to continue.](/queries/isolation-atmospheric-prerequisite-verification.md)
- [Compute issue_date plus valid_hours for each active permit_records entry to catch permits running past expiration, and cross-check emissions_readings exceedance flags against BigQuery historical_metrics and analytics_events baselines for the same reporting period.](/queries/permit-clock-emissions-deviation-correlation.md)
- [Cite the Permit-to-Work Compliance Monitor Standard Operating Procedure and the Confined Space & Hot Work Permit Issuance Policy before notifying the area supervisor and EHS Manager of a missing, expired, or mismatched permit, and route atmospheric or permit-clock violations to the correct escalation target.](/queries/sop-gated-notification-escalation.md)
- [Execute action_sphera_ehs_generate to assemble the permit compliance evidence pack in Sphera EHS with a full audit trail, and log every exception to BigQuery cached_aggregates for trend review.](/queries/evidence-pack-generation-audit-trail.md)
