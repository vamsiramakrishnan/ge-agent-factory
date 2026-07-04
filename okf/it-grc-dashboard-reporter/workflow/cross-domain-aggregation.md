---
type: Workflow Stage
title: "Cross-Domain Aggregation"
description: "Pull GRC metrics from ServiceNow GRC (control test results, audit findings), RSA Archer (risk scores, compliance status), and OneTrust (privacy compliance, consent rates). Normalize into unified scoring framework."
source_id: cross_domain_aggregation
tags:
  - it
  - okf
  - brd
timestamp: "2026-07-01T00:00:00.000Z"
---

# Cross-Domain Aggregation

Pull GRC metrics from ServiceNow GRC (control test results, audit findings), RSA Archer (risk scores, compliance status), and OneTrust (privacy compliance, consent rates). Normalize into unified scoring framework.

- **Mode:** sequential
- **Stage:** 1 of 3

## Tools

- [query_servicenow_grc_tickets](/tools/query-servicenow-grc-tickets.md)
- [query_rsa_archer_rsa_archer_records](/tools/query-rsa-archer-rsa-archer-records.md)
- [query_onetrust_onetrust_records](/tools/query-onetrust-onetrust-records.md)
- [action_servicenow_grc_generate](/tools/action-servicenow-grc-generate.md)

Next: [Executive Narrative Generation](/workflow/executive-narrative-generation.md)
