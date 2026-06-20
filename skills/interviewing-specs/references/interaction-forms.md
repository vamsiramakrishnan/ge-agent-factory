# Interaction Forms

Use interaction forms when a harness needs user input before it can safely produce or refine a spec.

The form is a runtime artifact, not prose. Emit it before doing long-running work when a missing answer changes systems, policies, simulator scope, data shape, eval design, or deployment intent.

## Contract

```json
{
  "schemaVersion": 1,
  "id": "spec-intake",
  "title": "Clarify the agent contract",
  "description": "Answer only what changes the build. Defaults are acceptable.",
  "submitLabel": "Continue",
  "questions": [
    {
      "id": "systems",
      "label": "Which systems must this agent use?",
      "type": "checkbox",
      "required": true,
      "maxSelections": 5,
      "options": [
        { "id": "workday", "label": "Workday" },
        { "id": "sap-concur", "label": "SAP Concur" }
      ]
    },
    {
      "id": "risk",
      "label": "Should write actions require approval?",
      "type": "select",
      "options": [
        { "id": "read-only", "label": "Read-only" },
        { "id": "approval", "label": "Require approval" },
        { "id": "auto-write", "label": "Allow safe writes" }
      ]
    },
    {
      "id": "notes",
      "label": "Any special policy or evidence rules?",
      "type": "textarea",
      "placeholder": "Example: cite plan documents before changing benefits."
    }
  ]
}
```

Supported `type` values:

- `radio`: one choice from options.
- `checkbox`: zero or more choices from options.
- `select`: dropdown choice from options.
- `text`: short freeform answer.
- `textarea`: longer freeform answer.

For Antigravity SDK `ask_question` hooks, `radio` and `checkbox` are emitted automatically. Skills may ask the harness to emit the richer form contract above when dropdowns or freeform fields are needed.

## Rules

1. Ask at most seven questions in one form.
2. Ask only for answers that change generated code, data, simulators, evals, policies, or deployment.
3. Provide options when the decision space is known.
4. Use `textarea` only for policy nuance, edge cases, or unstructured context.
5. Stop after emitting the form. Resume only after the runtime receives a response.
