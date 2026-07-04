---
type: Workflow Stage
title: Contextual LLM Review
description: "Gemini provides review beyond linting: 'This function handles PII but doesn't use the encryption wrapper — required by policy SEC-014. Error handling swallows exceptions silently — recommend logging with correlation ID.'"
source_id: contextual_llm_review
tags:
  - it
  - okf
  - brd
timestamp: "2026-07-01T00:00:00.000Z"
---

# Contextual LLM Review

Gemini provides review beyond linting: 'This function handles PII but doesn't use the encryption wrapper — required by policy SEC-014. Error handling swallows exceptions silently — recommend logging with correlation ID.'

- **Mode:** sequential
- **Stage:** 3 of 4

## Tools

- [lookup_code_review_assistant_runbook](/tools/lookup-code-review-assistant-runbook.md)

Next: [Comment Posting](/workflow/comment-posting.md)
