
const { StatusCodes } = require("../constants");
const ApiError = require("./api.error");
class ValidationError extends ApiError {
    constructor(feilds=[]){
        super("Validation Failed",StatusCodes.BAD_REQUEST)
        this.feilds = feilds;
    }
}

module.exports = ValidationError;