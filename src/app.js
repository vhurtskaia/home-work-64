const express = require('express');

const sessionMiddleware = require('./config/session');
const passport = require('./config/passport');

const authRoutes = require('./routes/auth');
const protectedRoutes = require('./routes/protected');

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Sessions must be set up before Passport's session middleware.
app.use(sessionMiddleware);
app.use(passport.initialize());
app.use(passport.session({}));

app.get('/', (req, res) => {
  res.json({
    message: 'Express + Passport auth server is running.',
    endpoints: {
      register: 'POST /auth/register',
      login: 'POST /auth/login',
      logout: 'POST /auth/logout',
      me: 'GET /auth/me',
      forgotPassword: 'POST /auth/forgot-password',
      resetPassword: 'POST /auth/reset-password',
      googleOAuth: 'GET /auth/google',
      protected: 'GET /protected',
    },
  });
});

app.use('/auth', authRoutes);
app.use('/protected', protectedRoutes);

app.use((req, res) => {
  res.status(404).json({ error: 'Not found' });
});

app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).json({ error: 'Внутрішня помилка сервера.' });
});

module.exports = app;
