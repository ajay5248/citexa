import time
from collections import defaultdict, deque

from fastapi import Request


class RateLimiter:
    """Simple in-memory per-IP limiter: at most `limit` calls per `window_seconds`."""

    def __init__(self, limit: int, window_seconds: int):
        self.limit = limit
        self.window_seconds = window_seconds
        self._calls = defaultdict(deque)

    def is_limited(self, request: Request) -> bool:
        ip = request.headers.get("x-forwarded-for", request.client.host if request.client else "unknown").split(",")[0].strip()
        now = time.time()
        calls = self._calls[ip]
        while calls and now - calls[0] > self.window_seconds:
            calls.popleft()
        if len(calls) >= self.limit:
            return True
        calls.append(now)
        return False
