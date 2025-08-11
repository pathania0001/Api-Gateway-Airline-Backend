

 const PORT = process.env.PORT;
 const DB_NAME = process.env.DB_NAME;
 const DB_URI = process.env.DB_URI;
 const FLIGHT_SERVICE = process.env.FLIGHT_SERVICE;
 const TOKEN_SECURITY_KEY = process.env.TOKEN_SECURITY_KEY;
 const ACCESS_TOKEN_EXPIRY = process.env.ACCESS_TOKEN_EXPIRY;
 const REFRESH_TOKEN_EXPIRY = process.env.REFRESH_TOKEN_EXPIRY;

module.exports = {
    PORT,
    DB_NAME,
    DB_URI,
    FLIGHT_SERVICE,
    TOKEN_SECURITY_KEY,
    ACCESS_TOKEN_EXPIRY,
    REFRESH_TOKEN_EXPIRY
}