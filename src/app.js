
const express = require('express');
const cors = require('cors')
const app = express()
const cookieParser = require('cookie-parser');
const { COOKIE_SIGN} = require('./config');

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

require('./routeHandling')(app)

module.exports = app