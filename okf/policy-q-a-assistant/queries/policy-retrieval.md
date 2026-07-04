---
type: Query Capability
title: Search full policy corpus across SharePoint and Google Drive using RAG. Retri...
description: Search full policy corpus across SharePoint and Google Drive using RAG. Retrieve relevant policy sections with exact source citations and version references.
source_id: "policy-retrieval"
generation_status: inferred
tags:
  - hr
  - okf
  - brd
timestamp: "2026-07-01T00:00:00.000Z"
---

# Search full policy corpus across SharePoint and Google Drive using RAG. Retrieve relevant policy sections with exact source citations and version references.

## Tools used

- [query_google_chat_messages](/tools/query-google-chat-messages.md)
- [query_sharepoint_documents](/tools/query-sharepoint-documents.md)
- [lookup_policy_q_a_assistant_policy_handbook](/tools/lookup-policy-q-a-assistant-policy-handbook.md)

## Runs in

- [policy_retrieval](/workflow/policy-retrieval.md)

## Evidence expected

- source_system_record
- document_reference

## Evals

- [Run the Policy Q&A Assistant workflow for the current period. Cite the relevant source-system evidence and surface any escalations required.](/tests/policy-q-a-assistant-end-to-end.md)

# Citations

- [Policy Q&A Assistant Policy Handbook](/documents/policy-q-a-assistant-policy-handbook.md)
