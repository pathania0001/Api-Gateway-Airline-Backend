const { UserRepository } = require("../repositories");
const { ApiError } = require("../utils/error");
const handleServiceError = require("../utils/error/handleServiceError");

const userRepository = new UserRepository;
const singingUp = async(data) => { 
    try {
        console.log("data receives :",data)
         const user = await userRepository.createUser(data);
         return user;
         } catch (error) {
           // console.log("for programm error or non-db error",error)
         //console.log("In Services :",JSON.stringify(error,null,2)); //  for syntax error or non-Database error (typeError or somthings else which is nondatabase related error)
         if(error instanceof ApiError)
            throw error
        try {
             handleServiceError(error);
             throw new ApiError("Cannot Create new User Obeject",StatusCode.INTERNAL_SERVER_ERROR);
        } catch (error) {
            throw error
        }
    }

}

const login = async()=>{

}

module.exports = {
    singingUp,

}