---
type: Query Capability
title: "For common issues (password reset, access request, VPN troubleshooting), exec..."
description: "For common issues (password reset, access request, VPN troubleshooting), execute automated fixes directly. For complex issues, provide step-by-step guided troubleshooting with screenshots."
source_id: "resolution-execution"
generation_status: inferred
tags:
  - it
  - okf
  - brd
timestamp: "2026-07-01T00:00:00.000Z"
---

# For common issues (password reset, access request, VPN troubleshooting), execute automated fixes directly. For complex issues, provide step-by-step guided troubleshooting with screenshots.

## Tools used

- [action_slack_execute](/tools/action-slack-execute.md)

## Runs in

- [resolution_execution](/workflow/resolution-execution.md)

## Evidence expected

- api_response
- generated_audit_trail

## Evals

- [Run the Self-Service IT Bot workflow for the current period. Cite the relevant source-system evidence and surface any escalations required.](/tests/self-service-it-bot-end-to-end.md)

# Citations

- [Self-Service IT Bot Operations Runbook](/documents/self-service-it-bot-runbook.md)
