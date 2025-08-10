
const {UserRepository} = require('../repositories');
const StatusCode = require('../utils/constants/statuscodes');
const { ApiError, ValidationError } = require('../utils/error');
const handleServiceError = require('../utils/error/handleServiceError');

const userRepository = new UserRepository();

const createUser = async (data) => {  
    try {
         const user = await userRepository.create(data);
         return user;
         } catch (error) {
         console.log("In Services :",JSON.stringify(error,null,2));
        
            const genError = handleServiceError(error);

         if (genError === null) throw new ApiError("Cannot Create new User Obejct",StatusCode.INTERNAL_SERVER_ERROR);
         return;
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
         console.log("In Services :",JSON.stringify(error,null,2));

         if(error instanceof ApiError){
            throw new ApiError("User Not Found",StatusCode.NOT_FOUND)
         }
         
          const genError = handleServiceError(error);

        if (genError === null) 
        throw new ApiError("Error fetching User ",StatusCode.INTERNAL_SERVER_ERROR)
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