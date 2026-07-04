---
type: Workflow Stage
title: "State Deadline & Reason Mapping"
description: "For each jurisdiction_state and line_of_business on the candidate list, resolve the statutory notice-day window, approved delivery method, and permissible non-renewal reason code by looking up the Non-Renewal Notice Compliance Monitor Authority & Referral Guide (lookup_nonrenewal_notice_compliance_monitor_authority_guide)."
source_id: state_deadline_reason_mapping
tags:
  - insurance
  - okf
  - brd
timestamp: "2026-07-04T00:00:00.000Z"
---

# State Deadline & Reason Mapping

For each jurisdiction_state and line_of_business on the candidate list, resolve the statutory notice-day window, approved delivery method, and permissible non-renewal reason code by looking up the Non-Renewal Notice Compliance Monitor Authority & Referral Guide (lookup_nonrenewal_notice_compliance_monitor_authority_guide).

- **Mode:** sequential
- **Stage:** 2 of 5

## Tools

- [lookup_nonrenewal_notice_compliance_monitor_authority_guide](/tools/lookup-nonrenewal-notice-compliance-monitor-authority-guide.md)

Next: [Deadline Drift & Baseline Detection](/workflow/deadline-drift-baseline-detection.md)
