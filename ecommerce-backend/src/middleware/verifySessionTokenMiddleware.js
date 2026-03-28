import crypto from 'crypto';

// Extracts a unique fingerprint from client IP + User-Agent
function getClientFingerprint(req) {
  const ua = req.headers['user-agent'] || '';
  let ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress || '';
  ip = ip.replace(/^::ffff:/, '');
  if (ip === '::1') ip = '127.0.0.1';

  return `${ua.trim()}|shitsaltingOfMyHEART`;
}

// Generate a token with fingerprint + timestamp (valid for 10 minutes)
export const generateSessionToken = (req, secret = 'super_secret_key') => {
  const timestamp = Date.now(); // in milliseconds
  const fingerprint = getClientFingerprint(req);
  const payload = `${fingerprint}|${timestamp}`;
  const hmac = crypto.createHmac('sha256', secret).update(payload).digest('base64');
  const token = `${hmac}|${timestamp}`;
  return token;
};

// Verify that the token is valid and not expired
export const verifySessionToken = (token, req, secret = 'super_secret_key', maxAgeMs = 10 * 60 * 1000) => {
  if (!token || typeof token !== 'string') return false;

  const [providedHmac, timestampStr] = token.split('|');
  if (!providedHmac || !timestampStr) return false;

  const timestamp = parseInt(timestampStr, 10);
  if (isNaN(timestamp)) return false;

  const now = Date.now();
  if (now - timestamp > maxAgeMs) {
    console.log(`[Token Expired] Token timestamp: ${timestamp}, now: ${now}`);
    return false; // Token expired
  }

  const fingerprint = getClientFingerprint(req);
  const payload = `${fingerprint}|${timestamp}`;
  const expectedHmac = crypto.createHmac('sha256', secret).update(payload).digest('base64');

  const isValid = crypto.timingSafeEqual(Buffer.from(providedHmac), Buffer.from(expectedHmac));
  console.log(`[Token Verify] Token valid: ${isValid}`);
  return isValid;
};

// Middleware to protect routes using session token
export const sessionTokenMiddleware = (req, res, next) => {
  const token = req.headers['x-session-token'];
  if (!verifySessionToken(token, req)) {
    return res.status(401).json({ error: 'session_expired' });
  }
  next();
};

export default sessionTokenMiddleware;
