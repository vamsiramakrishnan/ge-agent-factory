---
type: Workflow Stage
title: "NLP Classification & Priority"
description: "Gemini analyzes ticket text for category, subcategory, urgency signals ('board presentation in 30 minutes'), and VIP indicators. Predicts priority based on business impact."
source_id: nlp_classification_priority
tags:
  - it
  - okf
  - brd
timestamp: "2026-07-01T00:00:00.000Z"
---

# NLP Classification & Priority

Gemini analyzes ticket text for category, subcategory, urgency signals ('board presentation in 30 minutes'), and VIP indicators. Predicts priority based on business impact.

- **Mode:** sequential
- **Stage:** 2 of 4

## Tools

- [lookup_intelligent_ticket_router_runbook](/tools/lookup-intelligent-ticket-router-runbook.md)

Next: [Intelligent Routing](/workflow/intelligent-routing.md)
