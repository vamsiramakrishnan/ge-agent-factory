---
type: Source System
title: HighRadius
description: "Collection worklist, customer interaction history, promise-to-pay tracking"
tags:
  - finance
  - okf
  - brd
timestamp: "2026-07-01T00:00:00.000Z"
---

# HighRadius

Collection worklist, customer interaction history, promise-to-pay tracking

- **Protocol:** REST API
- **Local backing:** alloydb

# Schema

- [payment_remittances](/tables/payment-remittances.md)
- [collections_queues](/tables/collections-queues.md)
- [deduction_cases](/tables/deduction-cases.md)

## Tools using this system

- [query_highradius_payment_remittances](/tools/query-highradius-payment-remittances.md)
- [action_highradius_recommend](/tools/action-highradius-recommend.md)
