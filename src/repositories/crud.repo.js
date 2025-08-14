
const { StatusCodes } = require('../utils/constants');
const { ApiError } = require('../utils/error')


  class CrudRepositories {
    constructor(model){
        this.model = model;
    }

    async create(data){
        const response = await this.model.create(data);
             if(!response)
             throw new ApiError(`Failed to create Resource`,StatusCodes.INTERNAL_SERVER_ERROR);
             return response;
    }
    
    async getAll(condition){
      const response = await this.model.find(condition);
       return response;
    }
    async getOne(condition){
      const response = await this.model.findOne(condition);
       return response;
    }

    async get(id){
      const response = await this.model.findById(id);
      if(!response)
        throw new ApiError(`Resource not Found`,StatusCodes.NOT_FOUND);
      return response;
    }

    async update(id,data){

      await this.get(id);
      const response = await this.model.findByIdAndUpdate( id , data,{
        new:true,
        runValidators:true,
      })

      if(!response){
        throw new ApiError(`Failed to update Resource`,StatusCodes.INTERNAL_SERVER_ERROR);
      }

      return response;
    }

    async delete(id){

      await this.get(id);
      
      const response = await this.model.findByIdAndDelete(id);
      
      if(!response)
        throw new ApiError(`Failed to delete Resource`,StatusCodes.INTERNAL_SERVER_ERROR);

      return response;
    }
  }

  module.exports = CrudRepositories;