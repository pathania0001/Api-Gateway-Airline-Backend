const { ErrorResponse } = require("../utils/comman");
const { User_Updatable_Fields, StatusCodes } = require("../utils/constants");
const { ValidationError } = require("../utils/error");

const validateUpdateUserRequest = (req,res,next)=>{
   
        const data = req.body;
           const errors = [];
           const fieldsToUpdate = Object.keys(data);
           const dataToUpdate = {};
          User_Updatable_Fields.forEach( field =>{
               if (fieldsToUpdate.includes(field) &&(data[field] === undefined || data[field] === null || data[field] === '')) {
                errors.push(`Invalid or missing value for "${field}"`);
              }
          }) 

            if (errors.length > 0) {
            const error =  new ValidationError(errors);
            ErrorResponse.error = error;
            return res.status(StatusCodes.BAD_REQUEST).json(ErrorResponse)
            }

     next();
}

module.exports = {
    validateUpdateUserRequest,
}
