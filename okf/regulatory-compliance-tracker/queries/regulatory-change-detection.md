---
type: Query Capability
title: Monitor regulatory feeds for new and amended regulations. Map regulations to ...
description: Monitor regulatory feeds for new and amended regulations. Map regulations to affected supplier categories using metadata classification. Pull supplier certification status from MetricStream and SAP GRC.
source_id: "regulatory-change-detection"
generation_status: inferred
tags:
  - procurement
  - okf
  - brd
timestamp: "2026-07-01T00:00:00.000Z"
---

# Monitor regulatory feeds for new and amended regulations. Map regulations to affected supplier categories using metadata classification. Pull supplier certification status from MetricStream and SAP GRC.

## Tools used

- [query_metricstream_metricstream_records](/tools/query-metricstream-metricstream-records.md)
- [query_sap_grc_control_tests](/tools/query-sap-grc-control-tests.md)
- [query_regulatory_feeds_regulatory_feeds_records](/tools/query-regulatory-feeds-regulatory-feeds-records.md)
- [lookup_regulatory_compliance_tracker_policy_guide](/tools/lookup-regulatory-compliance-tracker-policy-guide.md)
- [action_metricstream_execute](/tools/action-metricstream-execute.md)

## Runs in

- [regulatory_change_detection](/workflow/regulatory-change-detection.md)

## Evidence expected

- source_system_record
- document_reference
- api_response
- generated_audit_trail

## Evals

- [Run the Regulatory Compliance Tracker workflow for the current period. Cite the relevant source-system evidence and surface any escalations required.](/tests/regulatory-compliance-tracker-end-to-end.md)

# Citations

- [Regulatory Compliance Tracker Procurement Policy Guide](/documents/regulatory-compliance-tracker-policy-guide.md)
