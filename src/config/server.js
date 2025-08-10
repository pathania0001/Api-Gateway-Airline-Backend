
const dotenv = require("dotenv");
dotenv.config();

 const PORT = process.env.PORT;
 const DB_NAME = process.env.DB_NAME;
 const DB_URI = process.env.DB_URI;

module.exports = {
    PORT,
    DB_NAME,
    DB_URI
}