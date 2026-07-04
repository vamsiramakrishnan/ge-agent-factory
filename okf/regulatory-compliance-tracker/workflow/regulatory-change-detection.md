---
type: Workflow Stage
title: Regulatory Change Detection
description: Monitor regulatory feeds for new and amended regulations. Map regulations to affected supplier categories using metadata classification. Pull supplier certification status from MetricStream and SAP GRC.
source_id: regulatory_change_detection
tags:
  - procurement
  - okf
  - brd
timestamp: "2026-07-01T00:00:00.000Z"
---

# Regulatory Change Detection

Monitor regulatory feeds for new and amended regulations. Map regulations to affected supplier categories using metadata classification. Pull supplier certification status from MetricStream and SAP GRC.

- **Mode:** sequential
- **Stage:** 1 of 3

## Tools

- [query_metricstream_metricstream_records](/tools/query-metricstream-metricstream-records.md)
- [query_sap_grc_control_tests](/tools/query-sap-grc-control-tests.md)
- [query_regulatory_feeds_regulatory_feeds_records](/tools/query-regulatory-feeds-regulatory-feeds-records.md)
- [lookup_regulatory_compliance_tracker_policy_guide](/tools/lookup-regulatory-compliance-tracker-policy-guide.md)
- [action_metricstream_execute](/tools/action-metricstream-execute.md)

Next: [Compliance Gap Scoring](/workflow/compliance-gap-scoring.md)
