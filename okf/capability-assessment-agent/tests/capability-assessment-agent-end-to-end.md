---
type: Eval Scenario
title: Run the Capability Assessment Agent workflow for the current period. Cite the...
description: "Run the Capability Assessment Agent workflow for the current period. Cite the relevant source-system evidence and surface any escalations required."
source_id: "capability-assessment-agent-end-to-end"
generation_status: inferred
tags:
  - procurement
  - okf
  - brd
timestamp: "2026-07-01T00:00:00.000Z"
---

# Run the Capability Assessment Agent workflow for the current period. Cite the relevant source-system evidence and surface any escalations required.

## Validates

- [response-collection-normalization](/queries/response-collection-normalization.md)

## Mechanisms to call

- [query_ariba_slp_ariba_slp_records](/tools/query-ariba-slp-ariba-slp-records.md)
- [query_jaggaer_supplier_profiles](/tools/query-jaggaer-supplier-profiles.md)
- [query_procurement_3_procurement_3_records](/tools/query-procurement-3-procurement-3-records.md)
- [lookup_capability_assessment_agent_policy_guide](/tools/lookup-capability-assessment-agent-policy-guide.md)
- [action_ariba_slp_recommend](/tools/action-ariba-slp-recommend.md)

## Success rubric

Action recommend executed against Ariba SLP, with audit-trail entry and Sourcing Specialist notified of outcomes.

# Citations

- [Capability Assessment Agent Procurement Policy Guide](/documents/capability-assessment-agent-policy-guide.md)
