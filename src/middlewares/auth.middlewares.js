const jwt = require('jsonwebtoken');
const { ErrorResponse } = require("../utils/comman");
const { ValidationError, ApiError } = require("../utils/error");
const { TOKEN_SECURITY_KEY } = require("../config");
const StatusCodes = require("../utils/constants/statuscodes");
const Service = require("../services")

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
const isUserAuthenticated = async(req,res,next)=>{
  
  try {
   const accessToken = req.headers.authorization.split("Bearer ").slice(-1).join("")
   console.log("accessToken :",accessToken)
     if(!accessToken)
   {
    throw new ApiError(["Access-Token not found"],StatusCodes.UNAUTHORIZED)
   }


let decoded;
    try {
      decoded = jwt.verify(accessToken,TOKEN_SECURITY_KEY);
    } catch (error) {
      console.log(error)
      if (error.name === "TokenExpiredError") {
        throw new ApiError(["Access token is expired"], StatusCodes.UNAUTHORIZED);
      }
      throw new ApiError(["Invalid token"], StatusCodes.UNAUTHORIZED);
    }

    if (!decoded?.id) {
      throw new ApiError(["Invalid token payload"], StatusCodes.UNAUTHORIZED);
    }

    const user = await Service.User.getUserById(decoded.id);
    console.log("user :",user)
    if (!user) {
      throw new ApiError(["User not found"], StatusCodes.NOT_FOUND);
    }


  } catch (error) {
    console.log(error)
    if(error.name === "TokenExpiredError"){
         error = new ApiError(["Access  Token is expired"],StatusCodes.UNAUTHORIZED) 
      }
    if(!(error instanceof ApiError))
      error = new ApiError(["Failed to Authenticate user req"],StatusCodes.INTERNAL_SERVER_ERROR);
   
    ErrorResponse.error = error;
    return res
             .status(error.statusCode || StatusCodes.INTERNAL_SERVER_ERROR)
             .json(error);
  }

   //console.log("accessToken :",accessToken);
 
  

   next();
} 
module.exports = {
    validateUserInput,
    validateLoginUserInput,
    isUserAuthenticated,
}