const express = require('express');
const Middleware = require('../../middlewares');
const Controller = require('../../controllers')
const authRoutes = express.Router();

authRoutes.route('/signup')
          .post( 
               Middleware.Auth.validateUserInput,
               Controller.Auth.signUp,
          )


authRoutes.route('/login')
          .post(
               Middleware.Auth.validateLoginUserInput,
               Controller.Auth.login
          )


authRoutes.route('/refresh')
          .post(
              Controller.Auth.refreshAuthTokens
          )
    
authRoutes.route('/logout')
          .post(
               Middleware.Auth.isUserAuthenticated,
               Controller.Auth.logout
          )
module.exports = authRoutes;