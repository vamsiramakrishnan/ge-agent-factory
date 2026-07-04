---
type: Query Capability
title: "Continuously ingest GL postings from SAP. Capture posting amount, account com..."
description: "Continuously ingest GL postings from SAP. Capture posting amount, account combination, user, timestamp, and memo field for analysis."
source_id: "gl-posting-ingestion"
generation_status: inferred
tags:
  - finance
  - okf
  - brd
timestamp: "2026-07-01T00:00:00.000Z"
---

# Continuously ingest GL postings from SAP. Capture posting amount, account combination, user, timestamp, and memo field for analysis.

## Tools used

- [query_sap_s_4hana_fi_gl_entries](/tools/query-sap-s-4hana-fi-gl-entries.md)
- [action_sap_s_4hana_fi_post](/tools/action-sap-s-4hana-fi-post.md)

## Runs in

- [gl_posting_ingestion](/workflow/gl-posting-ingestion.md)

## Evidence expected

- source_system_record
- api_response
- generated_audit_trail

## Evals

- [Run the GL Anomaly Detector workflow for the current period. Cite the relevant source-system evidence and surface any escalations required.](/tests/gl-anomaly-detector-end-to-end.md)

# Citations

- [GL Anomaly Detector Controls Playbook](/documents/gl-anomaly-detector-controls-playbook.md)
