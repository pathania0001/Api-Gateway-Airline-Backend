const mongoose = require('mongoose');
const {PORT,DB_URI,DB_NAME} = require('../config')

const mongoDBConnect = async () => {

   try {
       const mongoDBConnectionInstance = await mongoose.connect(`${DB_URI}${DB_NAME}`);
       console.log(`Mongo DB Connection is done with host:${(mongoDBConnectionInstance.connection.host)}`);
   } catch (error) {
         console.log("mongoDB connection error",error);
         process.exit(1);
   }
}

module.exports = { mongoDBConnect }
