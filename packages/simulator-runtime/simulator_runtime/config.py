"""Injectable corpus location for the simulator runtime.

The engine is corpus-agnostic: point it at *any* pack directory and it serves a faithful
stateful MCP simulator for it. This module is the single source of truth for *where* the
packs live, replacing the old ``__file__``-relative paths that hard-wired the package to
one app's tree.

Resolution order (first hit wins):

1. an explicit :func:`set_packs_dir` / :func:`configure` call (programmatic override);
2. the ``GE_SIMULATOR_SYSTEMS_DIR`` environment variable;
3. a best-effort search upward from the current working directory for a
   ``simulator-systems`` directory that contains a ``registry.json``.

A pack corpus is a directory holding one ``registry.json`` (the index) plus one
sub-directory per system. ``registry.json`` may reference each system's files either
relative to the corpus dir or relative to a *repo root*; :func:`repo_root` returns the
base used to resolve those relative paths and is derived from the packs dir unless set
explicitly.
"""

from __future__ import annotations

import os
from pathlib import Path

#: Environment variable naming the pack corpus directory.
PACKS_DIR_ENV = "GE_SIMULATOR_SYSTEMS_DIR"

# Programmatic overrides (take precedence over the environment). ``None`` ⇒ unset.
_PACKS_DIR: Path | None = None
_REPO_ROOT: Path | None = None


def set_packs_dir(packs_dir: str | os.PathLike[str], repo_root: str | os.PathLike[str] | None = None) -> None:
    """Point the runtime at ``packs_dir`` (the corpus directory holding ``registry.json``).

    ``repo_root`` is the base used to resolve any *relative* file paths inside
    ``registry.json`` (legacy 6-file packs). If omitted it is derived from ``packs_dir``
    (see :func:`repo_root`). Pass it explicitly when your ``registry.json`` paths are
    rooted somewhere other than the corpus dir.
    """
    global _PACKS_DIR, _REPO_ROOT
    _PACKS_DIR = Path(packs_dir).resolve()
    _REPO_ROOT = Path(repo_root).resolve() if repo_root is not None else None


#: Alias — reads more naturally as a one-shot configuration call.
configure = set_packs_dir


def reset() -> None:
    """Clear programmatic overrides so resolution falls back to env/search (tests)."""
    global _PACKS_DIR, _REPO_ROOT
    _PACKS_DIR = None
    _REPO_ROOT = None


def _search_upward() -> Path | None:
    """Walk up from cwd looking for a ``simulator-systems`` dir with a ``registry.json``."""
    here = Path.cwd().resolve()
    for base in (here, *here.parents):
        candidate = base / "simulator-systems"
        if (candidate / "registry.json").is_file():
            return candidate
        # Also accept the canonical in-repo location, in case cwd is above it.
        nested = base / "apps" / "ge-demo-generator" / "simulator-systems"
        if (nested / "registry.json").is_file():
            return nested
    return None


def packs_dir() -> Path:
    """Return the resolved pack corpus directory.

    Raises a clear error if no corpus can be located, so misconfiguration fails loud
    instead of silently reading the wrong tree.
    """
    if _PACKS_DIR is not None:
        return _PACKS_DIR
    env = os.environ.get(PACKS_DIR_ENV)
    if env:
        return Path(env).resolve()
    found = _search_upward()
    if found is not None:
        return found
    raise RuntimeError(
        f"simulator pack corpus not found. Set {PACKS_DIR_ENV} to your packs directory "
        f"(the folder containing registry.json) or call simulator_runtime.configure(packs_dir=...)."
    )


def registry_path() -> Path:
    """Path to the corpus index (``registry.json``)."""
    return packs_dir() / "registry.json"


def repo_root() -> Path:
    """Base for resolving *relative* file paths inside ``registry.json``.

    If set explicitly via :func:`set_packs_dir`, that wins. Otherwise it is derived from
    the packs dir so the corpus is self-contained: registry paths in this repo are stored
    as ``apps/ge-demo-generator/simulator-systems/<sys>/<file>.json`` (rooted at the repo
    root), so we strip that known suffix from the packs dir to recover the root. If the
    packs dir does not end in that suffix, the packs dir itself is used as the root (which
    is correct for a self-contained corpus whose registry paths are corpus-relative).
    """
    if _REPO_ROOT is not None:
        return _REPO_ROOT
    pdir = packs_dir()
    suffix = Path("apps") / "ge-demo-generator" / "simulator-systems"
    parts = pdir.parts
    n = len(suffix.parts)
    if len(parts) >= n and Path(*parts[-n:]) == suffix:
        return Path(*parts[:-n]) if parts[:-n] else Path(pdir.anchor or ".")
    return pdir
