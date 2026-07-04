---
type: Workflow Stage
title: "Offer Approval & Audit Trail"
description: "Execute action_genesys_cloud_cx_approve in Genesys Cloud CX for in-guardrail offers, writing an audit_record_id and action_id, and escalate any offer above cap or backed by single-system evidence to the Retention Marketing Manager or retention_supervisor."
source_id: offer_approval_audit_trail
tags:
  - telco
  - okf
  - brd
timestamp: "2026-07-04T00:00:00.000Z"
---

# Offer Approval & Audit Trail

Execute action_genesys_cloud_cx_approve in Genesys Cloud CX for in-guardrail offers, writing an audit_record_id and action_id, and escalate any offer above cap or backed by single-system evidence to the Retention Marketing Manager or retention_supervisor.

- **Mode:** sequential
- **Stage:** 4 of 5

## Tools

- [query_genesys_cloud_cx_customer_interactions](/tools/query-genesys-cloud-cx-customer-interactions.md)
- [action_genesys_cloud_cx_approve](/tools/action-genesys-cloud-cx-approve.md)

Next: [Fix-Verification Follow-Up](/workflow/fix-verification-follow-up.md)
