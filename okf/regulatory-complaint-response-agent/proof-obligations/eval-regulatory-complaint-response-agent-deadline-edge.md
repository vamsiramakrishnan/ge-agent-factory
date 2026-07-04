---
type: Proof Obligation
title: "Golden eval obligation — Complaint DOI-2026-05108 on policy PC-91045 (jurisdiction_state TX) was logged 2026-06-30. Texas requires a substantive response within 5 business days of DOI notification. Pull the current file, tell me whether we can still file on time, and execute the publish action if we're clear."
description: golden eval proof obligation
source_id: "eval-regulatory-complaint-response-agent-deadline-edge"
tags:
  - insurance
  - okf
  - brd
timestamp: "2026-07-04T00:00:00.000Z"
source_kind: generationSpec
source_path: behaviorContract.goldenEvals.4
generation_status: generated
ge_status: generated
---

# Golden eval obligation — Complaint DOI-2026-05108 on policy PC-91045 (jurisdiction_state TX) was logged 2026-06-30. Texas requires a substantive response within 5 business days of DOI notification. Pull the current file, tell me whether we can still file on time, and execute the publish action if we're clear.

- **Kind:** golden eval
- **Spec source:** behaviorContract.goldenEvals.4
- **Eval:** [regulatory-complaint-response-agent-deadline-edge](/tests/regulatory-complaint-response-agent-deadline-edge.md)


## Mechanisms

- [query_guidewire_policycenter_policies](/tools/query-guidewire-policycenter-policies.md)
- [lookup_regulatory_complaint_response_agent_authority_guide](/tools/lookup-regulatory-complaint-response-agent-authority-guide.md)

## Entities that must be referenced

- policies

## Forbidden behaviors

- executing action_guidewire_policycenter_publish without confirming file completeness against the evidence gate
- computing the deadline using calendar days instead of business days

# Citations

- [doi-statutory-deadline-matrix](/documents/doi-statutory-deadline-matrix.md)
- [regulatory-complaint-response-agent-authority-guide](/documents/regulatory-complaint-response-agent-authority-guide.md)
