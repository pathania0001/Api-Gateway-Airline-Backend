
const {UserRepository} = require('../repositories')
const StatusCode = require('../utils/constants/statuscodes');
const { ApiError } = require('../utils/error');
const handleServiceError = require('../utils/error/handleServiceError');
const userRepository = new UserRepository();

const createUser = async (data) => {  
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

const getAllUsers = async () => {
    try{   
        const allUsers = await userRepository.getAll();
        return allUsers;
    } catch (error) {
        // console.log("In Services :",JSON.stringify(error,null,2));
        throw new ApiError("Error fetching all Users ",StatusCode.INTERNAL_SERVER_ERROR)
    }
}

const getUser = async (id) => {
    try{
        const user = await userRepository.get(id);
        return user;
    }
    catch(error){

         if(error instanceof ApiError){
            throw new ApiError("User Not Found",StatusCode.NOT_FOUND)
         }
        
        throw new ApiError({type:error.name,message:error.message},StatusCode.INTERNAL_SERVER_ERROR)
    }
}

const updateUser = async (id, data) => {
  try {
    const user = await userRepository.update(id, data);
    return user;
  } catch (error) {
   console.log("In Services :",JSON.stringify(error,null,2));

    if (error instanceof ApiError){

             if(error.statusCode === StatusCode.NOT_FOUND){
              throw new ApiError("User Not Found",StatusCode.NOT_FOUND)
             }

              throw new ApiError("Failed to update user",StatusCode.INTERNAL_SERVER_ERROR) 
    }
         const genError = handleServiceError(error);

         if (genError === null) 
          throw new ApiError("Error updating user", StatusCode.INTERNAL_SERVER_ERROR);
  }
};

const deleteUser = async(id)=>{
    try{
        const response = await userRepository.delete(id);
        return response;
    }catch(error){
        if (error instanceof ApiError) {
           throw new ApiError("User Id not exist",StatusCode.NOT_FOUND);
        }

     const genError = handleServiceError(error);

     if (genError === null) 
     throw new ApiError("Error updating user",StatusCode.INTERNAL_SERVER_ERROR)

    }
}

module.exports = {
    createUser,
    getAllUsers,
    getUser,
    updateUser,
    deleteUser,
}