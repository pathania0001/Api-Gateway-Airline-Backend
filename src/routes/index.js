const {Router} = require('express');

const v1ROutes = require('./v1');

const routes = Router();

routes.use("/v1",v1ROutes);

module.exports = routes;