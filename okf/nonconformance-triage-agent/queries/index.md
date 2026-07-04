---
type: Index
title: Query Capabilities
description: "The questions and requests this agent can answer, each with the tools it uses."
timestamp: "2026-07-04T00:00:00.000Z"
---

# Query Capabilities

- [Pull newly opened nonconformance_records and their linked inspection_lots from SAP S/4HANA QM the same shift they're detected, and verify containment_complete before the ticket moves off the intake queue.](/queries/nc-intake-containment-check.md)
- [Correlate the nonconformance against production_orders, machine_events, and quality_checks in Siemens Opcenter MES to pin down the affected order, the process step, and whether a CTQ characteristic was already trending out of control.](/queries/mes-genealogy-correlation.md)
- [Score severity, quantity_affected, and mrb_required against capa_actions precedent and the historical_metrics and cached_aggregates baselines in BigQuery to rank the Shift Quality Lead's queue and size the material held in the MRB cage.](/queries/severity-mrb-exposure-scoring.md)
- [Cite the Nonconformance Triage Agent Standard Operating Procedure control-limit and deviation sections before recommending a disposition (use_as_is, rework, repair, scrap, return_to_vendor) for the nonconformance_records entry.](/queries/sop-gated-disposition-recommendation.md)
- [Route the disposition recommendation to its owner or execute action_sap_s_4hana_qm_escalate in SAP S/4HANA QM with a full audit trail, notifying the Shift Quality Lead, quality_engineer, or quality_manager per the escalation gates.](/queries/routing-escalation-audit.md)
