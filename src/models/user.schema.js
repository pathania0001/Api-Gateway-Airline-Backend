const mongoose = require('mongoose');
const { ENUMS } = require('../utils/comman/');
const { USER_SCHEMA_ERROR } = require('./db.error.messages');
const jwt = require('jsonwebtoken');
const { ACCESS_TOKEN_EXPIRY, TOKEN_SECURITY_KEY, REFRESH_TOKEN_EXPIRY } = require('../config');
const {USER , ADMIN} = ENUMS.USER_ROLE;
const bcrypt = require('bcrypt');
const { ApiError } = require('../utils/error');
const StatusCodes = require('../utils/constants/statuscodes');
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
    },
    refreshToken:{
        type:String
    },
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

userSchema.methods.generateAccessToken = async function () {
    const accessToken = jwt.sign(
         {
            id:this._id,
            name:this.name,
            email:this.email,
            },
        TOKEN_SECURITY_KEY,
        {
            expiresIn:ACCESS_TOKEN_EXPIRY
           });
    
    return accessToken;
}

userSchema.methods.generateRefreshToken = async function(session){
    const newRefreshToken = jwt.sign({
        id:this._id,
        name:this.name,
        email:this.email
    },TOKEN_SECURITY_KEY,{
        expiresIn:REFRESH_TOKEN_EXPIRY
    })
    
    this.refreshToken = newRefreshToken;
    try {
        if(session){
     await this.save({validateBeforeSave:true , session});
    }
    else{
    await this.save({validateBeforeSave:true});
    }
    } catch (error) {
        throw new ApiError(["Error in generating Refresh Token"],StatusCodes.INTERNAL_SERVER_ERROR)
    }
   

    return this.refreshToken;
}


const User = mongoose.model('User',userSchema);


module.exports = User;