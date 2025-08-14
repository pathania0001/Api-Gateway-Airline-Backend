
const { default: mongoose } = require('mongoose');
const {User} = require('../../models');
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
     const accessToken = await  newUser.generateAccessToken();
     const refreshToken = await  newUser.generateRefreshToken();
       newUser.refreshToken.push(refreshToken);
      const response = await newUser.save({validateBeforeSave:true,session});
      const user = response.toObject();
      await session.commitTransaction();
      //  console.log(user)
      delete user.password;
     return  { ...user,accessToken}
   } catch (error) {
      await session.abortTransaction();
      throw error;
   }finally{
    await session.endSession();
   }

   }
   
   async findOne(condition) {
      return await User.findOne(condition).select("+password") 
   }
}

module.exports = UserRepository;