---
type: Workflow Stage
title: Requirement Date Reconciliation
description: "Query supply_plans and demand_signals in Kinaxis RapidResponse (query_kinaxis_rapidresponse_supply_plans) to confirm the true requirement date and flag any plan that was published, committed, or revised after the ticket was opened."
source_id: requirement_date_reconciliation
tags:
  - manufacturing
  - okf
  - brd
timestamp: "2026-07-04T00:00:00.000Z"
---

# Requirement Date Reconciliation

Query supply_plans and demand_signals in Kinaxis RapidResponse (query_kinaxis_rapidresponse_supply_plans) to confirm the true requirement date and flag any plan that was published, committed, or revised after the ticket was opened.

- **Mode:** sequential
- **Stage:** 2 of 6

## Tools

- [query_kinaxis_rapidresponse_supply_plans](/tools/query-kinaxis-rapidresponse-supply-plans.md)
- [lookup_expedite_request_triage_agent_sop](/tools/lookup-expedite-request-triage-agent-sop.md)

Next: [Alternate Stock & PO Verification](/workflow/alternate-stock-po-verification.md)
