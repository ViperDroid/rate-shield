const { createMemoryStore } = require('./memoryStore');
const { createRedisStore } = require('./redisStore');

let store;
let storeReady = false;

/**
 * Rate limiting middleware
 * @param {object} options
 * @param {number} options.windowMs - Time window in ms
 * @param {number} options.max - Max requests
 * @param {string} [options.message] - Error message
 * @param {boolean|object} [options.redis] - Use Redis or not
 */
function rateShield(options) {
  const { windowMs, max, message = "Too many requests" } = options;

  async function initStore() {
    if (storeReady) return;

    if (typeof options.redis === 'object') {
      store = await createRedisStore(windowMs, max, options.redis);
    } else {
      store = createMemoryStore(windowMs, max);
    }

    storeReady = true;
  }

  return async function (req, res, next) {
    await initStore();

    const key = req.ip;
    const result = await store.hit(key);

    res.setHeader('X-RateLimit-Limit', max.toString());
    res.setHeader('X-RateLimit-Remaining', result.remaining.toString());

    if (!result.allowed) {
      return res.status(429).send(message);
    }

    next();
  };
}

module.exports = rateShield;
