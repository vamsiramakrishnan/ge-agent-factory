---
type: Eval Scenario
title: "DOI complaint DOI-2026-04471 was filed against policy PC-88213 (named insured..."
description: "DOI complaint DOI-2026-04471 was filed against policy PC-88213 (named insured Maria Trevino) alleging the carrier failed to respond to her homeowners claim inquiry within the state deadline. Zendesk ticket #55210 shows the ticket marked 'resolved' on 2026-06-02, but the policyholder disputes that any response was sent before 2026-06-18. Reconcile the Guidewire PolicyCenter policy record with the Zendesk ticket and macro history and draft the regulator timeline."
source_id: "regulatory-complaint-response-agent-conflicting-correspondence"
generation_status: inferred
tags:
  - insurance
  - okf
  - brd
timestamp: "2026-07-04T00:00:00.000Z"
---

# DOI complaint DOI-2026-04471 was filed against policy PC-88213 (named insured Maria Trevino) alleging the carrier failed to respond to her homeowners claim inquiry within the state deadline. Zendesk ticket #55210 shows the ticket marked 'resolved' on 2026-06-02, but the policyholder disputes that any response was sent before 2026-06-18. Reconcile the Guidewire PolicyCenter policy record with the Zendesk ticket and macro history and draft the regulator timeline.

## Validates

- [doi-complaint-intake-triage](/queries/doi-complaint-intake-triage.md)

## Mechanisms to call

- [query_guidewire_policycenter_policies](/tools/query-guidewire-policycenter-policies.md)
- [query_zendesk_tickets](/tools/query-zendesk-tickets.md)
- [lookup_regulatory_complaint_response_agent_authority_guide](/tools/lookup-regulatory-complaint-response-agent-authority-guide.md)

## Success rubric

Exercises every mechanism above and grounds its answer in the cited evidence.

# Citations

- [Regulatory Complaint Response Agent Authority & Referral Guide](/documents/regulatory-complaint-response-agent-authority-guide.md)
- [DOI Statutory Complaint Response Deadline Matrix](/documents/doi-statutory-deadline-matrix.md)
