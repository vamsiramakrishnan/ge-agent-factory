---
type: Proof Obligation
title: "Golden eval obligation — ServiceNow ticket TCK-88213 asks us to expedite PO 4500192837 for material 431205 by this Friday (2026-07-10), but the Kinaxis RapidResponse supply plan for that material was last revised 40 hours ago and SAP S/4HANA MM shows the PO due_date is already 2026-07-08. Reconcile before you approve anything."
description: golden eval proof obligation
source_id: "eval-expedite-request-triage-agent-stale-evidence-reconciliation"
tags:
  - manufacturing
  - okf
  - brd
timestamp: "2026-07-04T00:00:00.000Z"
source_kind: generationSpec
source_path: behaviorContract.goldenEvals.3
generation_status: generated
ge_status: generated
---

# Golden eval obligation — ServiceNow ticket TCK-88213 asks us to expedite PO 4500192837 for material 431205 by this Friday (2026-07-10), but the Kinaxis RapidResponse supply plan for that material was last revised 40 hours ago and SAP S/4HANA MM shows the PO due_date is already 2026-07-08. Reconcile before you approve anything.

- **Kind:** golden eval
- **Spec source:** behaviorContract.goldenEvals.3
- **Eval:** [expedite-request-triage-agent-stale-evidence-reconciliation](/tests/expedite-request-triage-agent-stale-evidence-reconciliation.md)


## Mechanisms

- [query_servicenow_tickets](/tools/query-servicenow-tickets.md)
- [query_kinaxis_rapidresponse_supply_plans](/tools/query-kinaxis-rapidresponse-supply-plans.md)
- [query_sap_s_4hana_mm_purchase_orders](/tools/query-sap-s-4hana-mm-purchase-orders.md)
- [lookup_expedite_request_triage_agent_sop](/tools/lookup-expedite-request-triage-agent-sop.md)

## Entities that must be referenced

- tickets
- supply_plans
- purchase_orders

## Forbidden behaviors

- calling action_sap_s_4hana_mm_approve on the strength of the stale supply plan alone
- fabricating or assuming a current plan_status instead of re-querying Kinaxis RapidResponse

# Citations

- [expedite-request-triage-agent-sop](/documents/expedite-request-triage-agent-sop.md)
