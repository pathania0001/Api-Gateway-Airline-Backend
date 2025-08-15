
const express = require('express');
const cors = require('cors')
const app = express()
const routes = require('./routes');
const cookieParser = require('cookie-parser');
const { COOKIE_SIGN, FLIGHT_SERVICE, BOOKING_SERVICE } = require('./config');
const authRoutes = require('./routes/auth');
const Middleware = require('./middlewares');
const { createProxyMiddleware } = require('http-proxy-middleware');
const { default: rateLimit } = require('express-rate-limit');

app.use(cors({
    origin : "*",
    credentials : true  
}))
app.use(cookieParser(COOKIE_SIGN))
const limiter = rateLimit({
	windowMs: 2 * 60 * 1000, // 2 minutes
	max: 30, // Limit each IP to 2 requests per `window` (here, per 15 minutes)
});


app.use(limiter);
app.use(express.json({limit:"16kb"}))
app.use(express.urlencoded({extended:true, limit:"16kb"}))
app.use(express.static("public"))

app.use(
  '/flightsServices',
  createProxyMiddleware({
    target: 'http://localhost:8001',
    changeOrigin: true,
    pathRewrite: { [`^/flightsServices`]: ''}
  })
);


app.use('/bookingServices',
    Middleware.Auth.isUserAuthenticated,
    createProxyMiddleware({
        target:BOOKING_SERVICE,
        changeOrigin:true,
        pathRewrite:{['^/bookingServices']:''}
    })
)

app.use('/auth',authRoutes)
app.use("/api",routes)

module.exports = app