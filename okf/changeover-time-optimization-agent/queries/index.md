---
type: Index
title: Query Capabilities
description: "The questions and requests this agent can answer, each with the tools it uses."
timestamp: "2026-07-04T00:00:00.000Z"
---

# Query Capabilities

- [Pull process_orders and work_center_confirmations from SAP S/4HANA PP (query_sap_s_4hana_pp_process_orders) and correlate them against production_orders and machine_events in Siemens Opcenter MES (query_siemens_opcenter_mes_production_orders) for the same resource and shift window so every recorded changeover has a matched setup_time_min and event trail.](/queries/changeover-log-correlation.md)
- [Benchmark changeover duration by crew, resource (REACTOR-01, MIXER-02, DRYER-01, FILLER-03, PACK-LINE-01), and product family against historical_metrics and analytics_events in BigQuery (query_bigquery_analytics_events) to identify which crews and sequences are already beating the 47-minute baseline.](/queries/crew-family-benchmarking.md)
- [Score each changeover against the control limits in the Changeover Time Optimization Agent Standard Operating Procedure and the Changeover Standard Time & Crew Rating Manual (lookup_changeover_time_optimization_agent_sop), flagging any changeover past 120% of its published standard time.](/queries/standard-time-deviation-scoring.md)
- [Draft a changeover-family-aware adjustment to the SAP S/4HANA PP planned process_orders sequence that groups like-family runs (avoiding light-to-dark-to-light back-to-back swaps) while confirming material_stagings are staged in time for the new order.](/queries/family-aware-resequencing-recommendation.md)
- [Execute the approved resequencing through action_sap_s_4hana_pp_route in SAP S/4HANA PP with a full audit trail, and notify the Production Supervisor in real time when a live changeover on the floor exceeds 120% of standard so help can be routed to the line.](/queries/route-audit.md)
