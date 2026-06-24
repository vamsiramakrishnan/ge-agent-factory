# @ge/agent-resolver

Pure id-algebra for the deck↔console agent identity thread. The deck keys agents as `uc-<n>`
(slide id) + parallel `A-<n>` (agentId), both sharing one numeric core; the catalog keys them by a
slug whose use-case subtitle carries `A-<n>`.

Boundary: **pure TypeScript** — no fs/process/react/express, no bundled catalog. It normalizes id
forms (`normalizeAgentId`, `candidateKeys`, `sameAgent`); the catalog/slug resolution is done by each
consumer against its own data using `candidateKeys()`. Mirrors the pixelpitch pure-resolver pattern.
