
const jwt = require("jsonwebtoken");
const { MAX_DEVICE, TOKEN_SECURITY_KEY } = require("../config");
const { UserRepository } = require("../repositories");
const StatusCodes = require("../utils/constants/statuscodes");
const { ApiError } = require("../utils/error");
const handleServiceError = require("../utils/error/handleServiceError");

const userRepository = new UserRepository;
const singingUp = async(data) => { 
    try {
        // console.log("data receives :",data)
         const user = await userRepository.createUser(data);
         return user;
         } catch (error) {
           // console.log("for programm error or non-db error",error)
         //console.log("In Services :",JSON.stringify(error,null,2)); //  for syntax error or non-Database error (typeError or somthings else which is nondatabase related error)
         if(error instanceof ApiError)
            throw error
        try {
             handleServiceError(error);
             throw new ApiError("failed to register user during signup",StatusCodes.INTERNAL_SERVER_ERROR);
        } catch (error) {
            throw error
        }
    }

}

const signIn = async(data)=>{
      try {

         const responseUser = await userRepository.findOne({ username: data.username })
        
          if (!responseUser) {
               throw new ApiError("User not found", StatusCodes.NOT_FOUND);
            }
        const isPasswordMatch = await responseUser.verifyPassword(data.password);
        if(!isPasswordMatch)
            throw new ApiError(["Incorrect Password.Pleasee enter correct password"],StatusCodes.UNAUTHORIZED);

        const accessToken = await  responseUser.generateAccessToken();
        const refreshToken = await  responseUser.generateRefreshToken();
 
        responseUser.refreshToken.push(refreshToken)
        
        if(responseUser.refreshToken.length > MAX_DEVICE)
        responseUser.refreshToken = responseUser.refreshToken.slice(-MAX_DEVICE)

         const updatedData = await  responseUser.save({validateBeforeSave:true});
         const user =  updatedData.toObject();
         delete user.refreshToken;      // complete array is useless only return which is newlly created;
          newData =  {...user,refreshToken,accessToken}
         return newData;
      } catch (error) {
        console.log(error)
          if(error instanceof ApiError)
            throw error
             throw new ApiError("failed to login user",StatusCodes.INTERNAL_SERVER_ERROR);
      }
}

const refreshAuthTokens = async(decodedData,tokenFromReq)=>{
    try {
        // /console.log("inside in refreshAuthToken service")
        const response = await userRepository.getById({_id:decodedData.id})
        if(!response){
            throw new ApiError(["Invalid Refresh Token"],StatusCodes.BAD_REQUEST)
        }

        if (!Array.isArray(response.refreshToken)) {
         throw new ApiError(["No refresh tokens found"], StatusCodes.BAD_REQUEST);
       }
       
       const updatedTokens = await deleteExpiredToken({user:response}) 
        const isActive = updatedTokens.includes(tokenFromReq) 
        if(!isActive)
            throw new ApiError({type:"invalidError",message:"Invalid Refresh Token or Expired .Please Try to login again"},StatusCodes.BAD_REQUEST)
        const accessToken = await response.generateAccessToken();
        const user = response.toObject();
        delete user.refreshToken
        return {...user,accessToken}
    } catch (error) {
         if(error instanceof ApiError)
            throw error
             throw new ApiError(["failed to Refresh User tokens"],StatusCodes.INTERNAL_SERVER_ERROR);
       
    }
}

const deleteExpiredToken = async({userId,user})=>{
//console.log("inside in deleteExpiredTokens")
   let userInstance = user;
    if(userId){
         userInstance = await userRepository.getById(userId);
    }
     const updatedUserTokens = (userInstance.refreshToken || []).filter(token => {
    try {
        jwt.verify(token, TOKEN_SECURITY_KEY);
        return true; // keep valid token
    } catch (error) {
        //console.log(`Removing invalid/expired token: ${token}`);
        return false; // remove invalid token
    }
})   
    
    userInstance.refreshToken = updatedUserTokens;
    try {
        await userInstance.save({ fields: ['refreshToken'] });
    } catch (error) {
       // console.log(error)
        throw new ApiError(["Something Went Worng during validating RefreshToken.Please try again"],StatusCodes.INTERNAL_SERVER_ERROR);
    }
  //console.log("updatedUserTokens:",updatedUserTokens)
   return updatedUserTokens;
}

const logout = async()=>{

}
module.exports = {
    singingUp,
    signIn,
    refreshAuthTokens,
    deleteExpiredToken
}