const { ValidationError } = require("../utils/error");


const validateUserInput = (req,res,next)=>{
   const  {name,age,email,password} = req.body;
   const errors = [];

  if (!name) errors.push("name is required");
  if (!age) errors.push("age is required");
  if (!email) errors.push("email is required");
  if (!password) errors.push("password is required");

  if (errors.length > 0) {
    return next(new ValidationError(errors));
  }
  next();
}
module.exports = {
    validateUserInput,
}