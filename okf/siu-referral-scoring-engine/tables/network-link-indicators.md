---
type: Data Entity
title: network_link_indicators
description: Data entity network_link_indicators owned by FRISS Fraud Detection.
tags:
  - insurance
  - okf
  - brd
timestamp: "2026-07-04T00:00:00.000Z"
---

# network_link_indicators

# Schema

| Field | Type | Constraints |
| --- | --- | --- |
| id | seq | required; primary key |
| link_id | seq | required |
| claim_number | seq | required |
| linked_entity_type | enum | required; values: medical_provider, body_shop, plaintiff_attorney, claimant_shared_address, shared_phone_number, shared_bank_account, tow_operator |
| linked_entity_name | company.name | required |
| link_strength | float | required |
| claims_sharing_this_entity | number | required |
| prior_siu_substantiated_hits | number | required |
| review_status | enum | required; values: unreviewed, analyst_reviewing, cleared_benign, escalated_to_siu |
| flagged_date | date | required |

# Citations

- Owned by [FRISS Fraud Detection](/systems/friss-fraud-detection.md)
