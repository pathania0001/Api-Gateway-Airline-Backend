const mongoose = require('mongoose');
const { ENUMS } = require('../utils/comman/');
const { USER_SCHEMA_ERROR } = require('./db.error.messages');
const {USER , ADMIN} = ENUMS;
const userSchema = new mongoose.Schema({
    name: {
        type:String,
        required:true,
        trim:true,
        validate: {
            validator:function (value){
                return isNaN(value);
            },
            messgae:USER_SCHEMA_ERROR.NAME_VALIDATION
        }
    },
    
   age: {
        type: Number,
        required: true,
        min: 0,
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

const User = mongoose.model('User',userSchema);


module.exports = User;