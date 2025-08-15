const Service = require("../services");
const {SuccessResponse , ENUMS, ErrorResponse} = require('../utils/comman');
const { USER_ROLE } = require("../utils/comman/enum");
const { StatusCodes, User_Updatable_Fields } = require("../utils/constants");
const { ApiError } = require("../utils/error");

const addUser = async(req,res) => {
    console.log("inside user-controller-addUser")

    try {
          const user = await Service.User.createUser({
            name:req.body.name,
            username:req.body.username,
            age:req.body.age,
            email:req.body.email,
            password:req.body.password,
            role:req.body?.role || ENUMS.USER_ROLE.USER
        })
        
        delete user.refreshToken;
        delete user.accessToken;
        SuccessResponse.data = user;
            return res
                  .status(StatusCodes.CREATED)
                  .json(SuccessResponse)
    } catch (error) {
        ErrorResponse.error = error;
        res.status(error.statusCode || StatusCodes.INTERNAL_SERVER_ERROR).json(ErrorResponse)
    }

      
    
}

const getAllUsers = async (req,res) => {
    console.log("inside user-controller-getAllUsers")

      try {
           const users  = await Service.User.getAllUsers();
    SuccessResponse.data = users;
    return res
            .status(StatusCodes.SUCCESS)
            .json(SuccessResponse);
    } catch (error) {
        ErrorResponse.error = error;
        res.status(error.statusCode || StatusCodes.INTERNAL_SERVER_ERROR).json(ErrorResponse)
    }
   
}

const getUser = async(req,res)=>{
     console.log("inside user-controller-getUser")
        try {
              const {id} = req.params;
    // console.log("Params :",JSON.stringify(req,null,2))
    const user = await Service.User.getUser({id});

    SuccessResponse.data = user;

    return res
              .status(StatusCodes.SUCCESS)
              .json(SuccessResponse)
    } catch (error) {
        ErrorResponse.error = error;
        res.status(error.statusCode || StatusCodes.INTERNAL_SERVER_ERROR).json(ErrorResponse)
    }

}

const updateUser = async(req,res) => {
 console.log("inside user-controller-updateUser")
    try {
     const {id} = req.params;
    const data = req.body
    const {role} = req.user;
    if(role !== USER_ROLE.ADMIN && data?.role){        
        // delete data.role;                  
        throw new ApiError(["Request Denied : Only Admin can make change on specific fields(like :[role])"])
    }
        const dataToUpdate = {};
      const fieldsToUpdate = Object.keys(data);
          User_Updatable_Fields.forEach( field =>{
               if(fieldsToUpdate.includes(field)) {
                dataToUpdate[field] = data[field];
              }
          }) 
    const user  = await Service.User.updateUser(id,dataToUpdate);
    console.log(user)
    SuccessResponse.data = user;

    return res
              .status(StatusCodes.SUCCESS)
              .json(SuccessResponse);
    } catch (error) {
     console.error(error)
    if(!(error instanceof ApiError))
      error = new ApiError({type:error.name,message:error.message},StatusCodes.INTERNAL_SERVER_ERROR);
   
    ErrorResponse.error = error;
    return res
             .status(error.statusCode || StatusCodes.INTERNAL_SERVER_ERROR)
             .json(error);
  }

}

const deleteUser = async(req,res) => {
    console.log("inside user-controller-deleteUser")
       try {
    const { id } = req.params;
    const response = await Service.User.deleteUser(id)
    SuccessResponse.data =  response;
    return res.status(StatusCodes.SUCCESS).json(SuccessResponse);
    } catch (error) {
        ErrorResponse.error = error;
        res.status(error.statusCode || StatusCodes.INTERNAL_SERVER_ERROR).json(ErrorResponse)
    }
   

}
module.exports = {
    addUser,
    getAllUsers,
    getUser,
    updateUser,
    deleteUser,
}