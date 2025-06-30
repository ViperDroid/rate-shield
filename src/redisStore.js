const { createClient } = require('redis');

async function createRedisStore(windowMs, max, options) {
  const client = createClient({
    socket: { host: options.host, port: options.port },
    password: options.password,
  });

  await client.connect();

  return {
    async hit(key) {
      const hits = await client.incr(key);
      if (hits === 1) {
        await client.expire(key, Math.ceil(windowMs / 1000));
      }

      return {
        allowed: hits <= max,
        remaining: Math.max(0, max - hits)
      };
    }
  };
}

module.exports = { createRedisStore };
