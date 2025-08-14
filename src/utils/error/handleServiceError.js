const { StatusCodes } = require("../constants/");
const { ApiError, ValidationError } = require("./index.js");

const handleServiceError = (error) => {
  
  if (error.name === "ValidationError") {
    const explanation = Object.keys(error.errors).map((key) => {
      const { name: error_type, message } = error.errors[key];
      return { error_type, message };
    });
    throw  new ValidationError(explanation);  
  }

    else if( error.name === "TypeError")
              throw new ApiError({type:"TypeError",message:error.message},StatusCodes.INTERNAL_SERVER_ERROR)
             
    else if (error.code === 11000) {
    const duplicateField = Object.keys(error.keyPattern)[0];
    throw new ApiError(`Duplicate value for unique field: ${duplicateField}`,StatusCodes.CONFLICT);
}


   else if (error.name === "CastError") {
    throw new ApiError(`Invalid key or value in data passed : ${error.path}`, StatusCodes.BAD_REQUEST);
  }

   return;
};

module.exports = handleServiceError;
