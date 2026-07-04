---
type: Data Entity
title: cad_document_records
description: Data entity cad_document_records owned by PTC Windchill PLM.
tags:
  - manufacturing
  - okf
  - brd
timestamp: "2026-07-04T00:00:00.000Z"
---

# cad_document_records

# Schema

| Field | Type | Constraints |
| --- | --- | --- |
| id | seq | required; primary key |
| document_number | number | required |
| document_type | enum | required; values: part_model, assembly_model, drawing, simulation_result, specification |
| revision | enum | required; values: A, B, C, D, E |
| lifecycle_state | enum | required; values: in_work, in_review, released, superseded, obsolete |
| itar_restricted | boolean | required |
| file_size_mb | float |  |
| checked_out | boolean | required |
| last_modified | date | required |
| author_name | person.fullName | required |

# Citations

- Owned by [PTC Windchill PLM](/systems/ptc-windchill-plm.md)
