const Service = require("../services");
const {SuccessResponse , ENUMS, ErrorResponse} = require('../utils/comman');
const StatusCode = require("../utils/constants/statuscodes");
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
                  .status(StatusCode.CREATED)
                  .json(SuccessResponse)
    } catch (error) {
        ErrorResponse.error = error;
        res.status(error.statusCode || StatusCode.INTERNAL_SERVER_ERROR).json(ErrorResponse)
    }

      
    
}

const getAllUsers = async (req,res) => {
    console.log("inside user-controller-getAllUsers")

      try {
           const users  = await Service.User.getAllUsers();
    SuccessResponse.data = users;
    return res
            .status(StatusCode.SUCCESS)
            .json(SuccessResponse);
    } catch (error) {
        ErrorResponse.error = error;
        res.status(error.statusCode || StatusCode.INTERNAL_SERVER_ERROR).json(ErrorResponse)
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
              .status(StatusCode.SUCCESS)
              .json(SuccessResponse)
    } catch (error) {
        ErrorResponse.error = error;
        res.status(error.statusCode || StatusCode.INTERNAL_SERVER_ERROR).json(ErrorResponse)
    }

}

const updateUser = async(req,res) => {
 console.log("inside user-controller-updateUser")
    try {
              const {id} = req.params;
    const data = req.body
    const user  = await Service.Userser.updateUser(id,data);
    
    SuccessResponse.data = user;

    return res
              .status(StatusCode.SUCCESS)
              .json(SuccessResponse);
    } catch (error) {
        ErrorResponse.error = error;
        res.status(error.statusCode || StatusCode.INTERNAL_SERVER_ERROR).json(ErrorResponse)
    }

}

const deleteUser = async(req,res) => {
    console.log("inside user-controller-deleteUser")
       try {
    const { id } = req.params;
    const response = await Service.User.deleteUser(id)
    SuccessResponse.data =  response;
    return res.status(StatusCode.SUCCESS).json(SuccessResponse);
    } catch (error) {
        ErrorResponse.error = error;
        res.status(error.statusCode || StatusCode.INTERNAL_SERVER_ERROR).json(ErrorResponse)
    }
   

}
module.exports = {
    addUser,
    getAllUsers,
    getUser,
    updateUser,
    deleteUser,
}