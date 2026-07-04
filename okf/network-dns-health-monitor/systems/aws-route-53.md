---
type: Source System
title: AWS Route 53
description: "DNS health checks, record configurations, resolution data"
tags:
  - it
  - okf
  - brd
timestamp: "2026-07-01T00:00:00.000Z"
---

# AWS Route 53

DNS health checks, record configurations, resolution data

- **Protocol:** AWS SDK
- **Local backing:** alloydb

# Schema

- [billing_records](/tables/billing-records.md)
- [resource_inventory](/tables/resource-inventory.md)
- [alarm_events](/tables/alarm-events.md)

## Tools using this system

- [query_aws_route_53_billing_records](/tools/query-aws-route-53-billing-records.md)
- [action_aws_route_53_expire](/tools/action-aws-route-53-expire.md)
