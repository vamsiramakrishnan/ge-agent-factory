---
type: Index
title: Query Capabilities
description: "The questions and requests this agent can answer, each with the tools it uses."
timestamp: "2026-07-01T00:00:00.000Z"
---

# Query Capabilities

- [Run terraform plan against all environments — production, staging, development. Detect differences between declared Terraform state and actual cloud infrastructure.](/queries/drift-detection.md)
- [Classify drift patterns (security group, IAM, compute config). Detect recurrence by comparing against historical drift data. Estimate blast radius of unmanaged changes.](/queries/drift-classification-analysis.md)
- [Gemini explains drift: 'Production VPC has 3 security group rules not in Terraform — added manually during the March 15 incident response. Recommend importing into Terraform or removing if workaround no longer needed.'](/queries/contextual-explanation.md)
- [Auto-generate PRs to import manual changes into Terraform state or remove stale workarounds. Each PR includes context explanation and blast radius analysis.](/queries/remediation-pr-generation.md)
