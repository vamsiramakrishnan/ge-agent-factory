---
name: ge-snowfakery-structured-data
description: |
  Use for YAML-controlled structured data generation with Snowfakery. Owns
  OLTP and OLAP row recipes, relationships, distributions, edge cases, and
  canonical generated records before datastore-specific packaging.
triggers:
  - "Snowfakery"
  - "snowfakery recipe"
  - "YAML data generation"
  - "structured rows"
  - "OLTP"
  - "OLAP"
outputs:
  primary: mock_data/snowfakery/structured.recipe.yml
  secondary: [mock_data/plan/data-plan.yaml]
resources:
  scripts: []
  references:
    - path: references/snowfakery-recipe-contract.md
      purpose: Recipe structure, relationship, and edge-case contract.
      use_when: Writing or auditing Snowfakery YAML.
  assets:
    - path: assets/structured.recipe.yml
      purpose: Starter Snowfakery recipe template.
      use_when: Creating mock_data/snowfakery/structured.recipe.yml.
---

# GE Snowfakery Structured Data

Snowfakery is the preferred YAML control plane for structured row generation. Use it for OLTP and OLAP-shaped data.

## Commands

```bash
ge-mock plan-data --dir <workspace> --usecase <UseCaseName>
ge-mock snowfakery-recipe --dir <workspace>
```

## Responsibilities

- Generate relationship-aware rows.
- Preserve source-system IDs and audit fields.
- Include deterministic edge cases tied to KPIs.
- Produce rows usable by downstream packagers for AlloyDB, Firestore, Bigtable, and BigQuery.

## Boundary

Snowfakery generates records. It does not decide cloud deployment semantics. After recipe generation, invoke the datastore packager skills.

## Bundled Resources

- `references/snowfakery-recipe-contract.md`: when writing or auditing recipe YAML.
- `assets/structured.recipe.yml`: starter YAML template.
