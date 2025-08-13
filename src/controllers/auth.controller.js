
const { ErrorResponse, SuccessResponse, ENUMS } = require("../utils/comman");
const StatusCodes = require("../utils/constants/statuscodes");
const Service = require('../services');
const { ApiError } = require("../utils/error");
const jwt = require('jsonwebtoken');
const { TOKEN_SECURITY_KEY } = require("../config");
const signUp = async(req,res) =>{
  console.log("inside-auth-controller")
    try {
        const response = await Service.Auth.singingUp({
            name:req.body.name,
            username:req.body.username,
            age:req.body.age,
            email:req.body.email,
            password:req.body.password,
            role:req.body?.role || ENUMS.USER_ROLE.USER
        });
        const refToken = response.refreshToken[0];
      
        delete response?.refreshToken;
      
        SuccessResponse.data =  response;
        return res
                  .cookie("refreshToken",refToken,{
                    httpOnly:true,
                    secure:true,
                    signed:true,
                    maxAge:2*60 *1000
                  })
                  .status(StatusCodes.CREATED)
                  .json(SuccessResponse)

    } catch (error) {
        if(!(error instanceof ApiError)){  
            //wrapping typo errors from this and parent if not wrapped file 
         error = new ApiError([{type:error.name,message:error.message}],StatusCodes.INTERNAL_SERVER_ERROR)
        }
        ErrorResponse.error = error;
        return res.status(error?.statusCode || StatusCodes.INTERNAL_SERVER_ERROR).json(ErrorResponse);
        
    }
}

const login = async(req,res)=>{
  console.log(req.hostname)
  try {
    const user = await Service.Auth.signIn({
      username:req.body.username,
      password:req.body.paasword,
    })

    const refreshToken = user.refreshToken;
    delete user?.refreshToken;
    SuccessResponse.data = user;
    return res
              .cookie("refreshToken",refreshToken,{
                signed:true,
                httpOnly:true,
                secure:true,
                maxAge:2*60*1000,
              })
              .status(StatusCodes.SUCCESS)
              .json(SuccessResponse)

  } catch (error) {
     if(!(error instanceof ApiError)){  
         error = new ApiError([{type:error.name,message:error.message}],StatusCodes.INTERNAL_SERVER_ERROR)
        }
        ErrorResponse.error = error;
        return res.status(error?.statusCode || StatusCodes.INTERNAL_SERVER_ERROR).json(ErrorResponse);
        
  }
}

const refreshAuthTokens = async(req,res)=>{
  try {
       const refreshTokenFromReq = req?.signedCookies?.refreshToken;

       if(!refreshTokenFromReq)
        throw new ApiError(["Doesn't find the refreshToken in oncomming Req"],StatusCodes.BAD_REQUEST)
    
       const decodedToken =  jwt.verify(refreshTokenFromReq,TOKEN_SECURITY_KEY);
       const response =  await Service.Auth.refreshAuthTokens(decodedToken)
      
       SuccessResponse.data = response;
       
       return res
                .status(StatusCodes.SUCCESS)
                .json(SuccessResponse);

  } catch (error) {
    console.error(error)
      if(!(error instanceof ApiError)){  
         if(error.name ==="TokenExpiredError")
         error = new ApiError([{type:"Token Expired",message:"Refresh token is expired , Now you need to login again"}],StatusCodes.INTERNAL_SERVER_ERROR)
        else
         error = new ApiError([{type:error.name,message:error.message}],StatusCodes.INTERNAL_SERVER_ERROR)
        }

        ErrorResponse.error = error;
        return res.status(error?.statusCode || StatusCodes.INTERNAL_SERVER_ERROR).json(ErrorResponse);
        
  }
}
module.exports = {
  signUp,
  login,
  refreshAuthTokens,
}