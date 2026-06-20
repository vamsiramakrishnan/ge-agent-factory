---
type: Agent Tool
title: query_bigquery_analytics_events
description: Retrieve analytics events from BigQuery for the Account Reconciliation Agent workflow.
tags:
  - finance
  - okf
  - brd
timestamp: "2026-06-20T00:25:58.081Z"
---

# query_bigquery_analytics_events

Retrieve analytics events from BigQuery for the Account Reconciliation Agent workflow.

- **Kind:** query
- **Source system:** [BigQuery](/systems/bigquery.md)

## Required inputs

- lookup_key
- date_range

## Produces

- analytics_events_records
- analytics_events_summary

## Evidence emitted

- sql_result

# Examples

```
query_bigquery_analytics_events(lookup_key=<lookup_key>, date_range=<date_range>)
```

## Used by

_Not bound to a workflow stage._
