const {Router} = require('express');
const userRoutes = require('./user/user.route')

const v1ROutes = Router();

v1ROutes.use('/users',userRoutes);

module.exports = v1ROutes;
