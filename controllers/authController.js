const db = require('../models');
const passport = require('passport');
// const jwtSecret = process.env.JWT_SECRET;
// const jwt = require('jsonwebtoken');

module.exports = {

  logOut: (req, res) => {
    req.logOut();
    res.redirect('/');
  },

  loginUser: (req, res, next) => {
    passport.authenticate('login', (err, user, info) => {
      if(err) {
        console.log(err);
        return res.redirect('/SignIn');
      }
      if(info !== undefined) {
        return res.redirect('/SignIn');
      } else {
        req.logIn(user, err => {
          db.User.findOne({
            where: {
              email: user.email
            },
          }).then(user => {
            // const token = jwt.sign({
            //   id: user.id
            // }, jwtSecret);

            // res.status(200).send({
            //   auth: true,
            //   token: token,
            //   message: 'user found & logged in',
            // });
            return res.redirect('/api/profile/');
          });
        });
      }
    })(req, res, next);
  },

  registerUser: (req, res, next) => {
      console.log("in auth controller");
    passport.authenticate('register', (err, user, info) => {
      if(err) {
        console.log(err);
      }
      if(info !== undefined) {
        res.send(info.message);
      } else {
        req.logIn(user, err => {
          const data = {
            screenname: req.body.screenname,
            email: req.body.email,
            avatar: req.body.avatar,
            favoriteTeamCode: req.body.favoriteTeamCode
          };
          db.User.findOne({
            where: {
              email: data.email
            },
          }).then(() => {
            console.log('user created in db');
            res.status(200).send({ message: 'user created' });
          });
        });
      }
    })(req, res, next);
  },

  profile: (req, res, next) => {
    passport.authenticate('jwt', { session: false }, (err, user, info) => {
      if (err) {
        console.log(err);
      }
      if(info !== undefined) {
        console.log(info.message);
        res.send(info.message);
      } else {
        console.log('user in DB from route');
        res.status(200).send({
          auth: true,
          screenname: user.screenname,
          email: user.email,
          avatar: user.avatar,
          favoriteTeamCode: user.favoriteTeamCode
        });
      }
    })(req, res, next);
  }
};
