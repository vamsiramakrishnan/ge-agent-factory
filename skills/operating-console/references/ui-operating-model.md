# UI Operating Model

Operator-facing console surfaces should expose capability, not just status.

## Required Concepts

- Mode: `local` or `remote`.
- Mode contract: what Factory and Autopilot can actually do.
- Mission: durable intent and ownership split.
- Jobs: long-running mutating commands.
- Workspace gates: local doctor/repair readiness.
- Remote observation: cloud factory state without pretending local repair.

## UX Rules

- Use action verbs that match capability.
- In local mode, repair buttons may run local repair.
- In remote mode, show observe/sync/handoff language.
- Keep resume tied to persisted mission state.
- Do not hide blockers behind generic failed status.
- Show artifact paths when possible.

## Visual Rules

- Dense operational UI is preferred over marketing-style explanations.
- Cards are acceptable for repeated run/job/workspace items.
- Avoid nested cards.
- Keep button labels short and action-specific.

