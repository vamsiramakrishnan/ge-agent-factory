# Interview Contract

Use this reference only when the user request is underspecified.

## Minimum Required Facts

An ADK agent can be built when these are known or explicitly assumed:

1. Department/domain.
2. Business persona or operator.
3. Use case/workflow trigger.
4. Input the user gives the agent.
5. Output the agent must return.
6. Source systems to mock.
7. Evidence artifacts the agent should cite.
8. Success metric or before/after KPI.
9. Boundary: local-only, deployable, or publishable.

## Question Order

Ask the first missing item only:

1. "Which department or workflow are we building for?"
2. "Which of these source use cases should we use?"
3. "Who is the operator and what decision are they trying to make?"
4. "What exact user request should trigger the agent?"
5. "Which systems are mocked, and what data should each return?"
6. "What proof should the agent show in the answer?"
7. "How do we know the demo worked?"
8. "Should this stay local, be deployable, or be prepared for Gemini Enterprise?"

## Good Multiple-Choice Prompts

Prefer concrete choices:

```text
I found three strong HR candidates:
1. Interview Scheduling Copilot — recruiter + calendar + HRIS
2. Onboarding Journey Agent — new hire + LMS + HRIS + ITSM
3. Skills Gap Advisor — HRBP + talent profile + learning catalog

Which one should I build first?
```

## Stop Rules

Stop interviewing and build when:

- a use case is selected,
- at least one persona and trigger are clear,
- every required external dependency has a mock strategy,
- there is a validation target.

If only one fact is missing and a safe default exists, state the assumption and
continue.

## Brief JSON Shape

```json
{
  "name": "agent-workspace-name",
  "department": "hr",
  "useCase": {
    "title": "Interview Scheduling Copilot",
    "sourcePath": "src/components/slides/use-cases/..."
  },
  "persona": "Recruiting coordinator",
  "trigger": "Find interview slots for candidate C-1042",
  "inputs": ["candidate id", "role id", "interviewer constraints"],
  "outputs": ["recommended schedule", "evidence", "audit note"],
  "mockSystems": [
    {
      "id": "hris",
      "type": "fixture",
      "data": "candidate, requisition, recruiter ownership"
    }
  ],
  "tools": ["lookup_candidate", "find_interviewer_availability"],
  "evidence": ["source record ids", "calendar slots", "policy rule"],
  "successMetric": "coordination time reduced from 2 days to under 10 minutes",
  "boundary": "local-only",
  "validation": ["unit test for mocked tools", "eval prompt for scheduling answer"]
}
```
