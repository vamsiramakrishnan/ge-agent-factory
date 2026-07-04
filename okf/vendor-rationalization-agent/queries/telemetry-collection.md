---
type: Query Capability
title: "Pull software inventory from ServiceNow SAM, SaaS spend and usage from Zylo, ..."
description: "Pull software inventory from ServiceNow SAM, SaaS spend and usage from Zylo, and SSO login frequency from Okta. Build comprehensive view of tool landscape."
source_id: "telemetry-collection"
generation_status: inferred
tags:
  - it
  - okf
  - brd
timestamp: "2026-07-01T00:00:00.000Z"
---

# Pull software inventory from ServiceNow SAM, SaaS spend and usage from Zylo, and SSO login frequency from Okta. Build comprehensive view of tool landscape.

## Tools used

- [query_servicenow_sam_tickets](/tools/query-servicenow-sam-tickets.md)
- [query_zylo_zylo_records](/tools/query-zylo-zylo-records.md)
- [query_okta_users](/tools/query-okta-users.md)
- [action_servicenow_sam_recommend](/tools/action-servicenow-sam-recommend.md)

## Runs in

- [telemetry_collection](/workflow/telemetry-collection.md)

## Evidence expected

- source_system_record
- api_response
- generated_audit_trail

## Evals

- [Run the Vendor Rationalization Agent workflow for the current period. Cite the relevant source-system evidence and surface any escalations required.](/tests/vendor-rationalization-agent-end-to-end.md)

# Citations

- [Vendor Rationalization Agent Operations Runbook](/documents/vendor-rationalization-agent-runbook.md)
