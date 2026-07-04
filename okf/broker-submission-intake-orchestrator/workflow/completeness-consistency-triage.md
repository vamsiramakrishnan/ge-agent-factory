---
type: Workflow Stage
title: "Completeness & Consistency Triage"
description: "Cross-check policy_forms, rating_worksheets, and endorsement_records for missing mandatory_attachment forms, unfiled form_source combinations, and rating inputs (exposure_base, experience_mod, schedule_mod) that don't reconcile with the submitted exposure basis."
source_id: completeness_consistency_triage
tags:
  - insurance
  - okf
  - brd
timestamp: "2026-07-04T00:00:00.000Z"
---

# Completeness & Consistency Triage

Cross-check policy_forms, rating_worksheets, and endorsement_records for missing mandatory_attachment forms, unfiled form_source combinations, and rating inputs (exposure_base, experience_mod, schedule_mod) that don't reconcile with the submitted exposure basis.

- **Mode:** sequential
- **Stage:** 2 of 5

## Tools

- [query_duck_creek_policy_policy_forms](/tools/query-duck-creek-policy-policy-forms.md)
- [action_duck_creek_policy_publish](/tools/action-duck-creek-policy-publish.md)

Next: [Broker Correspondence & Signature Tracking](/workflow/broker-correspondence-signature-tracking.md)
