---
type: Proof Obligation
title: "Golden eval obligation — Run the Capability Assessment Agent workflow for the current period. Cite the relevant source-system evidence and surface any escalations required."
description: golden eval proof obligation
source_id: "eval-capability-assessment-agent-end-to-end"
tags:
  - procurement
  - okf
  - brd
timestamp: "2026-07-01T00:00:00.000Z"
source_kind: generationSpec
source_path: behaviorContract.goldenEvals.0
generation_status: generated
ge_status: generated
---

# Golden eval obligation — Run the Capability Assessment Agent workflow for the current period. Cite the relevant source-system evidence and surface any escalations required.

- **Kind:** golden eval
- **Spec source:** behaviorContract.goldenEvals.0
- **Eval:** [capability-assessment-agent-end-to-end](/tests/capability-assessment-agent-end-to-end.md)


## Mechanisms

- [query_ariba_slp_ariba_slp_records](/tools/query-ariba-slp-ariba-slp-records.md)
- [query_jaggaer_supplier_profiles](/tools/query-jaggaer-supplier-profiles.md)
- [query_procurement_3_procurement_3_records](/tools/query-procurement-3-procurement-3-records.md)
- [lookup_capability_assessment_agent_policy_guide](/tools/lookup-capability-assessment-agent-policy-guide.md)
- [action_ariba_slp_recommend](/tools/action-ariba-slp-recommend.md)

## Entities that must be referenced

- ariba_slp_records
- supplier_profiles
- procurement_3_records

## Forbidden behaviors

- do not invent KPI numbers
- do not skip the evidence_lookup step before any recommendation
- do not execute recommend without two-system evidence

# Citations

- [capability-assessment-agent-policy-guide](/documents/capability-assessment-agent-policy-guide.md)
