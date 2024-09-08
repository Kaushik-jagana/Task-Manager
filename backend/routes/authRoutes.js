const dotenv = require('dotenv');
const express = require('express');
const passport = require('passport');
const router = express.Router();

dotenv.config();

router.get(
  '/google',
  passport.authenticate('google', { scope: ['profile', 'email'] })
);

router.get(
  '/google/callback',
  passport.authenticate('google', { failureRedirect: process.env.Frontend }),
  (req, res) => {
    const token = req.user.generateJWT();  
    res.redirect(`${process.env.Frontend}/tasks?token=${token}`);
  }
);

router.get('/logout', (req, res) => {
  req.logout();  
  res.redirect('/');
});

module.exports = router;
