from __future__ import annotations

import random
import sys
from pathlib import Path
from types import SimpleNamespace

import pytest

sys.path.insert(0, str(Path(__file__).resolve().parents[1]))

from simulator_runtime import generic, throttle  # noqa: E402
from simulator_runtime.throttle import (  # noqa: E402
    RateLimiter,
    TokenBucket,
    apply_latency,
    rate_limit_key,
)


class _FakeClock:
    """A manually-advanced monotonic clock for deterministic bucket tests."""

    def __init__(self, t: float = 0.0) -> None:
        self.t = t

    def __call__(self) -> float:
        return self.t

    def advance(self, dt: float) -> None:
        self.t += dt


# --- latency injection (fake sleeper, seeded rng) ----------------------------


def test_apply_latency_absent_config_sleeps_zero():
    slept: list[float] = []
    assert apply_latency(None, sleeper=slept.append) == 0.0
    assert apply_latency({}, sleeper=slept.append) == 0.0
    assert slept == []


def test_apply_latency_fixed_distribution():
    slept: list[float] = []
    secs = apply_latency({"distribution": "fixed", "ms": 250}, sleeper=slept.append)
    assert secs == pytest.approx(0.25)
    assert slept == [pytest.approx(0.25)]


def test_apply_latency_uniform_is_deterministic_with_seed():
    rng = random.Random(7)
    slept: list[float] = []
    secs = apply_latency(
        {"distribution": "uniform", "min_ms": 100, "max_ms": 200},
        rng=rng,
        sleeper=slept.append,
    )
    assert 0.1 <= secs <= 0.2
    # Same seed reproduces the same sample.
    assert apply_latency(
        {"distribution": "uniform", "min_ms": 100, "max_ms": 200},
        rng=random.Random(7),
        sleeper=lambda s: None,
    ) == secs


def test_apply_latency_normal_clamps_non_negative():
    rng = random.Random(1)
    secs = apply_latency(
        {"distribution": "normal", "mean_ms": 1, "stddev_ms": 1000},
        rng=rng,
        sleeper=lambda s: None,
    )
    assert secs >= 0.0


def test_apply_latency_unknown_distribution_is_zero():
    slept: list[float] = []
    assert apply_latency({"distribution": "weird", "ms": 99}, sleeper=slept.append) == 0.0
    assert slept == []


# --- token bucket ------------------------------------------------------------


def test_token_bucket_allows_up_to_capacity_then_blocks():
    clock = _FakeClock()
    bucket = TokenBucket(capacity=3, refill_per_second=1, clock=clock)
    assert bucket.try_acquire() is True
    assert bucket.try_acquire() is True
    assert bucket.try_acquire() is True
    assert bucket.try_acquire() is False  # exhausted, no time passed


def test_token_bucket_refills_over_fake_time():
    clock = _FakeClock()
    bucket = TokenBucket(capacity=2, refill_per_second=2, clock=clock)
    assert bucket.try_acquire()
    assert bucket.try_acquire()
    assert bucket.try_acquire() is False
    clock.advance(0.5)  # 0.5s * 2/s = 1 token
    assert bucket.try_acquire() is True
    assert bucket.try_acquire() is False


def test_token_bucket_caps_at_capacity():
    clock = _FakeClock()
    bucket = TokenBucket(capacity=2, refill_per_second=100, clock=clock)
    clock.advance(10)  # would add 1000 tokens, but capacity caps at 2
    assert bucket.try_acquire()
    assert bucket.try_acquire()
    assert bucket.try_acquire() is False


# --- rate limiter registry ---------------------------------------------------


def test_rate_limiter_no_config_is_unlimited():
    limiter = RateLimiter(clock=_FakeClock())
    for _ in range(100):
        assert limiter.check("k", {}) is True
        assert limiter.check("k", None) is True


def test_rate_limiter_zero_capacity_is_unlimited():
    limiter = RateLimiter(clock=_FakeClock())
    for _ in range(10):
        assert limiter.check("k", {"capacity": 0, "refillPerSecond": 1}) is True


def test_rate_limiter_enforces_capacity_per_key():
    clock = _FakeClock()
    limiter = RateLimiter(clock=clock)
    cfg = {"capacity": 2, "refillPerSecond": 1}
    assert limiter.check("agent:sys", cfg) is True
    assert limiter.check("agent:sys", cfg) is True
    assert limiter.check("agent:sys", cfg) is False
    # A different key has its own independent bucket.
    assert limiter.check("other:sys", cfg) is True


