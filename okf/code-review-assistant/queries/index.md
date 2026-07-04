---
type: Index
title: Query Capabilities
description: "The questions and requests this agent can answer, each with the tools it uses."
timestamp: "2026-07-01T00:00:00.000Z"
---

# Query Capabilities

- [Receive PR webhook, extract diff, pull file context for changed files. Identify scope of changes — new files, modified functions, deleted tests.](/queries/pr-intake-diff-extraction.md)
- [Run SonarQube analysis for code complexity, security pattern matching, test coverage gap analysis, and duplicate code detection. Map findings to severity levels.](/queries/static-security-analysis.md)
- [Gemini provides review beyond linting: 'This function handles PII but doesn't use the encryption wrapper — required by policy SEC-014. Error handling swallows exceptions silently — recommend logging with correlation ID.'](/queries/contextual-llm-review.md)
- [Review comments posted inline on the PR with severity levels. Auto-approve PRs with no issues; flag critical findings for human reviewer attention.](/queries/comment-posting.md)
