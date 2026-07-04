---
type: Workflow Stage
title: "Submission Ingestion & Structuring"
description: "Parse broker-submitted ACORD applications, loss runs, and SOV spreadsheets and create structured policy_forms and rating_worksheets records in Duck Creek Policy (query_duck_creek_policy_policy_forms) so the submission exists as clean, queryable data instead of an email attachment."
source_id: submission_ingestion_structuring
tags:
  - insurance
  - okf
  - brd
timestamp: "2026-07-04T00:00:00.000Z"
---

# Submission Ingestion & Structuring

Parse broker-submitted ACORD applications, loss runs, and SOV spreadsheets and create structured policy_forms and rating_worksheets records in Duck Creek Policy (query_duck_creek_policy_policy_forms) so the submission exists as clean, queryable data instead of an email attachment.

- **Mode:** sequential
- **Stage:** 1 of 5

## Tools

- [query_duck_creek_policy_policy_forms](/tools/query-duck-creek-policy-policy-forms.md)
- [lookup_broker_submission_intake_orchestrator_authority_guide](/tools/lookup-broker-submission-intake-orchestrator-authority-guide.md)
- [action_duck_creek_policy_publish](/tools/action-duck-creek-policy-publish.md)

Next: [Completeness & Consistency Triage](/workflow/completeness-consistency-triage.md)
