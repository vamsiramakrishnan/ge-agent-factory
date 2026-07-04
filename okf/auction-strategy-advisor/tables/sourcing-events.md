---
type: Data Entity
title: sourcing_events
description: "Data entity sourcing_events owned by SAP Ariba e-Auction."
tags:
  - procurement
  - okf
  - brd
timestamp: "2026-07-01T00:00:00.000Z"
---

# sourcing_events

# Schema

| Field | Type | Constraints |
| --- | --- | --- |
| id | seq | required; primary key |
| counterparty | company.name | required |
| value | number | required |
| currency | enum | required; values: USD, EUR, GBP |
| start_date | date | required |
| end_date | date | required |
| status | enum | required; values: draft, negotiating, active, expired, terminated |
| auto_renew | boolean |  |
| supplier_id | ref | required |

# Citations

- Owned by [SAP Ariba e-Auction](/systems/sap-ariba-e-auction.md)
