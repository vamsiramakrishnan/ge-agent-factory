---
type: Query Capability
title: "Manage multi-step document collection workflow. LLM reads submitted W-9 forms..."
description: "Manage multi-step document collection workflow. LLM reads submitted W-9 forms, insurance certificates, and banking letters — even from non-standard formats — and extracts key data fields for validation."
source_id: "document-collection-extraction"
generation_status: inferred
tags:
  - procurement
  - okf
  - brd
timestamp: "2026-07-01T00:00:00.000Z"
---

# Manage multi-step document collection workflow. LLM reads submitted W-9 forms, insurance certificates, and banking letters — even from non-standard formats — and extracts key data fields for validation.

## Tools used

- [query_banking_systems_banking_systems_records](/tools/query-banking-systems-banking-systems-records.md)

## Runs in

- [document_collection_extraction](/workflow/document-collection-extraction.md)

## Evidence expected

- source_system_record

## Evals

- [Run the Supplier Onboarding Orchestrator workflow for the current period. Cite the relevant source-system evidence and surface any escalations required.](/tests/supplier-onboarding-orchestrator-end-to-end.md)

# Citations

- [Supplier Onboarding Orchestrator Procurement Policy Guide](/documents/supplier-onboarding-orchestrator-policy-guide.md)
