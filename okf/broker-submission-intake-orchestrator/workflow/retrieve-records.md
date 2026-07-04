---
type: Workflow Stage
title: Retrieve Records
description: Query policy forms and rating worksheets from Duck Creek Policy and correlate with DocuSign for the Broker Submission Intake Orchestrator workflow.
source_id: retrieve_records
tags:
  - insurance
  - okf
  - brd
timestamp: "2026-07-04T00:00:00.000Z"
---

# Retrieve Records

Query policy forms and rating worksheets from Duck Creek Policy and correlate with DocuSign for the Broker Submission Intake Orchestrator workflow.

- **Mode:** sequential
- **Stage:** 1 of 4

## Tools

- [query_duck_creek_policy_policy_forms](/tools/query-duck-creek-policy-policy-forms.md)
- [query_docusign_envelopes](/tools/query-docusign-envelopes.md)
- [lookup_broker_submission_intake_orchestrator_authority_guide](/tools/lookup-broker-submission-intake-orchestrator-authority-guide.md)
- [action_duck_creek_policy_publish](/tools/action-duck-creek-policy-publish.md)

Next: [Analyze & Detect](/workflow/analyze-detect.md)
