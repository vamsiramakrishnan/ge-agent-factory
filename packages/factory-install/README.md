# @ge/factory-install

Plan-only install contract for the GE factory deployment surface.

This package does not run Terraform or Cloud Build. It packages the install contract
so other tools can inspect required tfvars, outputs, image build targets, command
plans, and runtime environment wiring without importing shell scripts or Terraform.

## Solves

- Gives install automation a versioned, testable contract.
- Makes Terraform outputs and runtime env mappings discoverable by CLIs and docs.
- Separates install planning from environment-specific execution.
