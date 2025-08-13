
const { MAX_DEVICE } = require("../config");
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
          
         const users = await userRepository.get({ username: data.username });
          const response = users[0];

          if (!response) {
               throw new ApiError("User not found", StatusCodes.NOT_FOUND);
            }

        const accessToken = await  response.generateAccessToken();
        const refreshToken = await  response.generateRefreshToken();
 
        response.refreshToken.push(refreshToken)
        
        if(response.refreshToken.length > MAX_DEVICE)
        response.refreshToken = response.refreshToken.slice(-MAX_DEVICE)

         const updatedData = await  response.save({validateBeforeSave:true});
         const user =  updatedData.toObject();
         delete user.refreshToken;      // complete array is useless only return which is newlly created;
          newData =  {...user,refreshToken,accessToken}
         return newData;
      } catch (error) {
          if(error instanceof ApiError)
            throw error
        try {
             handleServiceError(error);
             throw new ApiError("failed to login user",StatusCodes.INTERNAL_SERVER_ERROR);
        } catch (error) {
            throw error
        }
      }
}

const refreshAuthTokens = async(decodedData)=>{
    try {
        
        const response = await userRepository.getById({_id:decodedData.id})
        if(!response){
            throw ApiError(["Invalid Refresh Token"],StatusCodes.BAD_REQUEST)
        }
        
        const accessToken = await response.generateAccessToken();
        const user = response.toObject();
        delete user.refreshToken
        return {...user,accessToken}
    } catch (error) {
         if(error instanceof ApiError)
            throw error
        try {
             handleServiceError(error);
             throw new ApiError("failed to Refresh User tokens",StatusCodes.INTERNAL_SERVER_ERROR);
        } catch (error) {
            throw error
        }
    }
}

module.exports = {
    singingUp,
    signIn,
    refreshAuthTokens,
}