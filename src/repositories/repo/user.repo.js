
const {User} = require('../../models');
const CrudRepositories = require('../crud.repo');

class UserRepository extends CrudRepositories {
    constructor(){
       super(User);
    }
}


module.exports = UserRepository;