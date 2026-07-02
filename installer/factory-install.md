# Factory Install Package

This document describes the plan-only install contract for installer automation. (It was once packaged as `@ge/factory-install`; the package was removed 2026-07-02 having never been integrated — recoverable from git history via `git log -- packages/factory-install`.)

It captures:

- Terraform root, tfvars, and outputs.
- Cloud Run runtime targets and image variables.
- Cloud Build target metadata.
- Command plans for init, apply, build, and verify.

The package deliberately does not execute Terraform, gcloud, or shell scripts. Those
remain operational entry points. The package gives external tools and CI a stable
contract for understanding what the installer expects and produces.
