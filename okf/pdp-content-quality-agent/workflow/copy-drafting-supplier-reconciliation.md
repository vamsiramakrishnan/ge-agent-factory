---
type: Workflow Stage
title: "Copy Drafting & Supplier Reconciliation"
description: "Draft SEO-aware descriptions and bullet copy from supplier content feed data, checking rich_content_flag and image_count against the Supplier Product Content Feed SLA before routing to the E-Commerce Merchandiser."
source_id: copy_drafting_supplier_reconciliation
tags:
  - retail
  - okf
  - brd
timestamp: "2026-07-04T00:00:00.000Z"
---

# Copy Drafting & Supplier Reconciliation

Draft SEO-aware descriptions and bullet copy from supplier content feed data, checking rich_content_flag and image_count against the Supplier Product Content Feed SLA before routing to the E-Commerce Merchandiser.

- **Mode:** sequential
- **Stage:** 3 of 5

## Tools

- [query_salesforce_commerce_cloud_online_orders](/tools/query-salesforce-commerce-cloud-online-orders.md)
- [lookup_pdp_content_quality_agent_execution_playbook](/tools/lookup-pdp-content-quality-agent-execution-playbook.md)
- [action_salesforce_commerce_cloud_publish](/tools/action-salesforce-commerce-cloud-publish.md)

Next: [Evidence & Playbook Validation](/workflow/evidence-playbook-validation.md)
