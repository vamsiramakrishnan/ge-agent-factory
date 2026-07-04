---
type: Data Entity
title: customer_interactions
description: Data entity customer_interactions owned by Genesys Cloud CX.
tags:
  - telco
  - okf
  - brd
timestamp: "2026-07-04T00:00:00.000Z"
---

# customer_interactions

# Schema

| Field | Type | Constraints |
| --- | --- | --- |
| id | seq | required; primary key |
| interaction_id | number | required |
| account_number | number | required |
| channel | enum | required; values: voice_ivr_contained, voice_agent, chat, retail_store, app_message, social |
| intent | enum | required; values: billing_dispute, network_complaint, plan_change, device_upgrade, cancel_request, payment_arrangement |
| cpni_authenticated | boolean | required |
| fcr_resolved | boolean | required |
| aht_seconds | number | required |
| interaction_date | date | required |
| agent_notes | lorem.sentence |  |

# Citations

- Owned by [Genesys Cloud CX](/systems/genesys-cloud-cx.md)
