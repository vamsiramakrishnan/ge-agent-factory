---
type: Index
title: Query Capabilities
description: "The questions and requests this agent can answer, each with the tools it uses."
timestamp: "2026-07-01T00:00:00.000Z"
---

# Query Capabilities

- [Receive alert from PagerDuty. Correlate with related alerts (deduplication), recent deployments, and infrastructure events. Pull service context from Datadog APM.](/queries/alert-intake-correlation.md)
- [Rank probable root causes using historical incident patterns. Match symptoms against runbook database. Score runbook applicability based on symptom similarity and past success rates.](/queries/root-cause-ranking.md)
- [Gemini adapts remediation: 'High memory on pod checkout-api-7d4f matches runbook RB-042 (memory leak restart) — but this pod was deployed 10 minutes ago. Likely code regression. Recommend rollback instead of restart.'](/queries/context-aware-remediation-selection.md)
- [After SRE approval, execute selected remediation via Kubernetes API (rollback, restart, scale). Verify recovery through Datadog health checks. Update PagerDuty incident with resolution.](/queries/execution-verification.md)
