---
type: Workflow Stage
title: "Posting & Exception Routing"
description: "Post matched and validated payments to AR sub-ledger. Route remaining exceptions to AR specialists with context and suggested resolution."
source_id: posting_exception_routing
tags:
  - finance
  - okf
  - brd
timestamp: "2026-07-01T00:00:00.000Z"
---

# Posting & Exception Routing

Post matched and validated payments to AR sub-ledger. Route remaining exceptions to AR specialists with context and suggested resolution.

- **Mode:** sequential
- **Stage:** 3 of 3

## Tools

- [query_highradius_payment_remittances](/tools/query-highradius-payment-remittances.md)
- [action_highradius_match](/tools/action-highradius-match.md)
