const Service = require("../services");
const {SuccessResponse} = require('../utils/comman');
const StatusCode = require("../utils/constants/statuscodes");
const addUser = async(req,res) => {
    const {name,age,email,password,role} = req.body;
        const user = await Service.user.createUser({name,age,email,password,role})
        SuccessResponse.data = user;
        return res
                  .status(StatusCode.CREATED)
                  .json(SuccessResponse)
    
}

const getAllUsers = async (req,res) => {
    const users  = await Service.user.getAllUsers();
    SuccessResponse.data = users;
    return res
            .status(StatusCode.SUCCESS)
            .json(SuccessResponse);
}

const getUser = async(req,res)=>{
    const {id} = req.params;
    // console.log("Params :",JSON.stringify(req,null,2))
    const user = await Service.user.getUser(id);

    SuccessResponse.data = user;

    return res
              .status(StatusCode.SUCCESS)
              .json(SuccessResponse)
}

const updateUser = async(req,res) => {

    const {id} = req.params;
    const data = req.body
    const user  = await Service.user.updateUser(id,data);
    
    SuccessResponse.data = user;

    return res
              .status(StatusCode.SUCCESS)
              .json(SuccessResponse);
}

const deleteUser = async(req,res) => {
    
    const { id } = req.params;
    const response = await Service.user.deleteUser(id)
    SuccessResponse.data =  response;

    return res.status(StatusCode.SUCCESS).json(SuccessResponse);

}
module.exports = {
    addUser,
    getAllUsers,
    getUser,
    updateUser,
    deleteUser,
}