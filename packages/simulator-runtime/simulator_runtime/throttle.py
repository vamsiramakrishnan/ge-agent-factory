from __future__ import annotations

import random
import threading
import time
from typing import Any, Callable


# Throttling config is read off a per-tool workflow handler block (workflows.json
# `toolHandlers[<tool>]`). Both keys are optional; absent => no latency, no rate
# limiting, i.e. exactly today's behaviour.
#
#   "latency":   {"distribution": "fixed"|"uniform"|"normal", ...ms params...}
#   "rateLimit": {"capacity": <int>, "refillPerSecond": <float>, "key": "agent:system"}
#
# Latency and the clock are injectable (``sleeper``/``clock``) so tests stay fast
# and deterministic — production passes the real ``time.sleep``/``time.monotonic``.


def _resolve_latency_seconds(latency: dict[str, Any], rng: random.Random) -> float:
    """Return a sample (in seconds) from the declared latency distribution.

    All parameters are expressed in milliseconds in the contract. Unknown or empty
    distributions yield 0 (no delay).
    """
    if not latency:
        return 0.0
    dist = str(latency.get("distribution") or "fixed").strip().lower()
    if dist == "fixed":
        ms = float(latency.get("ms", latency.get("mean_ms", 0)) or 0)
    elif dist == "uniform":
        low = float(latency.get("min_ms", 0) or 0)
        high = float(latency.get("max_ms", low) or low)
        if high < low:
            low, high = high, low
        ms = rng.uniform(low, high)
    elif dist == "normal":
        mean = float(latency.get("mean_ms", 0) or 0)
        stddev = float(latency.get("stddev_ms", 0) or 0)
        ms = rng.gauss(mean, stddev) if stddev > 0 else mean
    else:
        ms = 0.0
    ms = max(0.0, ms)
    return ms / 1000.0


def apply_latency(
    latency: dict[str, Any] | None,
    *,
    rng: random.Random | None = None,
    sleeper: Callable[[float], None] = time.sleep,
) -> float:
    """Sleep for a sampled latency and return the seconds slept.

    Backward-compatible: ``latency`` of None/empty sleeps 0 and returns 0.0. Tests
    pass a fake ``sleeper`` (and seeded ``rng``) so no real time elapses.
    """
    if not latency:
        return 0.0
    seconds = _resolve_latency_seconds(latency, rng or random.Random())
    if seconds > 0:
        sleeper(seconds)
    return seconds


class TokenBucket:
    """Classic token-bucket: ``capacity`` tokens, refilled ``refill_per_second``.

    ``clock`` is injectable so tests advance a fake monotonic time instead of
    sleeping. Thread-safe for the multi-tenant FastMCP service.
    """

    def __init__(
        self,
        capacity: float,
        refill_per_second: float,
        *,
        clock: Callable[[], float] = time.monotonic,
    ) -> None:
        self.capacity = float(capacity)
        self.refill_per_second = float(refill_per_second)
        self._clock = clock
        self._tokens = float(capacity)
        self._last = clock()
        self._lock = threading.Lock()

    def _refill_locked(self) -> None:
        now = self._clock()
        elapsed = now - self._last
        if elapsed > 0:
            self._tokens = min(self.capacity, self._tokens + elapsed * self.refill_per_second)
            self._last = now

    def try_acquire(self, tokens: float = 1.0) -> bool:
        """Consume ``tokens`` if available; return False without blocking otherwise."""
        with self._lock:
            self._refill_locked()
            if self._tokens >= tokens:
                self._tokens -= tokens
                return True
            return False


class RateLimiter:
    """Registry of token buckets keyed by an opaque string (default agent:system).

    Buckets are created lazily on first use from a per-tool ``rateLimit`` config and
    share a clock so a single fake clock drives them all in tests.
    """

    def __init__(self, *, clock: Callable[[], float] = time.monotonic) -> None:
        self._clock = clock
        self._buckets: dict[str, TokenBucket] = {}
        self._lock = threading.Lock()

    def _bucket_for(self, key: str, config: dict[str, Any]) -> TokenBucket:
        with self._lock:
            bucket = self._buckets.get(key)
            if bucket is None:
                capacity = float(config.get("capacity", 0) or 0)
                refill = float(config.get("refillPerSecond", config.get("refill_per_second", 0)) or 0)
                bucket = TokenBucket(capacity, refill, clock=self._clock)
                self._buckets[key] = bucket
            return bucket

    def check(self, key: str, config: dict[str, Any]) -> bool:
        """Return True if a token is available (and consume it), False if throttled.

        A config with no positive capacity is treated as "unlimited" (returns True),
        keeping systems without a ``rateLimit`` block unthrottled.
        """
        if not config or float(config.get("capacity", 0) or 0) <= 0:
            return True
        return self._bucket_for(key, config).try_acquire(1.0)


def rate_limit_key(ctx, config: dict[str, Any] | None) -> str:
    """Build the rate-limit bucket key for ``ctx`` from the config's ``key`` field.

    Supports ``agent:system`` (default), ``agent``, ``system``, and
    ``agent:system:scenario`` so a contract can scope limits as it likes.
    """
    scheme = str((config or {}).get("key") or "agent:system").strip().lower()
    if scheme == "agent":
        return ctx.agent_id
    if scheme == "system":
        return ctx.system_id
    if scheme == "agent:system:scenario":
        return f"{ctx.agent_id}:{ctx.system_id}:{ctx.scenario_id}"
    return f"{ctx.agent_id}:{ctx.system_id}"


# Process-wide default limiter shared across handlers (mirrors the default memory
# StateStore singleton). Tests construct their own RateLimiter with a fake clock.
_DEFAULT_RATE_LIMITER = RateLimiter()


def default_rate_limiter() -> RateLimiter:
    return _DEFAULT_RATE_LIMITER
