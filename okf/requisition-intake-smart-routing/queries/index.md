---
type: Index
title: Query Capabilities
description: "The questions and requests this agent can answer, each with the tools it uses."
timestamp: "2026-07-01T00:00:00.000Z"
---

# Query Capabilities

- [Receive requisition from SAP ME51N or Coupa portal. Validate field completeness and extract free-text description for downstream NLP processing.](/queries/requisition-ingestion.md)
- [Classify request type and urgency. Run fuzzy matching against recent requisitions on description, vendor, and amount to detect duplicates and similar requests.](/queries/classification-duplicate-detection.md)
- [LLM interprets ambiguous free-text descriptions ('need the same thing we ordered last quarter for Chicago but in blue') and resolves to specific material, supplier, and contract. Detects compliance risks — a requisition for 'consulting services' with a named individual flagged as contingent labor.](/queries/intent-resolution-enrichment.md)
- [Route enriched requisition through delegation-of-authority matrix to correct approver. Send notifications with SLA tracking.](/queries/smart-routing-notification.md)
