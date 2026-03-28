import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import session from 'express-session';
import passport from 'passport';
import https from 'https';
import fs from 'fs';
import userRoutes from './routes/user.js';
import productsRoutes from './routes/ProductRoutes.js';
import announcementRoutes from './routes/AnnouncementRoutes.js';
import paymentRoutes from './routes/PaymentRoutes.js';
import adminRoutes from './routes/AdminRoutes.js';
import './auth/passport.js';
import { syncDatabase } from './models/index.js';
import { generateToken ,verifyJWT} from './config/jwt.js';
import cookieParser from 'cookie-parser';
import { startAnnouncementCacheRefresh } from './controllers/AnnouncementController.js';
import sessionnizer from './routes/sessionnizer.js';


dotenv.config();

const app = express();
const port = process.env.PORT || 4000;

await syncDatabase();
    


app.use((req, res, next) => {
  const ip = req.headers['x-forwarded-for'] || req.socket.remoteAddress;
  const method = req.method;
  const url = req.url;
  const userAgent = req.headers['user-agent'];
  console.log(`[${new Date().toISOString()}] IP: ${ip} | ${method} ${url} | User-Agent: ${userAgent}`);
  next();
});

// CORS for frontend - HTTP only
app.use(cors({
  origin: 'http://localhost:3000',
  credentials: true
}));

app.use(express.json());
app.use(cookieParser());

// Session configuration for HTTP
app.use(session({
  secret: process.env.SESSION_SECRET || 'strong-secret',
  resave: false,
  saveUninitialized: false,
  cookie: {
    maxAge: 1000 * 60 * 60 * 24, 
    httpOnly: true,
    secure: true, 
    sameSite: 'lax',
  }
}));

app.use(passport.initialize());
app.use(passport.session());

// Routes
app.use('/api/user',verifyJWT(), userRoutes);
app.use('/api/products', productsRoutes);
app.use('/api/announcements', announcementRoutes);
app.use('/api/payments',verifyJWT(), paymentRoutes);
app.use('/api/admin', verifyJWT('admin'), adminRoutes);


app.get('/auth/google', passport.authenticate('google', { scope: ['profile', 'email'] }));


app.get('/auth/google/callback', (req, res, next) => {
  console.log('Google callback received');
  passport.authenticate('google', { failureRedirect: 'http://localhost:3000/login?error=auth_failed' }, (err, user) => {
    if (err) {
      console.error('Google auth error:', err);
      return res.redirect('http://localhost:3000/login?error=auth_failed');
    }
    if (!user) {
      console.error('No user returned from Google auth');
      return res.redirect('http://localhost:3000/login?error=auth_failed');
    }
    
    req.logIn(user, err => {
      console.log('Login successful', user);
      if (err) {
        console.error('Login error:', err);
        return res.redirect('http://localhost:3000/login?error=auth_failed');
      }
      
     
      const token = generateToken(user);
      
    
      res.cookie('jwt', token, {
        httpOnly: true,
        secure: true, 
        sameSite: 'none',
        maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
      });
      console.log("this is the cookies \n"+JSON.stringify(req.cookies));
      console.log(user.role);
      if (user.role === 'admin' ) {    // require some modifications 
        res.redirect(`http://localhost:3000/account`);

        //res.redirect(`http://localhost:3000/admin/dashboard?isadmin=true`);
      } else {
        
          res.redirect(`http://localhost:3000/account`);

      }
    });
  })(req, res, next);
});

app.use('/api/session', sessionnizer);   // Costom antibot session

const sslOptions = {
  key: fs.readFileSync('./src/certs/localhost.key'),
  cert: fs.readFileSync('./src/certs/localhost.crt')
};


https.createServer(sslOptions, app).listen(port, () => {
  console.log(`Server running on https://localhost:${port}`);
});

startAnnouncementCacheRefresh();