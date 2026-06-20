# Interview Agent Specs

This directory stores interview-authored and variant-refined agent specs.

These files are source of truth because they are reviewable, diffable, and branch-friendly. The console and harness query a SQLite projection in `.ge/factory/app.sqlite`, populated by:

```bash
node apps/ge-demo-generator/scripts/sync-agent-spec-registry-db.mjs
```

## Required Shape

Each JSON file should describe one buildable agent spec:

```json
{
  "id": "benefits-assistant-successfactors-variant",
  "title": "Benefits Assistant - SuccessFactors Variant",
  "department": "hr",
  "familyId": "benefits-assistant",
  "variantOf": "benefits-assistant",
  "variant": {
    "label": "SuccessFactors source-system variant",
    "dimensions": {
      "systems": ["Replace Workday with SAP SuccessFactors"],
      "logic": ["Keep eligibility logic but change enrollment status mapping"]
    },
    "invariants": ["Keep evidence-first enrollment behavior", "Keep refusal rules"]
  },
  "systems": ["SAP SuccessFactors", "Benefits Platform", "Vertex AI"],
  "generationSpec": {}
}
```

`generationSpec` must include source systems, entities, documents, behavior contract, tool intents, evidence requirements, refusal rules, escalation rules, and golden evals. Drafts can be stored with `--allow-draft true`, but drafts are not buildable until quality gaps are fixed.

## Registration

```bash
node apps/ge-demo-generator/scripts/register-agent-spec.mjs --input spec.json
bun run generator:sync
node apps/ge-demo-generator/scripts/sync-agent-spec-registry-db.mjs
```
