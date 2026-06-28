from __future__ import annotations

import json
import sys
from dataclasses import dataclass, field
from pathlib import Path
from typing import Any


# tools/ -> mcp-service/ -> factory/ -> simulator-systems/
SIMULATOR_SYSTEMS_DIR = Path(__file__).resolve().parents[2] / "simulator-systems"


@dataclass
class FieldDrift:
    """A single seed record whose fields are not all declared in the schema."""

    system_id: str
    collection: str
    primary_key: str | None
    record_id: Any
    unknown_fields: list[str]

    def describe(self) -> str:
        ident = f"{self.primary_key}={self.record_id!r}" if self.primary_key else "row"
        fields = ", ".join(self.unknown_fields)
        return (
            f"{self.system_id}/{self.collection} [{ident}] "
            f"has fields not in schema: {fields}"
        )


@dataclass
class CollectionDrift:
    """A seed collection that has no matching collection in the schema."""

    system_id: str
    collection: str

    def describe(self) -> str:
        return f"{self.system_id}/{self.collection} collection not declared in schema"


@dataclass
class SystemReport:
    system_id: str
    field_drift: list[FieldDrift] = field(default_factory=list)
    collection_drift: list[CollectionDrift] = field(default_factory=list)

    @property
    def has_drift(self) -> bool:
        return bool(self.field_drift or self.collection_drift)

    def lines(self) -> list[str]:
        out = [d.describe() for d in self.collection_drift]
        out.extend(d.describe() for d in self.field_drift)
        return out


def _system_dirs(systems_dir: Path) -> list[Path]:
    return sorted(
        p
        for p in systems_dir.iterdir()
        if p.is_dir()
        and not p.name.startswith("_")
        and (p / "schema.json").exists()
        and (p / "seed.json").exists()
    )


def _schema_fields(schema: dict[str, Any]) -> dict[str, dict[str, Any]]:
    """Return {collection: {"primaryKey": pk, "fields": set(field_names)}}."""
    out: dict[str, dict[str, Any]] = {}
    for collection, spec in (schema.get("collections") or {}).items():
        out[collection] = {
            "primaryKey": spec.get("primaryKey"),
            "fields": set((spec.get("fields") or {}).keys()),
        }
    return out


def validate_system(system_dir: Path) -> SystemReport:
    """Validate one simulator system's seed.json against its schema.json."""
    system_id = system_dir.name
    report = SystemReport(system_id=system_id)

    schema = json.loads((system_dir / "schema.json").read_text("utf-8"))
    seed = json.loads((system_dir / "seed.json").read_text("utf-8"))
    schema_collections = _schema_fields(schema)

    for collection, rows in seed.items():
        if not isinstance(rows, list):
            continue
        spec = schema_collections.get(collection)
        if spec is None:
            report.collection_drift.append(
                CollectionDrift(system_id=system_id, collection=collection)
            )
            continue
        allowed = spec["fields"]
        primary_key = spec["primaryKey"]
        for row in rows:
            if not isinstance(row, dict):
                continue
            unknown = sorted(set(row.keys()) - allowed)
            if unknown:
                report.field_drift.append(
                    FieldDrift(
                        system_id=system_id,
                        collection=collection,
                        primary_key=primary_key,
                        record_id=row.get(primary_key) if primary_key else None,
                        unknown_fields=unknown,
                    )
                )
    return report


def validate_all(systems_dir: Path | None = None) -> list[SystemReport]:
    """Validate every system under simulator-systems/. Returns one report per system."""
    base = systems_dir or SIMULATOR_SYSTEMS_DIR
    return [validate_system(d) for d in _system_dirs(base)]


def reports_with_drift(reports: list[SystemReport]) -> list[SystemReport]:
    return [r for r in reports if r.has_drift]


def main(argv: list[str] | None = None) -> int:
    argv = argv if argv is not None else sys.argv[1:]
    systems_dir = Path(argv[0]).resolve() if argv else SIMULATOR_SYSTEMS_DIR

    reports = validate_all(systems_dir)
    drifting = reports_with_drift(reports)

    if not drifting:
        print(f"OK: {len(reports)} systems, no seed<->schema drift.")
        return 0

    print(f"DRIFT: {len(drifting)} of {len(reports)} systems have seed<->schema drift:")
    for report in drifting:
        for line in report.lines():
            print(f"  {line}")
    return 1


if __name__ == "__main__":
    raise SystemExit(main())
