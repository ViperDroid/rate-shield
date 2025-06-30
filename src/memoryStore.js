function createMemoryStore(windowMs, max) {
  const cache = new Map();

  return {
    async hit(key) {
      const now = Date.now();
      let entry = cache.get(key) || { hits: 0, resetTime: now + windowMs };

      if (now > entry.resetTime) {
        entry = { hits: 1, resetTime: now + windowMs };
      } else {
        entry.hits += 1;
      }

      cache.set(key, entry);

      return {
        allowed: entry.hits <= max,
        remaining: Math.max(0, max - entry.hits)
      };
    }
  };
}

module.exports = { createMemoryStore };
