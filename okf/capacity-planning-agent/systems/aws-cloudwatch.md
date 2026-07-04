---
type: Source System
title: AWS CloudWatch
description: "AWS resource metrics, auto-scaling group data"
tags:
  - it
  - okf
  - brd
timestamp: "2026-07-01T00:00:00.000Z"
---

# AWS CloudWatch

AWS resource metrics, auto-scaling group data

- **Protocol:** AWS SDK
- **Local backing:** bigquery

# Schema

- [billing_records](/tables/billing-records.md)
- [resource_inventory](/tables/resource-inventory.md)
- [alarm_events](/tables/alarm-events.md)

## Tools using this system

- [query_aws_cloudwatch_billing_records](/tools/query-aws-cloudwatch-billing-records.md)
