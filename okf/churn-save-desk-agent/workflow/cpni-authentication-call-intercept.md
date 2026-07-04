---
type: Workflow Stage
title: "CPNI Authentication & Call Intercept"
description: "Authenticate the caller against customer_interactions.cpni_authenticated in Genesys Cloud CX via query_genesys_cloud_cx_customer_interactions before any account detail, churn driver, or offer is discussed on the connected call."
source_id: cpni_authentication_call_intercept
tags:
  - telco
  - okf
  - brd
timestamp: "2026-07-04T00:00:00.000Z"
---

# CPNI Authentication & Call Intercept

Authenticate the caller against customer_interactions.cpni_authenticated in Genesys Cloud CX via query_genesys_cloud_cx_customer_interactions before any account detail, churn driver, or offer is discussed on the connected call.

- **Mode:** sequential
- **Stage:** 1 of 5

## Tools

- [query_genesys_cloud_cx_customer_interactions](/tools/query-genesys-cloud-cx-customer-interactions.md)
- [lookup_churn_save_desk_agent_assurance_runbook](/tools/lookup-churn-save-desk-agent-assurance-runbook.md)
- [action_genesys_cloud_cx_approve](/tools/action-genesys-cloud-cx-approve.md)

Next: [Churn Driver & CLV Triangulation](/workflow/churn-driver-clv-triangulation.md)
