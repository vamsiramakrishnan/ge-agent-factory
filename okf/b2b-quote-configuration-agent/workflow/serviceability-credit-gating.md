---
type: Workflow Stage
title: "Serviceability & Credit Gating"
description: Confirm serviceability_confirmed per site and credit_check_status on service_quotes before pricing; unconfirmed access or a declined/deposit_required credit result blocks the quote from advancing to the price book step.
source_id: serviceability_credit_gating
tags:
  - telco
  - okf
  - brd
timestamp: "2026-07-04T00:00:00.000Z"
---

# Serviceability & Credit Gating

Confirm serviceability_confirmed per site and credit_check_status on service_quotes before pricing; unconfirmed access or a declined/deposit_required credit result blocks the quote from advancing to the price book step.

- **Mode:** sequential
- **Stage:** 2 of 5

## Tools

- [lookup_b2b_quote_configuration_agent_assurance_runbook](/tools/lookup-b2b-quote-configuration-agent-assurance-runbook.md)

Next: [Price Book & Discount Band Application](/workflow/price-book-discount-band-application.md)
