# @ge/simulator-packs

Package facade for the simulator corpus currently stored under
`apps/ge-demo-generator/simulator-systems`.

The package intentionally references the existing corpus rather than copying it. That
keeps the first modularization step lightweight while giving CLIs, validators, and
external generators a standalone package entry point.

## Solves

- Gives simulator packs a package identity and manifest.
- Lets downstream tools list and validate available simulator systems without importing
  the `ge-demo-generator` app.
- Creates a clean target for a later physical move or publication of the corpus.
