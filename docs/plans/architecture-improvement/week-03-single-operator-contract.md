# Week 03 — Single Operator Contract

Status: complete.

The repository now exposes one supported operator contract: `ge`.

Supported command shape:

```bash
ge up
ge doctor
ge data up
ge mcp deploy
ge agents build --canary
ge agents build --all
ge agents status
ge agents logs <runId>
ge agents sync --push
```

Legacy wrapper scripts and flat `ge` aliases have been removed. Console, MCP,
factory, local harness, and one-off workspace flows should route through the
same command model and workspace artifacts.

Current quality gates:

- `artifacts/spec-code-trace.json`
- `artifacts/validation-report.json`
- `artifacts/generator-feedback.json`
- `artifacts/promotion-packet.json`
