---
type: Query Capability
title: "Gemini provides review beyond linting: 'This function handles PII but doesn't..."
description: "Gemini provides review beyond linting: 'This function handles PII but doesn't use the encryption wrapper — required by policy SEC-014. Error handling swallows exceptions silently — recommend logging with correlation ID.'"
source_id: "contextual-llm-review"
generation_status: inferred
tags:
  - it
  - okf
  - brd
timestamp: "2026-07-01T00:00:00.000Z"
---

# Gemini provides review beyond linting: 'This function handles PII but doesn't use the encryption wrapper — required by policy SEC-014. Error handling swallows exceptions silently — recommend logging with correlation ID.'

## Tools used

- [lookup_code_review_assistant_runbook](/tools/lookup-code-review-assistant-runbook.md)

## Runs in

- [contextual_llm_review](/workflow/contextual-llm-review.md)

## Evidence expected

- document_reference

## Evals

- [Run the Code Review Assistant workflow for the current period. Cite the relevant source-system evidence and surface any escalations required.](/tests/code-review-assistant-end-to-end.md)

# Citations

- [Code Review Assistant Operations Runbook](/documents/code-review-assistant-runbook.md)
