---
type: Data Entity
title: captured_invoices
description: Data entity captured_invoices owned by Kofax/Tungsten.
tags:
  - procurement
  - okf
  - brd
timestamp: "2026-07-01T00:00:00.000Z"
---

# captured_invoices

# Schema

| Field | Type | Constraints |
| --- | --- | --- |
| id | seq | required; primary key |
| source_channel | enum | required; values: email, supplier_portal, edi, manual_upload |
| format | enum | required; values: pdf, scanned_image, edi_xml, html_email |
| vendor_id_extracted | ref | required |
| amount_extracted | number | required |
| date_received | date | required |

# Citations

- Owned by [Kofax/Tungsten](/systems/kofax-tungsten.md)
