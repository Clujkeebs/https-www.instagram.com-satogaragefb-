/**
 * Small in-memory fixed-window rate limiter. Enough to stop a bored bot
 * hammering the order form; swap for Redis if this ever runs on more than one
 * process.
 */
export function rateLimit({ windowMs = 60 * 60 * 1000, max = 5 } = {}) {
  const hits = new Map();

  // Drop expired buckets periodically so the map cannot grow without bound.
  const sweep = setInterval(() => {
    const now = Date.now();
    for (const [key, entry] of hits) {
      if (entry.resetAt <= now) hits.delete(key);
    }
  }, windowMs).unref?.();
  void sweep;

  return function rateLimitMiddleware(req, res, next) {
    const key = req.ip || req.socket.remoteAddress || 'unknown';
    const now = Date.now();
    let entry = hits.get(key);

    if (!entry || entry.resetAt <= now) {
      entry = { count: 0, resetAt: now + windowMs };
      hits.set(key, entry);
    }

    entry.count += 1;

    if (entry.count > max) {
      const retryAfter = Math.ceil((entry.resetAt - now) / 1000);
      res.set('Retry-After', String(retryAfter));
      return res.status(429).json({
        error:
          'That is a lot of requests in a short time. Give it a few minutes, or email us directly.',
      });
    }

    return next();
  };
}

export default rateLimit;
