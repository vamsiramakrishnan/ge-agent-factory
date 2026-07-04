---
type: Query Capability
title: "Post matched and validated payments to AR sub-ledger. Route remaining excepti..."
description: "Post matched and validated payments to AR sub-ledger. Route remaining exceptions to AR specialists with context and suggested resolution."
source_id: "posting-exception-routing"
generation_status: inferred
tags:
  - finance
  - okf
  - brd
timestamp: "2026-07-01T00:00:00.000Z"
---

# Post matched and validated payments to AR sub-ledger. Route remaining exceptions to AR specialists with context and suggested resolution.

## Tools used

- [query_highradius_payment_remittances](/tools/query-highradius-payment-remittances.md)
- [action_highradius_match](/tools/action-highradius-match.md)

## Runs in

- [posting_exception_routing](/workflow/posting-exception-routing.md)

## Evidence expected

- source_system_record
- api_response
- generated_audit_trail

## Evals

- [Run the Cash Application Agent workflow for the current period. Cite the relevant source-system evidence and surface any escalations required.](/tests/cash-application-agent-end-to-end.md)

# Citations

- [Cash Application Agent Controls Playbook](/documents/cash-application-agent-controls-playbook.md)
