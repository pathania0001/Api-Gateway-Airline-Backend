const { ErrorResponse } = require("../utils/comman");
const { ValidationError } = require("../utils/error");


const validateUserInput = (req,res,next)=>{
   const  {name,username,age,email,password} = req.body;
   const errors = [];

  if (!name) errors.push("name is required");
  if (!username) errors.push("username is required");
  if (!age) errors.push("age is required");
  if (!email) errors.push("email is required");
  if (!password) errors.push("password is required");

  if (errors.length > 0) {
    const error =  new ValidationError(errors);
    ErrorResponse.error = error;
    return res.status(StatusCodes.BAD_REQUEST).json(ErrorResponse)
  }
  next();
}
const validateLoginUserInput = (req,res,next)=>{
   const  {username,password} = req.body;
   const errors = [];

  if (!username) errors.push("username is required");

  if (!password) errors.push("password is required");

  if (errors.length > 0) {
    const error =  new ValidationError(errors);
    ErrorResponse.error = error;
    return res.status(StatusCodes.BAD_REQUEST).json(ErrorResponse)
  }
  next();
}
module.exports = {
    validateUserInput,
    validateLoginUserInput,
}