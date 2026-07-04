---
type: Index
title: Query Capabilities
description: "The questions and requests this agent can answer, each with the tools it uses."
timestamp: "2026-07-04T00:00:00.000Z"
---

# Query Capabilities

- [Query product_catalog_entries and online_orders from Salesforce Commerce Cloud to flag missing attributes, thin descriptions, image_count gaps, and stale content_completeness_score across the live assortment.](/queries/pdp-catalog-sweep.md)
- [Cross-reference session_events, conversion_paths, and audience_segments from GA4 with historical_metrics and cached_aggregates in BigQuery to rank enrichment candidates by traffic and revenue impact.](/queries/traffic-revenue-impact-scoring.md)
- [Draft SEO-aware descriptions and bullet copy from supplier content feed data, checking rich_content_flag and image_count against the Supplier Product Content Feed SLA before routing to the E-Commerce Merchandiser.](/queries/copy-drafting-supplier-reconciliation.md)
- [Cite the PDP Content Quality Agent Retail Execution Playbook and Supplier Product Content Feed SLA sections gating each recommendation, confirming no cart_events or session_events evidence is older than the 24-hour staleness threshold.](/queries/evidence-playbook-validation.md)
- [Execute action_salesforce_commerce_cloud_publish against Commerce Cloud with a generated audit trail, and escalate exceptions such as bulk suppressions or conversion-rate anomalies to the E-Commerce Merchandiser or digital_operations_oncall.](/queries/publish-audit.md)
