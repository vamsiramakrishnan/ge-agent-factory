---
type: Workflow Stage
title: "Non-Renewal Candidate Identification"
description: "Query policies and policy_quotes from Guidewire PolicyCenter (query_guidewire_policycenter_policies) for records approaching expiration_date or already flagged policy_status = non_renewed, cross-checked against underwriting_submissions to confirm underwriting actually intends non-renewal rather than a routine renewal."
source_id: non_renewal_candidate_identification
tags:
  - insurance
  - okf
  - brd
timestamp: "2026-07-04T00:00:00.000Z"
---

# Non-Renewal Candidate Identification

Query policies and policy_quotes from Guidewire PolicyCenter (query_guidewire_policycenter_policies) for records approaching expiration_date or already flagged policy_status = non_renewed, cross-checked against underwriting_submissions to confirm underwriting actually intends non-renewal rather than a routine renewal.

- **Mode:** sequential
- **Stage:** 1 of 5

## Tools

- [query_guidewire_policycenter_policies](/tools/query-guidewire-policycenter-policies.md)
- [query_insurance_3_insurance_3_records](/tools/query-insurance-3-insurance-3-records.md)
- [lookup_nonrenewal_notice_compliance_monitor_authority_guide](/tools/lookup-nonrenewal-notice-compliance-monitor-authority-guide.md)
- [action_guidewire_policycenter_publish](/tools/action-guidewire-policycenter-publish.md)

Next: [State Deadline & Reason Mapping](/workflow/state-deadline-reason-mapping.md)
