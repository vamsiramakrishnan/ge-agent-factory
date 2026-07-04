---
type: Index
title: Query Capabilities
description: "The questions and requests this agent can answer, each with the tools it uses."
timestamp: "2026-07-01T00:00:00.000Z"
---

# Query Capabilities

- [Receive SIEM alerts from Chronicle and Splunk. Normalize alert schema, extract key entities (user, IP, asset, action), and deduplicate correlated alerts.](/queries/alert-ingestion-normalization.md)
- [Enrich alert with user context from Okta (role, location, device trust), endpoint context from CrowdStrike (process activity, EDR score), and historical patterns from BigQuery.](/queries/context-enrichment.md)
- [Gemini reasons about alert legitimacy by comparing enriched context against known benign patterns and historical analyst decisions. Provides evidence-based triage recommendation.](/queries/intelligent-classification.md)
- [Confirmed incidents routed to investigation workflow. Auto-closed alerts logged for model improvement. Analyst feedback captured to improve future triage accuracy.](/queries/routing-feedback-loop.md)
