---
type: Proof Obligation
title: "Golden eval obligation — Run the Regulatory Compliance Tracker workflow for the current period. Cite the relevant source-system evidence and surface any escalations required."
description: golden eval proof obligation
source_id: "eval-regulatory-compliance-tracker-end-to-end"
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

# Golden eval obligation — Run the Regulatory Compliance Tracker workflow for the current period. Cite the relevant source-system evidence and surface any escalations required.

- **Kind:** golden eval
- **Spec source:** behaviorContract.goldenEvals.0
- **Eval:** [regulatory-compliance-tracker-end-to-end](/tests/regulatory-compliance-tracker-end-to-end.md)


## Mechanisms

- [query_metricstream_metricstream_records](/tools/query-metricstream-metricstream-records.md)
- [query_sap_grc_control_tests](/tools/query-sap-grc-control-tests.md)
- [query_regulatory_feeds_regulatory_feeds_records](/tools/query-regulatory-feeds-regulatory-feeds-records.md)
- [lookup_regulatory_compliance_tracker_policy_guide](/tools/lookup-regulatory-compliance-tracker-policy-guide.md)
- [action_metricstream_execute](/tools/action-metricstream-execute.md)

## Entities that must be referenced

- metricstream_records
- control_tests
- regulatory_feeds_records

## Forbidden behaviors

- do not invent KPI numbers
- do not skip the evidence_lookup step before any recommendation
- do not execute execute without two-system evidence

# Citations

- [regulatory-compliance-tracker-policy-guide](/documents/regulatory-compliance-tracker-policy-guide.md)
