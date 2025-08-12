const express = require('express');
const Middleware = require('../../middlewares');

const authRoutes = express.Router();

authRoutes.route('/signup')
              .post( 
                     Middleware.Auth.validateUserInput,
                     Controller.Auth.signUp,
              )


module.exports = authRoutes;