# OKF enrichment rules

- Start from `ge okf quality audit` and `ge okf enrich plan`; never freehand a mass rewrite.
- Generate patches first with `ge okf enrich generate --spec <id> --out .enrichment/patches/<id>.patch.json`.
- Apply with `ge okf enrich apply --patch <patch> --write` only after dry-run review.
- Verify with `ge okf eval verify --spec <id>`.
- Action tools require state mutation or no-mutation coverage.
- HITL gates require approval-required and approval-denied coverage.
- Sensitive specs require privacy/security/adversarial coverage.
- Proof-backed status requires matching OKF/eval/fixture/generator/workspace/proof-policy hashes.