def test_rate_limiter_refills_with_fake_clock():
    clock = _FakeClock()
    limiter = RateLimiter(clock=clock)
    cfg = {"capacity": 1, "refillPerSecond": 1}
    assert limiter.check("k", cfg) is True
    assert limiter.check("k", cfg) is False
    clock.advance(1.0)
    assert limiter.check("k", cfg) is True


# --- key scheme --------------------------------------------------------------


def _ctx():
    return SimpleNamespace(agent_id="A", system_id="S", scenario_id="SC")


def test_rate_limit_key_schemes():
    ctx = _ctx()
    assert rate_limit_key(ctx, None) == "A:S"
    assert rate_limit_key(ctx, {}) == "A:S"
    assert rate_limit_key(ctx, {"key": "agent:system"}) == "A:S"
    assert rate_limit_key(ctx, {"key": "agent"}) == "A"
    assert rate_limit_key(ctx, {"key": "system"}) == "S"
    assert rate_limit_key(ctx, {"key": "agent:system:scenario"}) == "A:S:SC"


# --- end-to-end through generic submit handler -------------------------------


def _contract(handler_extra: dict) -> dict:
    workflow = {
        "collection": "things",
        "primaryKey": "thing_id",
        "stateField": "status",
        "transitions": {"*": ["active", "closed"]},
    }
    workflow.update(handler_extra)
    return {
        "schema": {"collections": {"things": {"primaryKey": "thing_id", "fields": {"status": {}}}}},
        "toolCatalog": {
            "tools": [
                {
                    "name": "submit_thing_update",
                    "inputSchema": {"type": "object", "properties": {"thing_id": {}, "status": {}}},
                }
            ]
        },
        "workflowCatalog": {"toolHandlers": {"submit_thing_update": workflow}},
    }


def _handler_ctx(contract, scenario):
    handler = generic.build_generic_handlers(contract)["submit_thing_update"]
    ctx = SimpleNamespace(
        agent_id="agent-thr",
        system_id="__throttle_system__",
        scenario_id=scenario,
        actor="x@example.com",
        role="hr_partner",
    )
    state = generic.generic_state(ctx)
    state["things"] = [{"thing_id": "T-1", "status": "active"}]
    state.setdefault("audit_events", [])
    generic._save_state(ctx, state)
    return handler, ctx


def test_submit_handler_no_throttle_config_behaves_as_before():
    handler, ctx = _handler_ctx(_contract({}), "scn-plain")
    result = handler(ctx, {"thing_id": "T-1", "status": "closed"})
    assert result["thing"]["status"] == "closed"


def test_submit_handler_latency_does_not_use_real_time(monkeypatch):
    # Latency config present, but we assert the handler still returns (and is fast)
    # by patching the module-level apply_latency to record the call without sleeping.
    calls: list[dict] = []
    monkeypatch.setattr(throttle, "apply_latency", lambda cfg: calls.append(cfg))
    handler, ctx = _handler_ctx(
        _contract({"latency": {"distribution": "fixed", "ms": 5000}}), "scn-lat"
    )
    result = handler(ctx, {"thing_id": "T-1", "status": "closed"})
    assert result["thing"]["status"] == "closed"
    assert calls == [{"distribution": "fixed", "ms": 5000}]


def test_submit_handler_rate_limit_raises_when_exhausted(monkeypatch):
    from simulator_runtime.simulators import SimulatorError

    # Drive the handler through a limiter we control via a fake clock.
    clock = _FakeClock()
    limiter = RateLimiter(clock=clock)
    monkeypatch.setattr(throttle, "default_rate_limiter", lambda: limiter)

    handler, ctx = _handler_ctx(
        _contract({"rateLimit": {"capacity": 1, "refillPerSecond": 1}}), "scn-rl"
    )
    # First call consumes the only token and succeeds.
    handler(ctx, {"thing_id": "T-1", "status": "active"})
    # Second call (no time advanced) is throttled.
    with pytest.raises(SimulatorError) as excinfo:
        handler(ctx, {"thing_id": "T-1", "status": "closed"})
    assert excinfo.value.code == "rate_limited"
    # After refill, it works again.
    clock.advance(1.0)
    result = handler(ctx, {"thing_id": "T-1", "status": "closed"})
    assert result["thing"]["status"] == "closed"
