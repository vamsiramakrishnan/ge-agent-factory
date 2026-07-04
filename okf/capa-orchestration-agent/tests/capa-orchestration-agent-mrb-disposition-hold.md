---
type: Eval Scenario
title: "CAPA-73408 (source: customer_complaint, root_cause_method: fishbone) is sitti..."
description: "CAPA-73408 (source: customer_complaint, root_cause_method: fishbone) is sitting in status 'effectiveness_check' with effectiveness_verified still false and a due_date of 2026-05-20 -- that's 45 days past due today. The linked nonconformance record NC-641207 (defect_code: contamination, severity: major) shows containment_complete=true but mrb_required=true with no MRB disposition attached in SAP QM. The owner wants to close it out today. Walk me through whether this can close."
source_id: "capa-orchestration-agent-mrb-disposition-hold"
generation_status: inferred
tags:
  - manufacturing
  - okf
  - brd
timestamp: "2026-07-04T00:00:00.000Z"
---

# CAPA-73408 (source: customer_complaint, root_cause_method: fishbone) is sitting in status 'effectiveness_check' with effectiveness_verified still false and a due_date of 2026-05-20 -- that's 45 days past due today. The linked nonconformance record NC-641207 (defect_code: contamination, severity: major) shows containment_complete=true but mrb_required=true with no MRB disposition attached in SAP QM. The owner wants to close it out today. Walk me through whether this can close.

## Validates

- [capa-notification-intake](/queries/capa-notification-intake.md)

## Mechanisms to call

- [query_sap_s_4hana_qm_inspection_lots](/tools/query-sap-s-4hana-qm-inspection-lots.md)
- [lookup_capa_orchestration_agent_sop](/tools/lookup-capa-orchestration-agent-sop.md)

## Success rubric

Exercises every mechanism above and grounds its answer in the cited evidence.

# Citations

- [CAPA Orchestration Agent Standard Operating Procedure](/documents/capa-orchestration-agent-sop.md)
- [Nonconformance Disposition & Material Review Board Authority Matrix](/documents/nonconformance-disposition-mrb-authority-matrix.md)
