const mongoose = require('mongoose');
const { ENUMS } = require('../utils/comman/');
const { USER_SCHEMA_ERROR } = require('./db.error.messages');
const jwt = require('jsonwebtoken');
const { ACCESS_TOKEN_EXPIRY, TOKEN_SECURITY_KEY, REFRESH_TOKEN_EXPIRY } = require('../config');
const {USER , ADMIN} = ENUMS.USER_ROLE;
const bcrypt = require('bcrypt');
const userSchema = new mongoose.Schema({
    name: {
        type:String,
        required:true,
        trim:true,
        validate: {
            validator:function (value){
                return isNaN(value);
            },
            message:USER_SCHEMA_ERROR.NAME_VALIDATION
        }
    },
    username:{
        type:String,
        trim:true,
        required:true,
        unique:true
    },
   age: {
        type: Number,
        required: true,
        min: 1,
        max: 150,
        },

    email:{
        type:String,
        required:true,
        trim:true,
        unique:true,
        lowercase:true
    },
    password:{
         type: String,
        required: true,
        min: 0,
        max: 10,
        select:false,
    },
    refreshToken:[{
        type:String,
        default:[],
    }],
    role:{
        type:String,
        enum:[USER,ADMIN],
        default:USER
    },
    createdAt:{
        type:Date,
        default:Date.now
    }
},{strict:'throw'})   


userSchema.pre("save",async function (next){
   if(!this.isModified("password"))
    return next();

   this.password = await bcrypt.hash(this.password , 10);
    return next();
})

const getToken = async function (user,TOKEN_SECURITY_KEY,TOKEN_EXPIRY) {
    const Token = jwt.sign(
         {
            id:user.id,
            name:user.name,
            email:user.email,
            },
        TOKEN_SECURITY_KEY,
        {
            expiresIn:TOKEN_EXPIRY
           });
    
    return Token;
}

userSchema.methods.generateAuthTokens = async function(){
    const userData  = {
        name:this.name,
        id:this._id,
        email:this.email
    }
    const accessToken = await  getToken(userData,TOKEN_SECURITY_KEY,ACCESS_TOKEN_EXPIRY);
    const refreshToken = await getToken(userData,TOKEN_SECURITY_KEY,REFRESH_TOKEN_EXPIRY);
 
    return {refreshToken,accessToken};
}


const User = mongoose.model('User',userSchema);


module.exports = User;