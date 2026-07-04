---
type: Index
title: Query Capabilities
description: "The questions and requests this agent can answer, each with the tools it uses."
timestamp: "2026-07-01T00:00:00.000Z"
---

# Query Capabilities

- [Scan GitHub repositories for code-level violations (direct DB queries across boundaries, unauthorized imports). Check SonarQube for architectural rules. Compare Datadog runtime traces against declared CMDB boundaries.](/queries/multi-source-scanning.md)
- [Classify violations by severity (critical/high/medium/low), type (boundary crossing, pattern violation, naming), and scope (single service vs. systemic). Score drift from architecture standards.](/queries/violation-classification.md)
- [Gemini explains each violation in business context — why the guardrail exists, what risks the violation creates, and specific remediation steps. Suggests whether to fix or apply for an exception.](/queries/contextual-remediation.md)
- [Create Jira tickets for violations requiring remediation. Update compliance dashboard with trends. Notify service owners of new violations.](/queries/tracking-reporting.md)
