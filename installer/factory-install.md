# Factory Install Package

`@ge/factory-install` is a plan-only package for installer automation.

It captures:

- Terraform root, tfvars, and outputs.
- Cloud Run runtime targets and image variables.
- Cloud Build target metadata.
- Command plans for init, apply, build, and verify.

The package deliberately does not execute Terraform, gcloud, or shell scripts. Those
remain operational entry points. The package gives external tools and CI a stable
contract for understanding what the installer expects and produces.
