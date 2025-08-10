

const app  = require('./app');
const {PORT} = require('./config');
const mongoDB = require('./db')
mongoDB();
app.listen(PORT,()=>{
    console.log(`server runnig at ${PORT}`);
})