---
type: Query Capability
title: "Gemini analyzes ticket text for category, subcategory, urgency signals ('boar..."
description: "Gemini analyzes ticket text for category, subcategory, urgency signals ('board presentation in 30 minutes'), and VIP indicators. Predicts priority based on business impact."
source_id: "nlp-classification-priority"
generation_status: inferred
tags:
  - it
  - okf
  - brd
timestamp: "2026-07-01T00:00:00.000Z"
---

# Gemini analyzes ticket text for category, subcategory, urgency signals ('board presentation in 30 minutes'), and VIP indicators. Predicts priority based on business impact.

## Tools used

- [lookup_intelligent_ticket_router_runbook](/tools/lookup-intelligent-ticket-router-runbook.md)

## Runs in

- [nlp_classification_priority](/workflow/nlp-classification-priority.md)

## Evidence expected

- document_reference

## Evals

- [Run the Intelligent Ticket Router workflow for the current period. Cite the relevant source-system evidence and surface any escalations required.](/tests/intelligent-ticket-router-end-to-end.md)

# Citations

- [Intelligent Ticket Router Operations Runbook](/documents/intelligent-ticket-router-runbook.md)
