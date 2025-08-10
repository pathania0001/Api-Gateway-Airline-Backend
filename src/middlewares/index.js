const { asyncHandler, globalError } = require('./middleware-errors');
const {validateUserInput} = require('./middleware.user');

module.exports = {
                   User: { 
                    validateUserInput,
                    },
                    asyncHandler,
                    globalError,
                 }