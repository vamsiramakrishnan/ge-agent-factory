---
type: Eval Scenario
title: Run the Regulatory Compliance Tracker workflow for the current period. Cite t...
description: "Run the Regulatory Compliance Tracker workflow for the current period. Cite the relevant source-system evidence and surface any escalations required."
source_id: "regulatory-compliance-tracker-end-to-end"
generation_status: inferred
tags:
  - procurement
  - okf
  - brd
timestamp: "2026-07-01T00:00:00.000Z"
---

# Run the Regulatory Compliance Tracker workflow for the current period. Cite the relevant source-system evidence and surface any escalations required.

## Validates

- [regulatory-change-detection](/queries/regulatory-change-detection.md)

## Mechanisms to call

- [query_metricstream_metricstream_records](/tools/query-metricstream-metricstream-records.md)
- [query_sap_grc_control_tests](/tools/query-sap-grc-control-tests.md)
- [query_regulatory_feeds_regulatory_feeds_records](/tools/query-regulatory-feeds-regulatory-feeds-records.md)
- [lookup_regulatory_compliance_tracker_policy_guide](/tools/lookup-regulatory-compliance-tracker-policy-guide.md)
- [action_metricstream_execute](/tools/action-metricstream-execute.md)

## Success rubric

Action execute executed against MetricStream, with audit-trail entry and Compliance Manager notified of outcomes.

# Citations

- [Regulatory Compliance Tracker Procurement Policy Guide](/documents/regulatory-compliance-tracker-policy-guide.md)
