
const express = require('express');
const cors = require('cors')
const app = express()
const routes = require('./routes');
const cookieParser = require('cookie-parser');
const { COOKIE_SIGN } = require('./config');
const authRoutes = require('./routes/auth');
app.use(cors({
    origin : "*",
    credentials : true  
}))

app.use(express.json({limit:"16kb"}))
app.use(express.urlencoded({extended:true, limit:"16kb"}))
app.use(express.static("public"))
app.use(cookieParser(COOKIE_SIGN))
app.use('/auth',authRoutes)
app.use("/api",routes)

module.exports = app