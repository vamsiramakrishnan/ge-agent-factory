# Example session - enrich one OKF shard

This session shows the patch-first enrichment loop for a shard file generated
by the catalog quality tooling.

## The ask

> Operator: "Take this low-coverage HR shard to the quality threshold, but do
> not invent systems or mark anything proven manually."

Constraints extracted: only OKF, eval, fixture, and enrichment-report files are
eligible. Proof status must come from commands.

## Step 1 - inspect the shard and contracts

```console
$ sed -n '1,220p' .enrichment/shards/hr-001.json
$ rg '"id": "employee-onboarding' okf domain-packs apps/factory -n
```

Read each referenced spec and domain pack before adding evals. If the contract
does not name a field, system, tool, or authority, do not add it.

## Step 2 - generate and review patches

```console
$ node skills/enriching-okf-blueprints/scripts/apply-shard.mjs .enrichment/shards/hr-001.json
```

The script writes one patch per spec under `.enrichment/patches/`, generates
the enrichment from the source contract, and applies it through the factory
command instead of editing generated output directly.

## Step 3 - verify deterministic coverage

```console
$ node skills/enriching-okf-blueprints/scripts/verify-shard.mjs .enrichment/shards/hr-001.json
$ node skills/enriching-okf-blueprints/scripts/run-quality-audit.mjs employee-onboarding
```

Every action-tool eval should assert state mutation or no mutation. Regulated
or high-risk flows need adversarial and multi-turn coverage.

## Failure variant - missing authority

If a useful eval would require a system or permission not present in the OKF
contract, add `needs_expert_review` with the gap instead of inventing the
missing authority.

## Done

The shard's specs pass eval verification and quality audit, changed source
files are reviewable, and any remaining gaps are explicit expert-review items.
