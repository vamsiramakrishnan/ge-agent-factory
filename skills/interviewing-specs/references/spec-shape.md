# Spec Shape

A useful spec tells the factory what the agent should do, what evidence it should cite, and how it should be tested.

## Required Ideas

- persona: who the agent serves
- objective: the business outcome
- systems: source systems or simulator systems
- data: records, documents, signals, or metrics the agent must inspect
- tools/actions: read or write operations the agent may perform
- policy: constraints, approvals, forbidden actions, audit needs
- evaluation: prompt and expected behavior
- success metric: how the agent moves the business measure

## Document Contracts

Every item in `generationSpec.documents` must include:

- `id`
- `sourceSystemId`
- `type`
- `title`
- `requiredSections`
- `linkedEntities`
- `minimumWordCount`
- `citationAnchors`

Use `minimumWordCount` to size unstructured evidence for retrieval and evals. Good defaults: 500 for short SOPs, 800 for runbooks, 1200+ for policy handbooks.

## Good Spec Language

Good:

```text
Run benefits life-event enrollment review for an employee. Inspect Workday worker profile, dependent records, benefit plans, policy guide, and audit evidence. Escalate if eligibility or approval is missing.
```

Weak:

```text
Make a benefits helper.
```

## Handoff

The next station should be able to generate:

- `mock_systems/usecase-spec.json`
- `mock_systems/schema.json`
- `mock_systems/pipeline.json`
- tools and eval expectations
