const db = require('../models');
const jwtSecret = process.env.JWT_SECRET;
const jwt = require('jsonwebtoken');
const passport = require('passport');

module.exports = {
  loginUser: (req, res, next) => {
    passport.authenticate('login', {
      failureRedirect: '/SignUp'
    }, (err, user, info) => {
      if(err) {
        console.log(err);
      }
      if(info !== undefined) {
        console.log(info.message);
        res.send(info.message);
      } else {
        req.logIn(user, err => {
          db.user.findOne({
            where: {
              email: user.email
            },
          }).then(user => {
            const token = jwt.sign({ 
              id: user.id
            }, jwtSecret);
            //req.body.token = token;
          
            res.cookie('jwtAuth', token, { maxAge: 900000, httpOnly: true });

            res.status(200).send({
              auth: true,
              token: token,
              message: 'user found & logged in',
            })
              .location(`/profile/${user.id}`);
          });
        });
      }
    })(req, res, next);
  }
};