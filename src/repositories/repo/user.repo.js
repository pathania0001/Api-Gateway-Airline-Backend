
const { default: mongoose } = require('mongoose');
const {User} = require('../../models');
const StatusCodes = require('../../utils/constants/statuscodes');
const { ApiError } = require('../../utils/error');
const CrudRepositories = require('../crud.repo');
const { USER_ROLE } = require('../../utils/comman/enum');

class UserRepository extends CrudRepositories {

    constructor(){
       super(User);
    }
  async createUser(data){
   const session = await mongoose.startSession();
   session.startTransaction();
    try {
        const [user] = await User.create([data],{session}); // not user but [user] because user holds only data of user instance not actual instance of user which contains schema.methods and other utill functions
        const accessToken = await user.generteAcessToken();
        const refreshToken = await user.generateRefreshToken(session); //ensuring consistant generating and storing of token in document

        await session.commitTransaction();

         const response = {
            _id:user._id,
            name:user.name,
            age:user.age,
            email:user.email,
            role:user.role,
            accessToken,
            refreshToken,
            createdAt:user.createdAt,
         }
        return response;
    } catch (error) {
      await session.abortTransaction();
        throw error;
    }
    finally{
       session.endSession();
    }
  }

}


module.exports = UserRepository;