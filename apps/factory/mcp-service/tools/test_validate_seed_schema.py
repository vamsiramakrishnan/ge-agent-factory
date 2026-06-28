from __future__ import annotations

import sys
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parents[1]))

from tools.validate_seed_schema import (  # noqa: E402
    SIMULATOR_SYSTEMS_DIR,
    main,
    reports_with_drift,
    validate_all,
    validate_system,
)


def test_systems_dir_exists():
    assert SIMULATOR_SYSTEMS_DIR.is_dir()


def test_validate_all_finds_systems():
    reports = validate_all()
    assert reports, "expected at least one simulator system"


def test_no_seed_schema_drift_across_all_systems():
    reports = validate_all()
    drifting = reports_with_drift(reports)
    detail = "\n".join(line for r in drifting for line in r.lines())
    assert not drifting, f"seed<->schema drift detected:\n{detail}"


def test_servicenow_seed_conforms_to_schema():
    report = validate_system(SIMULATOR_SYSTEMS_DIR / "servicenow")
    assert not report.has_drift, "\n".join(report.lines())


def test_workday_seed_conforms_to_schema():
    report = validate_system(SIMULATOR_SYSTEMS_DIR / "workday")
    assert not report.has_drift, "\n".join(report.lines())


def test_main_returns_zero_when_clean():
    assert main([]) == 0


def test_main_returns_nonzero_on_drift(tmp_path):
    system = tmp_path / "broken"
    system.mkdir()
    (system / "schema.json").write_text(
        '{"collections": {"items": {"primaryKey": "id", "fields": {"id": "string"}}}}',
        "utf-8",
    )
    (system / "seed.json").write_text(
        '{"items": [{"id": "X-1", "bogus_field": "nope"}]}',
        "utf-8",
    )
    assert main([str(tmp_path)]) == 1


def test_detects_collection_not_in_schema(tmp_path):
    system = tmp_path / "broken"
    system.mkdir()
    (system / "schema.json").write_text(
        '{"collections": {"items": {"primaryKey": "id", "fields": {"id": "string"}}}}',
        "utf-8",
    )
    (system / "seed.json").write_text(
        '{"items": [{"id": "X-1"}], "ghosts": [{"id": "G-1"}]}',
        "utf-8",
    )
    report = validate_system(system)
    assert report.has_drift
    assert any(d.collection == "ghosts" for d in report.collection_drift)
