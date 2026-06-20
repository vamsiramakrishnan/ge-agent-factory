"""Stateful simulator runtime: feed it a JSON pack corpus → a faithful MCP simulator.

Point the engine at any corpus via the ``GE_SIMULATOR_SYSTEMS_DIR`` environment variable
or programmatically with :func:`configure`::

    import simulator_runtime
    simulator_runtime.configure(packs_dir="/path/to/simulator-systems")
"""

from simulator_runtime.config import (
    PACKS_DIR_ENV,
    configure,
    packs_dir,
    registry_path,
    repo_root,
    set_packs_dir,
)
from simulator_runtime.config import reset as reset_packs_dir

__all__ = [
    "PACKS_DIR_ENV",
    "configure",
    "set_packs_dir",
    "reset_packs_dir",
    "packs_dir",
    "registry_path",
    "repo_root",
]
