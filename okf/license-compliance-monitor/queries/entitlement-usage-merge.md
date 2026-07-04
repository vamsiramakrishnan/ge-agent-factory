---
type: Query Capability
title: "Pull license entitlements from ServiceNow SAM, SaaS usage from Zylo, and logi..."
description: "Pull license entitlements from ServiceNow SAM, SaaS usage from Zylo, and login frequency from Okta. Build entitlement-vs-usage matrix for every licensed product."
source_id: "entitlement-usage-merge"
generation_status: inferred
tags:
  - it
  - okf
  - brd
timestamp: "2026-07-01T00:00:00.000Z"
---

# Pull license entitlements from ServiceNow SAM, SaaS usage from Zylo, and login frequency from Okta. Build entitlement-vs-usage matrix for every licensed product.

## Tools used

- [query_servicenow_sam_tickets](/tools/query-servicenow-sam-tickets.md)
- [query_zylo_zylo_records](/tools/query-zylo-zylo-records.md)
- [query_okta_users](/tools/query-okta-users.md)
- [lookup_license_compliance_monitor_runbook](/tools/lookup-license-compliance-monitor-runbook.md)

## Runs in

- [entitlement_usage_merge](/workflow/entitlement-usage-merge.md)

## Evidence expected

- source_system_record
- document_reference

## Evals

- [Run the License Compliance Monitor workflow for the current period. Cite the relevant source-system evidence and surface any escalations required.](/tests/license-compliance-monitor-end-to-end.md)

# Citations

- [License Compliance Monitor Operations Runbook](/documents/license-compliance-monitor-runbook.md)
