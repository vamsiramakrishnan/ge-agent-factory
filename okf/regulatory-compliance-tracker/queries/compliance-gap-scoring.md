---
type: Query Capability
title: Score compliance gaps by comparing existing supplier certifications against n...
description: Score compliance gaps by comparing existing supplier certifications against new regulatory requirements. Track certification expiry and renewal timelines across the supply base.
source_id: "compliance-gap-scoring"
generation_status: inferred
tags:
  - procurement
  - okf
  - brd
timestamp: "2026-07-01T00:00:00.000Z"
---

# Score compliance gaps by comparing existing supplier certifications against new regulatory requirements. Track certification expiry and renewal timelines across the supply base.

## Tools used

- [query_regulatory_feeds_regulatory_feeds_records](/tools/query-regulatory-feeds-regulatory-feeds-records.md)
- [lookup_regulatory_compliance_tracker_policy_guide](/tools/lookup-regulatory-compliance-tracker-policy-guide.md)

## Runs in

- [compliance_gap_scoring](/workflow/compliance-gap-scoring.md)

## Evidence expected

- source_system_record
- document_reference

## Evals

- [Run the Regulatory Compliance Tracker workflow for the current period. Cite the relevant source-system evidence and surface any escalations required.](/tests/regulatory-compliance-tracker-end-to-end.md)

# Citations

- [Regulatory Compliance Tracker Procurement Policy Guide](/documents/regulatory-compliance-tracker-policy-guide.md)
