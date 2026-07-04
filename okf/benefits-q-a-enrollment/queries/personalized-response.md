---
type: Query Capability
title: "Gemini generates context-aware response with personalized plan comparisons, c..."
description: "Gemini generates context-aware response with personalized plan comparisons, cost breakdowns, and actionable next steps. Initiates enrollment changes or escalates to HR."
source_id: "personalized-response"
generation_status: inferred
tags:
  - hr
  - okf
  - brd
timestamp: "2026-07-01T00:00:00.000Z"
---

# Gemini generates context-aware response with personalized plan comparisons, cost breakdowns, and actionable next steps. Initiates enrollment changes or escalates to HR.

## Tools used

- [action_benefits_platform_enroll](/tools/action-benefits-platform-enroll.md)
- [evidence_open_enrollment_guide](/tools/evidence-open-enrollment-guide.md)

## Runs in

- [personalized_response](/workflow/personalized-response.md)

## Evidence expected

- api_response
- generated_audit_trail
- document_reference

## Evals

- [I am employee EMP-0007. I just had a baby and need to move to a family Standard PPO. Please enroll me and confirm.](/tests/qle-family-tier-enrollment.md)
- [I am employee EMP-0012. Can you compare the Gold PPO and Standard PPO for me? I am not ready to enroll yet.](/tests/plan-comparison-no-action.md)

# Citations

- [2026 Benefits Open Enrollment Guide](/documents/benefits-open-enrollment-guide.md)
- [Qualified Life Event Processing SOP](/documents/life-event-processing-sop.md)
