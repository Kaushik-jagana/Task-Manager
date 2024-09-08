const express = require('express');
const passport = require('passport');

const router = express.Router();

router.get(
  '/google',
  passport.authenticate('google', { scope: ['profile', 'email'] })
);

router.get(
  '/google/callback',
  passport.authenticate('google', { failureRedirect: 'http://localhost:3000/' }),
  (req, res) => {
    const token = req.user.generateJWT();  
    res.redirect(`http://localhost:3000/tasks?token=${token}`);
  }
);

router.get('/logout', (req, res) => {
  req.logout();  
  res.redirect('/');
});

module.exports = router;
