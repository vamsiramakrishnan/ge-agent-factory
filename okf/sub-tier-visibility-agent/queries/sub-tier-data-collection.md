---
type: Query Capability
title: "Distribute CMRT/CRT questionnaires to tier-1 suppliers, collect responses, an..."
description: "Distribute CMRT/CRT questionnaires to tier-1 suppliers, collect responses, and ingest Resilinc/Everstream sub-tier supplier data. Parse responses for sub-tier entity names, locations, and material flows."
source_id: "sub-tier-data-collection"
generation_status: inferred
tags:
  - procurement
  - okf
  - brd
timestamp: "2026-07-01T00:00:00.000Z"
---

# Distribute CMRT/CRT questionnaires to tier-1 suppliers, collect responses, and ingest Resilinc/Everstream sub-tier supplier data. Parse responses for sub-tier entity names, locations, and material flows.

## Tools used

- [query_resilinc_resilinc_records](/tools/query-resilinc-resilinc-records.md)
- [query_everstream_everstream_records](/tools/query-everstream-everstream-records.md)
- [query_cmrt_crt_questionnaires_cmrt_crt_questionnaires_records](/tools/query-cmrt-crt-questionnaires-cmrt-crt-questionnaires-records.md)
- [lookup_sub_tier_visibility_agent_policy_guide](/tools/lookup-sub-tier-visibility-agent-policy-guide.md)
- [action_resilinc_log_entry](/tools/action-resilinc-log-entry.md)

## Runs in

- [sub_tier_data_collection](/workflow/sub-tier-data-collection.md)

## Evidence expected

- source_system_record
- document_reference
- api_response
- generated_audit_trail

## Evals

- [Run the Sub-Tier Visibility Agent workflow for the current period. Cite the relevant source-system evidence and surface any escalations required.](/tests/sub-tier-visibility-agent-end-to-end.md)

# Citations

- [Sub-Tier Visibility Agent Procurement Policy Guide](/documents/sub-tier-visibility-agent-policy-guide.md)
