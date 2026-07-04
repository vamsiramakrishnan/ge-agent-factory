---
type: Query Capability
title: Gemini explains each violation in business context — why the guardrail exists...
description: "Gemini explains each violation in business context — why the guardrail exists, what risks the violation creates, and specific remediation steps. Suggests whether to fix or apply for an exception."
source_id: "contextual-remediation"
generation_status: inferred
tags:
  - it
  - okf
  - brd
timestamp: "2026-07-01T00:00:00.000Z"
---

# Gemini explains each violation in business context — why the guardrail exists, what risks the violation creates, and specific remediation steps. Suggests whether to fix or apply for an exception.

## Tools used

- [action_github_create](/tools/action-github-create.md)

## Runs in

- [contextual_remediation](/workflow/contextual-remediation.md)

## Evidence expected

- api_response
- generated_audit_trail

## Evals

- [Run the Architecture Compliance Scanner workflow for the current period. Cite the relevant source-system evidence and surface any escalations required.](/tests/architecture-compliance-scanner-end-to-end.md)

# Citations

- [Architecture Compliance Scanner Operations Runbook](/documents/architecture-compliance-scanner-runbook.md)
