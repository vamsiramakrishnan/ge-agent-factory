---
type: Proof Obligation
title: "Golden eval obligation — DOI complaint DOI-2026-04471 was filed against policy PC-88213 (named insured Maria Trevino) alleging the carrier failed to respond to her homeowners claim inquiry within the state deadline. Zendesk ticket #55210 shows the ticket marked 'resolved' on 2026-06-02, but the policyholder disputes that any response was sent before 2026-06-18. Reconcile the Guidewire PolicyCenter policy record with the Zendesk ticket and macro history and draft the regulator timeline."
description: golden eval proof obligation
source_id: "eval-regulatory-complaint-response-agent-conflicting-correspondence"
tags:
  - insurance
  - okf
  - brd
timestamp: "2026-07-04T00:00:00.000Z"
source_kind: generationSpec
source_path: behaviorContract.goldenEvals.3
generation_status: generated
ge_status: generated
---

# Golden eval obligation — DOI complaint DOI-2026-04471 was filed against policy PC-88213 (named insured Maria Trevino) alleging the carrier failed to respond to her homeowners claim inquiry within the state deadline. Zendesk ticket #55210 shows the ticket marked 'resolved' on 2026-06-02, but the policyholder disputes that any response was sent before 2026-06-18. Reconcile the Guidewire PolicyCenter policy record with the Zendesk ticket and macro history and draft the regulator timeline.

- **Kind:** golden eval
- **Spec source:** behaviorContract.goldenEvals.3
- **Eval:** [regulatory-complaint-response-agent-conflicting-correspondence](/tests/regulatory-complaint-response-agent-conflicting-correspondence.md)


## Mechanisms

- [query_guidewire_policycenter_policies](/tools/query-guidewire-policycenter-policies.md)
- [query_zendesk_tickets](/tools/query-zendesk-tickets.md)
- [lookup_regulatory_complaint_response_agent_authority_guide](/tools/lookup-regulatory-complaint-response-agent-authority-guide.md)

## Entities that must be referenced

- policies
- tickets
- macros

## Forbidden behaviors

- accepting the Zendesk ticket 'resolved' status as proof of a timely response without cross-checking the macro trail
- fabricating a response date that appears in neither the ticket nor macro records

# Citations

- [regulatory-complaint-response-agent-authority-guide](/documents/regulatory-complaint-response-agent-authority-guide.md)
- [doi-statutory-deadline-matrix](/documents/doi-statutory-deadline-matrix.md)
