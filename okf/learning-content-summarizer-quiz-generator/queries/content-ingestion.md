---
type: Query Capability
title: "Ingest long-form course material from Cornerstone, Degreed, and Google Drive...."
description: "Ingest long-form course material from Cornerstone, Degreed, and Google Drive. Extract text, structure, and learning objectives from multiple source formats."
source_id: "content-ingestion"
generation_status: inferred
tags:
  - hr
  - okf
  - brd
timestamp: "2026-07-01T00:00:00.000Z"
---

# Ingest long-form course material from Cornerstone, Degreed, and Google Drive. Extract text, structure, and learning objectives from multiple source formats.

## Tools used

- [query_google_docs_documents](/tools/query-google-docs-documents.md)
- [lookup_learning_content_summarizer_quiz_generator_policy_handbook](/tools/lookup-learning-content-summarizer-quiz-generator-policy-handbook.md)

## Runs in

- [content_ingestion](/workflow/content-ingestion.md)

## Evidence expected

- source_system_record
- document_reference

## Evals

- [Run the Learning Content Summarizer & Quiz Generator workflow for the current period. Cite the relevant source-system evidence and surface any escalations required.](/tests/learning-content-summarizer-quiz-generator-end-to-end.md)

# Citations

- [Learning Content Summarizer & Quiz Generator Policy Handbook](/documents/learning-content-summarizer-quiz-generator-policy-handbook.md)
