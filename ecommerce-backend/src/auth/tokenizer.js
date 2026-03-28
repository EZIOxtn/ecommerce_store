import crypto from 'crypto';

function validateSecureTokenv2(token, req, secret = 'super_secret_key', maxAgeSec = 10) {
    try {
      const reversed = token ? token.split('').reverse().join('') : 'undefined';
      const decoded = token ? decodeURIComponent(Buffer.from(reversed, 'base64').toString()) : 'undefined';
  
      // Reverse obfuscation
      let raw = '';
      for (let i = 0; i < decoded.length; i++) {
        const ch = decoded.charCodeAt(i);
        raw += String.fromCharCode((ch - (i % 5)) ^ 42);
      }
  
      const [tokenSecret, timestamp, userAgent, endpointPath, nonce] = raw.split('|');
  
      const now = Math.floor(Date.now() / 1000);
      const withinTime = Math.abs(now - parseInt(timestamp || '0')) <= maxAgeSec;
      console.log('validateSecureTokenv2 Debug:', {
        tokenSecret,
        providedSecret: secret,
        timestamp,
        withinTime,
        endpointPath,
        reqPath: req.headers['path'],
        isValid: tokenSecret === secret && withinTime && endpointPath === req.headers['path']
      });
      console.log(req.headers['path']);
      
      const isValid =
        tokenSecret === secret &&
        withinTime &&
        endpointPath === req.headers['path'];
  
      return isValid;
    } catch (err) {
      console.log('validateSecureTokenv2 Error:', err.message);
      return false;
    }
  }
  
function validateRequestToken(token, secret = 's3cr3t', windowSeconds = 10) {
  if (!token) {
    console.log('validateRequestToken Debug: Token is missing or empty');
    return false;
  }
  const base64 = token
    .split('')
    .map((char, i) => String.fromCharCode(char.charCodeAt(0) - (i % 5)))
    .join('');

  try {
    const decoded = Buffer.from(base64, 'base64').toString();
    const [tokenSecret, timestamp] = decoded.split(':');

    const now = Math.floor(Date.now() / 1000);
    console.log('validateRequestToken Debug:', {
      tokenSecret,
      providedSecret: secret,
      timestamp,
      now,
      withinTime: Math.abs(now - parseInt(timestamp || '0')) <= windowSeconds,
      isValid: tokenSecret === secret && Math.abs(now - parseInt(timestamp || '0')) <= windowSeconds
    });
    
    const isValid =
      tokenSecret === secret &&
      Math.abs(now - parseInt(timestamp)) <= windowSeconds;

    return isValid;
  } catch (e) {
    console.log('validateRequestToken Error:', e.message);
    return false;
  }
}

export const verifier = (req, token,token2) => {
    const ip = req.socket.remoteAddress;
    const timestamp = new Date().toISOString();
    const method = req.method;
    const url = req.url;
    
    if (validateRequestToken(token) && token !== null && token !== undefined && validateSecureTokenv2(token2, req)) {
        return true
    }
    console.log(`[${timestamp}] Bot detected - IP: ${ip} | Method: ${method} | URL: ${url}`);
    return false
}



