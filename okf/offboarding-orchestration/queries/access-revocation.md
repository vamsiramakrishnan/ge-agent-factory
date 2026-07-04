---
type: Query Capability
title: "Systematically revoke access across Google Workspace, Active Directory, and a..."
description: "Systematically revoke access across Google Workspace, Active Directory, and all connected systems. Verify revocation and handle file transfer to managers."
source_id: "access-revocation"
generation_status: inferred
tags:
  - hr
  - okf
  - brd
timestamp: "2026-07-01T00:00:00.000Z"
---

# Systematically revoke access across Google Workspace, Active Directory, and all connected systems. Verify revocation and handle file transfer to managers.

## Tools used

- [query_active_directory_directory_users](/tools/query-active-directory-directory-users.md)
- [query_google_workspace_accounts](/tools/query-google-workspace-accounts.md)

## Runs in

- [access_revocation](/workflow/access-revocation.md)

## Evidence expected

- source_system_record

## Evals

- [Run the Offboarding Orchestration workflow for the current period. Cite the relevant source-system evidence and surface any escalations required.](/tests/offboarding-orchestration-end-to-end.md)

# Citations

- [Offboarding Orchestration Policy Handbook](/documents/offboarding-orchestration-policy-handbook.md)
