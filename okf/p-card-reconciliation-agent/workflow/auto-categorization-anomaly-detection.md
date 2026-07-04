---
type: Workflow Stage
title: "Auto-Categorization & Anomaly Detection"
description: "Categorize transactions to UNSPSC/GL codes using merchant codes and historical patterns. OCR receipt matching for documentation. Anomaly detection on spending patterns — unusual merchant, time of day, amount relative to cardholder history."
source_id: auto_categorization_anomaly_detection
tags:
  - procurement
  - okf
  - brd
timestamp: "2026-07-01T00:00:00.000Z"
---

# Auto-Categorization & Anomaly Detection

Categorize transactions to UNSPSC/GL codes using merchant codes and historical patterns. OCR receipt matching for documentation. Anomaly detection on spending patterns — unusual merchant, time of day, amount relative to cardholder history.

- **Mode:** sequential
- **Stage:** 2 of 4

## Tools

- [query_citibank_jp_morgan_commercial_card_citibank_jp_morgan_commercial_card_records](/tools/query-citibank-jp-morgan-commercial-card-citibank-jp-morgan-commercial-card-records.md)
- [lookup_p_card_reconciliation_agent_policy_guide](/tools/lookup-p-card-reconciliation-agent-policy-guide.md)
- [action_citibank_jp_morgan_commercial_card_approve](/tools/action-citibank-jp-morgan-commercial-card-approve.md)

Next: [LLM Interpretation & Policy Validation](/workflow/llm-interpretation-policy-validation.md)
