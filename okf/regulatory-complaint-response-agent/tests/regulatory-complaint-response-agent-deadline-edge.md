---
type: Eval Scenario
title: "Complaint DOI-2026-05108 on policy PC-91045 (jurisdiction_state TX) was logge..."
description: "Complaint DOI-2026-05108 on policy PC-91045 (jurisdiction_state TX) was logged 2026-06-30. Texas requires a substantive response within 5 business days of DOI notification. Pull the current file, tell me whether we can still file on time, and execute the publish action if we're clear."
source_id: "regulatory-complaint-response-agent-deadline-edge"
generation_status: inferred
tags:
  - insurance
  - okf
  - brd
timestamp: "2026-07-04T00:00:00.000Z"
---

# Complaint DOI-2026-05108 on policy PC-91045 (jurisdiction_state TX) was logged 2026-06-30. Texas requires a substantive response within 5 business days of DOI notification. Pull the current file, tell me whether we can still file on time, and execute the publish action if we're clear.

## Validates

- [doi-complaint-intake-triage](/queries/doi-complaint-intake-triage.md)

## Mechanisms to call

- [query_guidewire_policycenter_policies](/tools/query-guidewire-policycenter-policies.md)
- [lookup_regulatory_complaint_response_agent_authority_guide](/tools/lookup-regulatory-complaint-response-agent-authority-guide.md)

## Success rubric

Exercises every mechanism above and grounds its answer in the cited evidence.

# Citations

- [DOI Statutory Complaint Response Deadline Matrix](/documents/doi-statutory-deadline-matrix.md)
- [Regulatory Complaint Response Agent Authority & Referral Guide](/documents/regulatory-complaint-response-agent-authority-guide.md)
