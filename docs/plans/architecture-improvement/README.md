# Architecture Improvement Implementation Plans

This folder breaks the architecture review into six separate week-by-week implementation plans. Each plan is intended to be independently executable, reviewable, and mergeable.

## Sequence

1. [Week 1: Security Hardening](week-01-security-hardening.md)
2. [Week 2: IAM And Terraform Ownership](week-02-iam-and-terraform-ownership.md)
3. [Week 3: Single Operator Contract](week-03-single-operator-contract.md)
4. [Week 4: Core Service Decomposition](week-04-core-service-decomposition.md)
5. [Week 5: State Model Cleanup](week-05-state-model-cleanup.md)
6. [Week 6: Generated Data And Frontend Guardrails](week-06-generated-data-and-frontend-guardrails.md)

## Operating Principles

- Keep every week shippable. Avoid long-running branches that mix security, infra, frontend, and refactor work.
- Prefer compatibility wrappers during migration, then remove legacy paths after the replacement is proven.
- Add tests around behavior before large refactors.
- Treat generated output, local harness artifacts, and cloud state as separate concerns.
- Default production behavior should be private, authenticated, auditable, and least-privilege.

## Suggested Merge Strategy

- Use one tracking issue for the overall effort.
- Use one PR per major bullet inside each weekly plan when blast radius is high.
- Add a short migration note to every PR that changes operator behavior.
- Run the relevant local tests and, for infra changes, capture `terraform plan` output before merge.
