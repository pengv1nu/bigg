const WINDOW_MS = 10 * 1000;
const MAX_REQUESTS = 5;

const hits = new Map();

function rateLimit(req, res, next) {
  const ip = req.ip;
  const now = Date.now();

  let entry = hits.get(ip);

  if (!entry || now > entry.resetAt) {
    entry = { count: 0, resetAt: now + WINDOW_MS };
    hits.set(ip, entry);
  }

  entry.count += 1;

  if (entry.count > MAX_REQUESTS) {
    const retryAfter = Math.ceil((entry.resetAt - now) / 1000);
    res.set('Retry-After', String(retryAfter));
    return res.status(429).json({ error: 'Слишком много запросов' });
  }

  next();
}

module.exports = rateLimit;