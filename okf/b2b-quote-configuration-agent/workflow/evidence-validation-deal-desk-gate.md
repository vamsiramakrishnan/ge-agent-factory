---
type: Workflow Stage
title: "Evidence Validation & Deal-Desk Gate"
description: "Cross-check discount, credit, and serviceability findings against the B2B Quote Configuration Agent Service Assurance Runbook and the B2B Rate & Discount Authority Matrix via lookup_b2b_quote_configuration_agent_assurance_runbook, citing sections before any recommendation and routing out-of-band discount_pct or contract_term exceptions to sales_pricing_desk or enterprise_deal_desk."
source_id: evidence_validation_deal_desk_gate
tags:
  - telco
  - okf
  - brd
timestamp: "2026-07-04T00:00:00.000Z"
---

# Evidence Validation & Deal-Desk Gate

Cross-check discount, credit, and serviceability findings against the B2B Quote Configuration Agent Service Assurance Runbook and the B2B Rate & Discount Authority Matrix via lookup_b2b_quote_configuration_agent_assurance_runbook, citing sections before any recommendation and routing out-of-band discount_pct or contract_term exceptions to sales_pricing_desk or enterprise_deal_desk.

- **Mode:** sequential
- **Stage:** 4 of 5

## Tools

- [lookup_b2b_quote_configuration_agent_assurance_runbook](/tools/lookup-b2b-quote-configuration-agent-assurance-runbook.md)

Next: [Proposal Drafting & Order Capture Routing](/workflow/proposal-drafting-order-capture-routing.md)
