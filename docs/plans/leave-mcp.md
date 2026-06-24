# Leave Application MCP System Plan

## Objective
Design and implement a mock Leave Application API (mimicking an enterprise system like TCS), mock the API server, generate an OpenAPI spec, wrap it in a Model Context Protocol (MCP) server (using JSON-RPC over HTTP/SSE), build a bash-native CLI for agent interaction, and create an agent skill to teach the standard operating procedure.

## Scope & Impact
*   **API & Server:** A local mock server representing the HR backend.
*   **OpenAPI Spec:** Standardized API contract.
*   **MCP Server:** Exposes the API as tools via SSE (Server-Sent Events) and JSON-RPC.
*   **CLI:** A bash-native tool (`leave-cli`) with progressive disclosure for agent use.
*   **Agent Skill:** A markdown file (`leave-application-sop.md`) teaching the agent how to use the CLI to follow standard operating procedures.

## Proposed Solution
(Node.js/TypeScript based)

### Phase 1: API Design & OpenAPI Spec
1.  **API Design**: Endpoints for balance, apply, and status.
2.  **OpenAPI Generation**: Create `openapi.yaml`.

### Phase 2: Mock API Server
1.  **Implementation**: Express.js server in TypeScript with in-memory store.

### Phase 3: MCP Server Integration
1.  **MCP Wrapper**: `@modelcontextprotocol/sdk` via HTTP/SSE transport.

### Phase 4: CLI with Progressive Disclosure
1.  **CLI Tool Development**: `commander.js` (commands: balance, apply, status).

### Phase 5: Agent Skill Construction
1.  **Skill Documentation**: Write a skill markdown to guide an agent.
