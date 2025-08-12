
const { default: mongoose } = require('mongoose');
const {User} = require('../../models');
const StatusCodes = require('../../utils/constants/statuscodes');
const { ApiError } = require('../../utils/error');
const CrudRepositories = require('../crud.repo');

class UserRepository extends CrudRepositories {

    constructor(){
       super(User);
    }
  async createUser(data){
   const session = await mongoose.startSession();
      session.startTransaction();
   try {
      const newUser  = new User(data);
     const {accessToken,refreshToken} = await  newUser.generateAuthTokens();
     newUser.refreshToken = refreshToken;
      const response = await newUser.save({validateBeforeSave:true,session});
      const user = response.toObject();
      await session.commitTransaction();
     return  { ...user,accessToken}
   } catch (error) {
      await session.abortTransaction();
      throw error;
   }finally{
    await session.endSession();
   }

   }
}

module.exports = UserRepository;