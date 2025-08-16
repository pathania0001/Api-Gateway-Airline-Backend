const { createProxyMiddleware } = require("http-proxy-middleware");
const { FLIGHT_SERVICE, BOOKING_SERVICE } = require("./config");
const Middleware = require('./middlewares');
const routes = require("./routes");
const authRoutes = require("./routes/auth");

module.exports = (app) => {
const public_routes = [
  {
    route:'/api/v1/flight',
    target:`${FLIGHT_SERVICE}/api/v1/flight`,
  },
];

const proetected_routes = [
  {
    route:'/flightsServices',
    target:FLIGHT_SERVICE,
  },
  {
    route:'/bookingServices',
    target:BOOKING_SERVICE,
  }
];
 
public_routes.forEach( proxy =>{
  app.use(
   `${proxy.route}`,
  createProxyMiddleware({
    target:proxy.target,
    changeOrigin: true,
    pathRewrite: { [`^${proxy.route}`]:''}
  }))
});

proetected_routes.forEach( proxy =>{
  app.use(
   `${proxy.route}`,
   Middleware.Auth.isUserAuthenticated,
  createProxyMiddleware({
    target:proxy.target,
    changeOrigin: true,
    pathRewrite: { [`^${proxy.route}`]: ''}
  }))
});


app.use('/auth',authRoutes)
app.use("/api",routes)

}