const invalidToken = ()=> (
    new ApiError({
        type:"invalidError",
        message:"Invalid Refresh Token."
    },StatusCodes.UNAUTHORIZED))



const expiredToken = ()=>(
     new ApiError({
        type:"invalidError",
        message:"Refresh Token is Expired.Please login again"
    },StatusCodes.UNAUTHORIZED)
)
    module.exports = {
        invalidToken,
        expiredToken,   
    }