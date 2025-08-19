const jwt = require('jsonwebtoken');
const { ErrorResponse, ENUMS } = require("../utils/comman");
const { ValidationError, ApiError } = require("../utils/error");
const { TOKEN_SECURITY_KEY } = require("../config");
const Service = require("../services");
const { User_Required_Fields, StatusCodes } = require('../utils/constants');

const validateUserInput = (req,res,next)=>{
  const data = req.body;
   const errors = [];
    User_Required_Fields.forEach( field =>{
               if (data[field] === undefined || data[field] === null || data[field] === '') {
                errors.push(`${field} field is required and not present in oncoming request`);
              }
          }) 

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
    if(!req?.headers?.authorization){
          throw new ApiError(["Access-Token not found"],StatusCodes.UNAUTHORIZED)
    }
   const accessToken = req.headers.authorization.split("Bearer ").slice(-1).join("")
   //console.log("accessToken :",accessToken)
     if(!accessToken)
   {
    throw new ApiError(["Access-Token not found"],StatusCodes.UNAUTHORIZED)
   }

   console.log(req.signedCookies)
   const {refreshToken} = req.signedCookies;
   if(!refreshToken){
      throw new ApiError(["Refresh Token not Found"],StatusCodes.UNAUTHORIZED)
   }

   //console.log("refreshToken :",refreshToken)
   

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
    //console.log(decoded)

    const user = await Service.User.getUserById(decoded.id);
    // console.log(user)
    if (!user) {
      throw new ApiError(["User not found"], StatusCodes.NOT_FOUND);
    }
    
   const isValidRefreshToken = user.refreshToken.includes(refreshToken);
   console.log("inside Auth middleware")
   if(!isValidRefreshToken){
    res.clearCookie("refreshToken",{
    signed:true,
    httpOnly:true,
    secure:true
  })
    throw new ApiError(["Invalide Refresh Token"],StatusCodes.UNAUTHORIZED)
   }

   req.headers["x-user-id"] = user.id;
   req.headers['x-user-role'] = user.role;
   
  } catch (error) {
    if(error.name === "TokenExpiredError"){
         error = new ApiError(["Access  Token is expired"],StatusCodes.UNAUTHORIZED) 
      }
    if(!(error instanceof ApiError))
      error = new ApiError({type:error.name,message:error.message},StatusCodes.INTERNAL_SERVER_ERROR);
   
    ErrorResponse.error = error;
    return res
             .status(error.statusCode || StatusCodes.INTERNAL_SERVER_ERROR)
             .json(error);
  }

   //console.log("accessToken :",accessToken);
  console.log("leaving Auth middleware")
   next();
} 

const isAdmin = async (req,res,next)=>{
  try {
    if(!req.headers["x-user-id"] || ! req.headers["x-user-role"]){
      throw new ApiError(["Credentials are not valid or Invalid Token"],StatusCodes.UNAUTHORIZED)
    }

    if( req.headers["x-user-role"]!== ENUMS.USER_ROLE.ADMIN)
      throw new ApiError(["Acccess Denied : Admin only"],StatusCodes.FORBIDDEN);

  } catch (error) {
    if(!(error instanceof ApiError))
      error = new ApiError({type:error.name,message:error.message},StatusCodes.INTERNAL_SERVER_ERROR)
    ErrorResponse.error = error;
    return res
             .status(error.statusCode || StatusCodes.INTERNAL_SERVER_ERROR)
             .json(ErrorResponse)
  }

  next();
}
module.exports = {
    validateUserInput,
    validateLoginUserInput,
    isUserAuthenticated,
    isAdmin,
}