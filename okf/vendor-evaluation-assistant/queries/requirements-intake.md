---
type: Query Capability
title: Ingest evaluation criteria and requirements from Google Docs. Pull market con...
description: Ingest evaluation criteria and requirements from Google Docs. Pull market context from Gartner Magic Quadrants and G2 user reviews for the relevant vendor category.
source_id: "requirements-intake"
generation_status: inferred
tags:
  - hr
  - okf
  - brd
timestamp: "2026-07-01T00:00:00.000Z"
---

# Ingest evaluation criteria and requirements from Google Docs. Pull market context from Gartner Magic Quadrants and G2 user reviews for the relevant vendor category.

## Tools used

- [query_google_docs_documents](/tools/query-google-docs-documents.md)
- [query_google_sheets_sheets](/tools/query-google-sheets-sheets.md)
- [lookup_vendor_evaluation_assistant_policy_handbook](/tools/lookup-vendor-evaluation-assistant-policy-handbook.md)

## Runs in

- [requirements_intake](/workflow/requirements-intake.md)

## Evidence expected

- source_system_record
- document_reference

## Evals

- [Run the Vendor Evaluation Assistant workflow for the current period. Cite the relevant source-system evidence and surface any escalations required.](/tests/vendor-evaluation-assistant-end-to-end.md)

# Citations

- [Vendor Evaluation Assistant Policy Handbook](/documents/vendor-evaluation-assistant-policy-handbook.md)
