---
type: Query Capability
title: "Pull GRC metrics from ServiceNow GRC (control test results, audit findings), ..."
description: "Pull GRC metrics from ServiceNow GRC (control test results, audit findings), RSA Archer (risk scores, compliance status), and OneTrust (privacy compliance, consent rates). Normalize into unified scoring framework."
source_id: "cross-domain-aggregation"
generation_status: inferred
tags:
  - it
  - okf
  - brd
timestamp: "2026-07-01T00:00:00.000Z"
---

# Pull GRC metrics from ServiceNow GRC (control test results, audit findings), RSA Archer (risk scores, compliance status), and OneTrust (privacy compliance, consent rates). Normalize into unified scoring framework.

## Tools used

- [query_servicenow_grc_tickets](/tools/query-servicenow-grc-tickets.md)
- [query_rsa_archer_rsa_archer_records](/tools/query-rsa-archer-rsa-archer-records.md)
- [query_onetrust_onetrust_records](/tools/query-onetrust-onetrust-records.md)
- [action_servicenow_grc_generate](/tools/action-servicenow-grc-generate.md)

## Runs in

- [cross_domain_aggregation](/workflow/cross-domain-aggregation.md)

## Evidence expected

- source_system_record
- api_response
- generated_audit_trail

## Evals

- [Run the IT GRC Dashboard & Reporter workflow for the current period. Cite the relevant source-system evidence and surface any escalations required.](/tests/it-grc-dashboard-reporter-end-to-end.md)

# Citations

- [IT GRC Dashboard & Reporter Operations Runbook](/documents/it-grc-dashboard-reporter-runbook.md)
