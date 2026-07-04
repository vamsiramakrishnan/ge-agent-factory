---
type: Index
title: Query Capabilities
description: "The questions and requests this agent can answer, each with the tools it uses."
timestamp: "2026-07-04T00:00:00.000Z"
---

# Query Capabilities

- [Query BigQuery analytics_events and historical_metrics alongside GA4 session_events to flag zero-result, low-click-through, and misrouted search terms across the full daily search-log tail.](/queries/null-low-click-query-mining.md)
- [Cross-reference flagged queries against product_catalog_entries catalog_status and content_completeness_score in Salesforce Commerce Cloud, and cart_events abandonment signal, to separate true assortment gaps from indexing or content defects.](/queries/assortment-gap-triage.md)
- [Draft synonym, redirect, and boost-and-bury rules against the Site Search Rule Governance Standard's rule taxonomy, scoped to the affected product_catalog_entries SKUs and online_orders demand signal.](/queries/rule-drafting-synonym-redirect-boost-and-bury.md)
- [Stage each candidate rule through automated A/B tests measured against GA4 conversion_paths and audience_segments, and validate sample size and confidence against the Site Search Rule Governance Standard before any promotion.](/queries/a-b-test-gating-evidence-validation.md)
- [Execute action_salesforce_commerce_cloud_route to publish winning rules into the Salesforce Commerce Cloud search index with a full audit trail, and notify the Digital Merchandising Manager of outcomes and any required escalations.](/queries/publish-to-search-index-audit.md)
