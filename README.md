# GE Agent Factory

GE Agent Factory turns an agent requirement into a versioned contract, generated implementation artifacts, evaluation evidence, and a handoff package for Google agents-cli / ADK / Gemini Enterprise.

The contract is stored in [OKF](docs/reference/okf.md), a Markdown-based format with structured metadata. The factory uses that contract to generate code, evals, synthetic source systems, and release evidence.

The factory does not replace agents-cli or ADK. It prepares and verifies the material handed to them.

## Quickstart

From a clone:

```bash
git clone https://github.com/vamsiramakrishnan/ge-agent-factory.git
cd ge-agent-factory
mise run setup
ge prove
mise run console
```

The first proof runs locally. Cloud credentials are needed when you hand a proven workspace to Google Cloud.

Install the factory skills from GitHub without cloning manually:

```bash
curl -fsSL https://raw.githubusercontent.com/vamsiramakrishnan/ge-agent-factory/main/packages/create-ge-agent-factory/bin/create-ge-agent-factory.mjs \
  | bun - -- --yes --skills agents
```

## Core workflow

The main path is three commands:

```bash
ge capture
ge prove
ge handoff agents-cli
```

`ge capture` creates or registers an Enterprise Agent Contract.

`ge prove` builds the workspace and runs the checks needed for the proof pack.

`ge handoff agents-cli` passes a proven workspace into the deployment path managed by agents-cli / ADK.

At any point:

```bash
ge status
```

reports the current stage and the first required next action.

## Contract to runtime

```text
user interview / BRD / PRD
          │
          ▼
Enterprise Agent Contract (OKF)
          │
          ├── generated ADK code
          ├── tool declarations
          ├── evaluation cases
          ├── synthetic source systems
          └── trace / proof inputs
          │
          ▼
       ge prove
          │
          ├── eval results
          ├── spec-to-code checks
          ├── simulation results
          └── promotion checks
          │
          ▼
      proof pack
          │
          ▼
  agents-cli / ADK
          │
          ▼
   Agent Engine
          │
          ▼
 Gemini Enterprise
```

The contract is the input to generation and evaluation. Passing generation does not by itself prove the implementation satisfies the business requirement; the proof path exists to compare generated behavior with the contract's declared criteria.

## Enterprise Agent Contract

The contract records the material the factory needs to build and test an agent, including behavior, tool intent, source systems, evaluation criteria, and generation metadata.

It is intended to be readable as a document and compilable as structured input.

See [OKF reference](docs/reference/okf.md) for the schema and examples.

## Capture

Interactive capture opens the browser-based interview flow:

```bash
ge capture
```

Register an existing contract:

```bash
ge capture --from agent-spec.json
```

A fully terminal-native interview flow is not the default capture path in the current release.

## Prove

```bash
ge prove
```

The proof path builds the agent workspace and evaluates the artifacts generated from the contract.

Depending on the workspace, that includes:

- ADK source generation;
- tool generation;
- synthetic source-system fixtures;
- eval generation and execution;
- spec-to-code trace checks;
- promotion-gate checks;
- proof-pack generation.

Use watch mode while editing a contract:

```bash
ge prove --watch
```

## Handoff

```bash
ge handoff agents-cli
```

The handoff step is where the local proof path crosses into cloud deployment.

The generated workspace is passed to agents-cli / ADK for the deployment and publication stages. Gemini Enterprise remains the end-user surface.

Nothing before handoff needs to mutate a Google Cloud deployment target.

## Coding-agent support

The repository packages common factory operations as skills so coding agents can install, inspect, build, and prove workspaces using the same CLI and project files as a human operator.

Supported installation paths include Claude Code, Gemini CLI, Codex-style sessions, Antigravity, and generic MCP clients. Product names here identify harness integrations; they are not required for the underlying CLI workflow.

For a checkout:

```bash
mise run skills-install
```

For MCP clients:

```bash
bun tools/mcp-server.mjs
```

The MCP server exposes factory operations over the same underlying functions used by the CLI.

## Catalog

The repository contains generated agent specifications for horizontal business functions and industry-specific examples.

- [Horizontal catalog](https://vamsiramakrishnan.github.io/ge-agent-factory/catalog/)
- [Vertical catalog](https://vamsiramakrishnan.github.io/ge-agent-factory/catalog-verticals/)
- [Catalog explorer](https://vamsiramakrishnan.github.io/ge-agent-factory/catalog/explorer/)

The catalog is generated from the repository registry rather than maintained as a separate hand-edited inventory.

Generated catalog output still depends on the registry generation and drift checks running successfully. A generated page is evidence of the current checked registry state, not a general guarantee that unrelated source files cannot diverge.

## Console

Run the local console with:

```bash
mise run console
```

The console exposes the same workspace state used by the CLI: contract status, proof stages, repair work, and handoff readiness.

It is an operator surface over the factory state, not a second implementation of the pipeline.

## Local and cloud boundary

The factory is local-first for contract capture, generation, simulation, and proof.

Cloud work begins when the user invokes a handoff or other command that explicitly targets cloud resources.

That boundary is deliberate because it lets contract and eval iteration happen without turning every proof run into a deployment.

## Documentation

Published docs: <https://vamsiramakrishnan.github.io/ge-agent-factory/>

Useful starting points:

- [What is the factory?](https://vamsiramakrishnan.github.io/ge-agent-factory/start/what-is-the-factory/)
- [Quickstart](https://vamsiramakrishnan.github.io/ge-agent-factory/start/quickstart/)
- [GE Agent Factory vs agents-cli](https://vamsiramakrishnan.github.io/ge-agent-factory/start/vs-agents-cli/)
- [Core concepts](https://vamsiramakrishnan.github.io/ge-agent-factory/concepts/)
- [Cookbooks](https://vamsiramakrishnan.github.io/ge-agent-factory/cookbooks/)
- [Console](https://vamsiramakrishnan.github.io/ge-agent-factory/console/)

## Repository map

```text
packages/         CLI, factory packages and generators
skills/           coding-agent skills
apps/             console and generated registry consumers
docs/             source documentation and references
tools/            MCP and development tooling
```

## Boundaries

- A generated implementation still needs evaluation against the contract.
- A passing proof establishes the checks implemented by that proof path; it is not a universal claim about production behavior.
- Synthetic source systems exercise integration logic but do not reproduce every production dependency.
- Local proof does not deploy the agent.
- `ge handoff agents-cli` is the explicit bridge into the cloud deployment path.

## Development

```bash
git clone https://github.com/vamsiramakrishnan/ge-agent-factory.git
cd ge-agent-factory
mise run setup
mise run test
```

Use `ge status` or the repository task list when you need the next supported operation rather than guessing from internal file layout.

## License

See [LICENSE](LICENSE).
