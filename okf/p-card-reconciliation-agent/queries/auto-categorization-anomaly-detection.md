---
type: Query Capability
title: Categorize transactions to UNSPSC/GL codes using merchant codes and historica...
description: "Categorize transactions to UNSPSC/GL codes using merchant codes and historical patterns. OCR receipt matching for documentation. Anomaly detection on spending patterns — unusual merchant, time of day, amount relative to cardholder history."
source_id: "auto-categorization-anomaly-detection"
generation_status: inferred
tags:
  - procurement
  - okf
  - brd
timestamp: "2026-07-01T00:00:00.000Z"
---

# Categorize transactions to UNSPSC/GL codes using merchant codes and historical patterns. OCR receipt matching for documentation. Anomaly detection on spending patterns — unusual merchant, time of day, amount relative to cardholder history.

## Tools used

- [query_citibank_jp_morgan_commercial_card_citibank_jp_morgan_commercial_card_records](/tools/query-citibank-jp-morgan-commercial-card-citibank-jp-morgan-commercial-card-records.md)
- [lookup_p_card_reconciliation_agent_policy_guide](/tools/lookup-p-card-reconciliation-agent-policy-guide.md)
- [action_citibank_jp_morgan_commercial_card_approve](/tools/action-citibank-jp-morgan-commercial-card-approve.md)

## Runs in

- [auto_categorization_anomaly_detection](/workflow/auto-categorization-anomaly-detection.md)

## Evidence expected

- source_system_record
- document_reference
- api_response
- generated_audit_trail

## Evals

- [Run the P-Card Reconciliation Agent workflow for the current period. Cite the relevant source-system evidence and surface any escalations required.](/tests/p-card-reconciliation-agent-end-to-end.md)

# Citations

- [P-Card Reconciliation Agent Procurement Policy Guide](/documents/p-card-reconciliation-agent-policy-guide.md)
