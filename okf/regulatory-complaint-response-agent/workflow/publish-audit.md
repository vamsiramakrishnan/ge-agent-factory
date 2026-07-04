---
type: Workflow Stage
title: "Publish & Audit"
description: "Execute action_guidewire_policycenter_publish to file the regulator response with a full audit trail, and push complaint-trend analytics back to BigQuery for root-cause review."
source_id: publish_audit
tags:
  - insurance
  - okf
  - brd
timestamp: "2026-07-04T00:00:00.000Z"
---

# Publish & Audit

Execute action_guidewire_policycenter_publish to file the regulator response with a full audit trail, and push complaint-trend analytics back to BigQuery for root-cause review.

- **Mode:** sequential
- **Stage:** 6 of 6

## Tools

- [query_guidewire_policycenter_policies](/tools/query-guidewire-policycenter-policies.md)
- [query_bigquery_analytics_events](/tools/query-bigquery-analytics-events.md)
- [lookup_regulatory_complaint_response_agent_authority_guide](/tools/lookup-regulatory-complaint-response-agent-authority-guide.md)
- [action_guidewire_policycenter_publish](/tools/action-guidewire-policycenter-publish.md)
