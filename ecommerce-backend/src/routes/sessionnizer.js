import { generateSessionToken } from '../middleware/verifySessionTokenMiddleware.js';
import express from 'express';
const router = express.Router();






router.get('/getSessionToken', (req, res) => {
    const token = generateSessionToken(req);
    console.log(`[Session Token] Generated Token on router: ${token}`);
    res.json({ 'token': token });
  });
  export default router;
  