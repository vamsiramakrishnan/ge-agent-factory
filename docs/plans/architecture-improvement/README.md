# Architecture Improvement Implementation Plans

> **Status (2026-07-04).** Written 2026-06-24, before the later
> [`docs/plans/taste-campaign/`](../taste-campaign/00-orchestration.md)
> (all 7 workstreams done as of 2026-07-02). That campaign substantially
> advanced this plan's Week 3 (single operator contract — see
> `01-registry-single-source.md`), Week 4 (core service decomposition — see
> `03-factory-mjs-finish.md` and `04-tools-lib-topology.md`), and Week 6
> (generated data/frontend guardrails — see `05-generated-truth.md`); check
> those docs before assuming a Week 3/4/6 item here is still open. **Weeks
> 1, 2, 5, and 7 (security hardening, IAM/Terraform ownership, state model
> cleanup, system simulators/MCP) have not been re-verified against the
> current tree** — treat their acceptance criteria as unconfirmed rather
> than done or not done until someone checks.

This folder breaks the architecture review into seven separate week-by-week implementation plans. Each plan is intended to be independently executable, reviewable, and mergeable.

## Sequence

1. [Week 1: Security Hardening](week-01-security-hardening.md)
2. [Week 2: IAM And Terraform Ownership](week-02-iam-and-terraform-ownership.md)
3. [Week 3: Single Operator Contract](week-03-single-operator-contract.md)
4. [Week 4: Core Service Decomposition](week-04-core-service-decomposition.md)
5. [Week 5: State Model Cleanup](week-05-state-model-cleanup.md)
6. [Week 6: Generated Data And Frontend Guardrails](week-06-generated-data-and-frontend-guardrails.md)
7. [Week 7: System Simulators And MCP](week-07-system-simulators-and-mcp.md)

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
