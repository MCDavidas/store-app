/**
 * Created by Drapegnik on 26.03.17.
 */

import { Router } from 'express';

import passport from './passport';
import requireAuth from './requireAuth';

const router = Router();

/**
 * Route for username post request
 */
router.post('/login', (req, res, next) => {
  // eslint-disable-next-line consistent-return
  passport.authenticate('local', { failureMessage: true }, (err, user, info) => {
    if (err) {
      return next(err);
    }

    if (!user) {
      res.status(401);
      return res.send(info);
    }

    req.login(user, (loginErr) => {
      if (loginErr) {
        return next(loginErr);
      }

      const { username, firstName, lastName, role, _id } = user;

      res.status(200);
      return res.send({ username, firstName, lastName, role, id: _id });
    });
  })(req, res, next);
});

/**
 * Log out route
 */
router.get('/logout', (req, res, next) => { // eslint-disable-line no-unused-vars
  req.logout();
  res.sendStatus(200);
});

export default router;
export { passport, requireAuth };
